const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });
const { Sequelize } = require('sequelize');
const fs = require('fs');

const useSqlite = (process.env.USE_SQLITE || 'false').toLowerCase() === 'true';

let sequelize;

if (useSqlite) {
  const dataDir = path.join(__dirname, '..', '..', 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const storagePath = path.join(dataDir, 'database.sqlite');

  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: false,
  });

  console.log('ℹ️ Menggunakan SQLite fallback:', storagePath);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'task_manager_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false,
    }
  );
}

const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Terhubung ke database menggunakan Sequelize.');
    await sequelize.sync({ alter: true });
    console.log('✅ Semua model telah sinkron dengan database.');
  } catch (error) {
    console.error('❌ Gagal terhubung ke database:', error);
    console.error(error.stack);
    if (!useSqlite) {
      console.error('➡️ Coba jalankan MySQL atau set USE_SQLITE=true di .env untuk menggunakan SQLite fallback.');
    }
    process.exit(1);
  }
};

module.exports = { sequelize, connect };
