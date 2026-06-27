const taskRepository = require('../repositories/taskRepository');

class TaskController {
  // Get all tasks with optional search and filters
  // GET /data
  getAllTasks = async (req, res, next) => {
    try {
      const { search, priority, status } = req.query;
      
      const filter = {};
      
      // If NOT Admin, restrict to user's own tasks
      if (req.user.role !== 'Admin') {
        filter.userId = req.user.id;
      }

      // Add query parameters if present
      if (search) filter.search = search;
      if (priority) filter.priority = priority;
      if (status) filter.status = status;

      const tasks = await taskRepository.findAll(filter);
      return res.json(tasks);
    } catch (error) {
      next(error);
    }
  };

  // Get task by ID
  // GET /data/:id
  getTaskById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const task = await taskRepository.findById(id);

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      // Authorization check: User must own the task, or be an Admin
      const taskOwnerId = task.userId._id ? task.userId._id.toString() : task.userId.toString();
      if (req.user.role !== 'Admin' && taskOwnerId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden: You do not have permission to access this task' });
      }

      return res.json(task);
    } catch (error) {
      next(error);
    }
  };

  // Create a new task
  // POST /data
  createTask = async (req, res, next) => {
    try {
      const { title, description, status, priority, dueDate } = req.body;
      const proofImage = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : undefined;

      const taskData = {
        title,
        description,
        status: status || 'Pending',
        priority: priority || 'Medium',
        dueDate,
        userId: req.user.id, // Tasks are owned by the creator
        proofImage
      };

      const task = await taskRepository.create(taskData);
      return res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  };

  // Update a task
  // PUT /data/:id
  updateTask = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, description, status, priority, dueDate } = req.body;

      const task = await taskRepository.findById(id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      // Authorization check: User must own the task, or be an Admin
      const taskOwnerId = task.userId._id ? task.userId._id.toString() : task.userId.toString();
      if (req.user.role !== 'Admin' && taskOwnerId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden: You do not have permission to edit this task' });
      }

      const proofImage = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : undefined;
      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (status !== undefined) updateData.status = status;
      if (priority !== undefined) updateData.priority = priority;
      if (dueDate !== undefined) updateData.dueDate = dueDate;
      if (proofImage) updateData.proofImage = proofImage;

      const updatedTask = await taskRepository.update(id, updateData);
      return res.json(updatedTask);
    } catch (error) {
      next(error);
    }
  };

  // Delete a task
  // DELETE /data/:id
  deleteTask = async (req, res, next) => {
    try {
      const { id } = req.params;

      const task = await taskRepository.findById(id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      // Authorization check: User must own the task, or be an Admin
      const taskOwnerId = task.userId._id ? task.userId._id.toString() : task.userId.toString();
      if (req.user.role !== 'Admin' && taskOwnerId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden: You do not have permission to delete this task' });
      }

      await taskRepository.delete(id);
      return res.json({ message: 'Task deleted successfully', id });
    } catch (error) {
      next(error);
    }
  };

  // Get statistics for the dashboard
  // GET /stats
  getStats = async (req, res, next) => {
    try {
      // If NOT Admin, calculate stats only for the user's tasks
      const userId = req.user.role === 'Admin' ? null : req.user.id;
      const stats = await taskRepository.getStats(userId);
      return res.json(stats);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new TaskController();
