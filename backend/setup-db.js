require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const fs = require('fs');
const path = require('path');

async function createDatabase() {
  const useSqlite = (process.env.USE_SQLITE || 'false').toLowerCase() === 'true';
  if (useSqlite) {
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    const sqliteFile = path.join(dataDir, 'database.sqlite');
    if (!fs.existsSync(sqliteFile)) fs.writeFileSync(sqliteFile, '');
    console.log(`SQLite database file ensured at: ${sqliteFile}`);
    return;
  }

  // If not using SQLite, attempt to create MySQL database (if MySQL is reachable)
  try {
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
    });

    const dbName = process.env.DB_NAME || 'task_manager_db';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Database '${dbName}' created or already exists.`);

    await connection.end();
  } catch (error) {
    console.error('Error creating database:', error);
    process.exit(1);
  }
}

createDatabase();
