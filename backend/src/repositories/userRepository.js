const User = require('../models/User');
const db = require('../config/db');

class UserRepository {
  constructor() {
    this.collectionName = 'users';
  }

  async create(userData) {
    if (!db.isFallback) {
      const user = new User(userData);
      return await user.save();
    } else {
      const users = db.readData(this.collectionName);
      // Generate a mock hex ID similar to Mongo's ObjectId
      const mockId = Math.random().toString(16).substring(2, 14) + Math.random().toString(16).substring(2, 14);
      const newUser = {
        _id: mockId,
        ...userData,
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      db.writeData(this.collectionName, users);
      return newUser;
    }
  }

  async findByEmail(email) {
    if (!db.isFallback) {
      return await User.findOne({ email: email.toLowerCase() });
    } else {
      const users = db.readData(this.collectionName);
      return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    }
  }

  async findByUsername(username) {
    if (!db.isFallback) {
      return await User.findOne({ username });
    } else {
      const users = db.readData(this.collectionName);
      return users.find(u => u.username === username) || null;
    }
  }

  async findById(id) {
    if (!db.isFallback) {
      return await User.findById(id);
    } else {
      const users = db.readData(this.collectionName);
      return users.find(u => u._id.toString() === id.toString()) || null;
    }
  }
}

module.exports = new UserRepository();
