const Task = require('../models/Task');
const User = require('../models/User');
const { Op } = require('sequelize');

class TaskRepository {
  // Helper to map Sequelize output to Mongoose format
  _mapTask(task) {
    if (!task) return null;
    const taskData = task.toJSON();
    taskData._id = taskData.id;
    
    if (taskData.user) {
      taskData.userId = {
        _id: taskData.user.id,
        username: taskData.user.username,
        email: taskData.user.email,
        role: taskData.user.role
      };
      delete taskData.user;
    } else {
      // Just map userId to itself if no populated user
      if (taskData.userId && typeof taskData.userId === 'string') {
        const uid = taskData.userId;
        taskData.userId = uid;
      }
    }
    return taskData;
  }

  async create(taskData) {
    const task = await Task.create(taskData);
    return this._mapTask(task);
  }

  async findAll(filter = {}) {
    const { userId, search, priority, status } = filter;
    
    const whereClause = {};
    if (userId) whereClause.userId = userId;
    if (priority) whereClause.priority = priority;
    if (status) whereClause.status = status;
    
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const tasks = await Task.findAll({
      where: whereClause,
      include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email', 'role'] }],
      order: [['createdAt', 'DESC']]
    });

    return tasks.map(t => this._mapTask(t));
  }

  async findById(id) {
    const task = await Task.findByPk(id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email', 'role'] }]
    });
    return this._mapTask(task);
  }

  async update(id, updateData) {
    const task = await Task.findByPk(id);
    if (!task) return null;
    
    await task.update(updateData);
    return this.findById(id); // Refetch to get populated user
  }

  async delete(id) {
    const task = await Task.findByPk(id);
    if (!task) return null;
    
    const mapped = this._mapTask(task);
    await task.destroy();
    return mapped;
  }

  async getStats(userId = null) {
    const whereClause = userId ? { userId } : {};
    const tasks = await Task.findAll({ where: whereClause });

    const stats = {
      total: tasks.length,
      status: { pending: 0, inProgress: 0, completed: 0 },
      priority: { low: 0, medium: 0, high: 0 }
    };

    tasks.forEach(task => {
      const status = (task.status || '').toLowerCase();
      if (status === 'pending') stats.status.pending++;
      else if (status === 'in progress' || status === 'inprogress') stats.status.inProgress++;
      else if (status === 'completed') stats.status.completed++;

      const priority = (task.priority || '').toLowerCase();
      if (priority === 'low') stats.priority.low++;
      else if (priority === 'medium') stats.priority.medium++;
      else if (priority === 'high') stats.priority.high++;
    });

    return stats;
  }
}

module.exports = new TaskRepository();
