const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Username sudah digunakan'
    },
    validate: {
      len: {
        args: [3, 30],
        msg: 'Username harus antara 3 dan 30 karakter'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Email sudah terdaftar'
    },
    validate: {
      isEmail: {
        msg: 'Format email tidak valid'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6, 100],
        msg: 'Password minimal 6 karakter'
      }
    }
  },
  role: {
    type: DataTypes.ENUM('Admin', 'User'),
    defaultValue: 'User'
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['email'] },
    { fields: ['username'] }
  ]
});

module.exports = User;
