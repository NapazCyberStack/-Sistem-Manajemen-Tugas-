import ApiService from './api';

class TaskService extends ApiService {
  constructor() {
    super();
  }

  // GET /data with search and filters
  async getTasks(filters = {}) {
    try {
      const response = await this.get('/data', filters);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // GET /data/:id
  async getTaskById(id) {
    try {
      const response = await this.get(`/data/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // POST /data
  async createTask(taskData) {
    try {
      const response = await this.post('/data', taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // PUT /data/:id
  async updateTask(id, taskData) {
    try {
      const response = await this.put(`/data/${id}`, taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // DELETE /data/:id
  async deleteTask(id) {
    try {
      const response = await this.delete(`/data/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // GET /stats
  async getStats() {
    try {
      const response = await this.get('/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new TaskService();
