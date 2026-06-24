const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Judul tugas wajib diisi'
      },
      len: {
        args: [1, 100],
        msg: 'Judul maksimal 100 karakter'
      }
    }
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      len: {
        args: [0, 500],
        msg: 'Deskripsi maksimal 500 karakter'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('Pending', 'In Progress', 'Completed'),
    defaultValue: 'Pending'
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High'),
    defaultValue: 'Medium'
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Tenggat waktu wajib diisi'
      }
    }
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['userId', 'status'] },
    { fields: ['userId', 'priority'] }
  ]
});

// Relasi
User.hasMany(Task, { foreignKey: 'userId', as: 'tasks' });
Task.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Task;
