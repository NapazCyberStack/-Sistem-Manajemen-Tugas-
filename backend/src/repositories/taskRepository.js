const Task = require('../models/Task');
const db = require('../config/db');

class TaskRepository {
  constructor() {
    this.collectionName = 'tasks';
  }

  async create(taskData) {
    if (!db.isFallback) {
      const task = new Task(taskData);
      return await task.save();
    } else {
      const tasks = db.readData(this.collectionName);
      const mockId = Math.random().toString(16).substring(2, 14) + Math.random().toString(16).substring(2, 14);
      const newTask = {
        _id: mockId,
        ...taskData,
        createdAt: new Date().toISOString()
      };
      tasks.push(newTask);
      db.writeData(this.collectionName, tasks);
      return newTask;
    }
  }

  async searchTasks(userId, keyword, status, priority) {
    const query = { userId };
    if (keyword) query.title = { $regex: keyword, $options: 'i' };
    if (status) query.status = status;
    if (priority) query.priority = priority;
    return await Task.find(query).sort({ createdAt: -1 });
  }


  async findAll(filter = {}) {
    const { userId, search, priority, status } = filter;

    if (!db.isFallback) {
      const query = {};
      if (userId) {
        query.userId = userId;
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      if (priority) {
        query.priority = priority;
      }
      if (status) {
        query.status = status;
      }
      return await Task.find(query).populate('userId', 'username email role').sort({ createdAt: -1 });
    } else {
      let tasks = db.readData(this.collectionName);
      const users = db.readData('users');

      // Filter by User ID if provided
      if (userId) {
        tasks = tasks.filter(t => t.userId.toString() === userId.toString());
      }

      // Filter by Search Query
      if (search) {
        const searchLower = search.toLowerCase();
        tasks = tasks.filter(t =>
          (t.title && t.title.toLowerCase().includes(searchLower)) ||
          (t.description && t.description.toLowerCase().includes(searchLower))
        );
      }

      // Filter by priority
      if (priority) {
        tasks = tasks.filter(t => t.priority === priority);
      }

      // Filter by status
      if (status) {
        tasks = tasks.filter(t => t.status === status);
      }

      // Populate User details (simulating mongoose populate)
      const populatedTasks = tasks.map(task => {
        const user = users.find(u => u._id.toString() === task.userId.toString());
        return {
          ...task,
          userId: user ? { _id: user._id, username: user.username, email: user.email, role: user.role } : task.userId
        };
      });

      // Sort by createdAt descending
      return populatedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }

  async findById(id) {
    if (!db.isFallback) {
      return await Task.findById(id).populate('userId', 'username email role');
    } else {
      const tasks = db.readData(this.collectionName);
      const task = tasks.find(t => t._id.toString() === id.toString());
      if (!task) return null;

      const users = db.readData('users');
      const user = users.find(u => u._id.toString() === task.userId.toString());
      return {
        ...task,
        userId: user ? { _id: user._id, username: user.username, email: user.email, role: user.role } : task.userId
      };
    }
  }

  async update(id, updateData) {
    if (!db.isFallback) {
      return await Task.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate('userId', 'username email role');
    } else {
      const tasks = db.readData(this.collectionName);
      const index = tasks.findIndex(t => t._id.toString() === id.toString());
      if (index === -1) return null;

      tasks[index] = {
        ...tasks[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      db.writeData(this.collectionName, tasks);
      return this.findById(id); // Return populated task
    }
  }

  async delete(id) {
    if (!db.isFallback) {
      return await Task.findByIdAndDelete(id);
    } else {
      const tasks = db.readData(this.collectionName);
      const taskIndex = tasks.findIndex(t => t._id.toString() === id.toString());
      if (taskIndex === -1) return null;

      const deletedTask = tasks.splice(taskIndex, 1)[0];
      db.writeData(this.collectionName, tasks);
      return deletedTask;
    }
  }

  async getStats(userId = null) {
    // If we have a userId, we fetch stats only for that user. Otherwise, we fetch stats for everyone (Admin).
    const filter = userId ? { userId } : {};
    const tasks = await this.findAll(filter);

    const stats = {
      total: tasks.length,
      status: {
        pending: 0,
        inProgress: 0,
        completed: 0
      },
      priority: {
        low: 0,
        medium: 0,
        high: 0
      }
    };

    tasks.forEach(task => {
      // Status mapping
      const status = (task.status || '').toLowerCase();
      if (status === 'pending') stats.status.pending++;
      else if (status === 'in progress' || status === 'inprogress') stats.status.inProgress++;
      else if (status === 'completed') stats.status.completed++;

      // Priority mapping
      const priority = (task.priority || '').toLowerCase();
      if (priority === 'low') stats.priority.low++;
      else if (priority === 'medium') stats.priority.medium++;
      else if (priority === 'high') stats.priority.high++;
    });

    return stats;
  }
}

module.exports = new TaskRepository();
