const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

class DatabaseService {
  constructor() {
    this.isFallback = false;
    this.fallbackDir = path.join(__dirname, '..', '..', 'data');
    this.paths = {
      users: path.join(this.fallbackDir, 'users.json'),
      tasks: path.join(this.fallbackDir, 'tasks.json')
    };
  }

  async connect() {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task_manager';
    try {
      console.log('Attempting to connect to MongoDB at:', mongoUri);
      // Set short connection timeout to fail fast if Mongo is not running
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 2000
      });
      console.log('Successfully connected to MongoDB.');
      this.isFallback = false;
    } catch (error) {
      console.warn('MongoDB connection failed. Switching to JSON File Database fallback.');
      console.warn('Error details:', error.message);
      this.isFallback = true;
      this._initFallbackDb();
    }
  }

  _initFallbackDb() {
    try {
      if (!fs.existsSync(this.fallbackDir)) {
        fs.mkdirSync(this.fallbackDir, { recursive: true });
      }

      // Initialize empty arrays if files don't exist
      for (const [key, filePath] of Object.entries(this.paths)) {
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf-8');
          console.log(`Created fallback database file for: ${key}`);
        }
      }
      console.log('JSON File Database fallback initialized successfully.');
    } catch (err) {
      console.error('Failed to initialize JSON database fallback:', err.message);
    }
  }

  // Helper methods to read/write JSON files when in fallback mode
  readData(collectionName) {
    if (!this.isFallback) return null;
    const filePath = this.paths[collectionName];
    if (!filePath || !fs.existsSync(filePath)) return [];
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error(`Error reading ${collectionName} JSON database:`, err.message);
      return [];
    }
  }

  writeData(collectionName, data) {
    if (!this.isFallback) return false;
    const filePath = this.paths[collectionName];
    if (!filePath) return false;
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error(`Error writing to ${collectionName} JSON database:`, err.message);
      return false;
    }
  }
}

// Export a singleton instance of the database service
module.exports = new DatabaseService();
