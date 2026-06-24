import ApiService from './api';

const BASE = '/api/tasks';

class TaskService extends ApiService {
  constructor() {
    super();
  }

  // GET /data — ambil semua tugas dengan filter
  async getTasks(filters = {}) {
    const response = await this.get(`${BASE}/data`, filters);
    return response.data;
  }

  // GET /data/:id — detail tugas
  async getTaskById(id) {
    const response = await this.get(`${BASE}/data/${id}`);
    return response.data;
  }

  // POST /data — buat tugas baru
  async createTask(taskData) {
    const response = await this.post(`${BASE}/data`, taskData);
    return response.data;
  }

  // PUT /data/:id — update tugas
  async updateTask(id, taskData) {
    const response = await this.put(`${BASE}/data/${id}`, taskData);
    return response.data;
  }

  // DELETE /data/:id — hapus tugas
  async deleteTask(id) {
    const response = await this.delete(`${BASE}/data/${id}`);
    return response.data;
  }

  // GET /stats — statistik dashboard
  async getStats() {
    const response = await this.get(`${BASE}/stats`);
    return response.data;
  }
}

export default new TaskService();
