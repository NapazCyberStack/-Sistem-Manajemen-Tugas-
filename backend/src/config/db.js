const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'task_manager_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3307,
    dialect: 'mysql',
    logging: false, // Set to console.log to see SQL queries
  }
);

const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Terhubung ke MySQL menggunakan Sequelize.');
    // Sync models to database
    await sequelize.sync({ alter: true }); // Creates tables if they don't exist, updates if changed
    console.log('✅ Semua model telah sinkron dengan database.');
  } catch (error) {
    console.error('❌ Gagal terhubung ke MySQL:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connect };
