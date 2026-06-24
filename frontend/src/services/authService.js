import ApiService from './api';

class AuthService extends ApiService {
  constructor() {
    super(); // Initialize parent ApiService class
  }

  // POST /register
  async register(username, email, password, role = 'User') {
    try {
      const response = await this.post('/register', { username, email, password, role });
      const { token, ...user } = response.data;
      
      // Store in localStorage
      localStorage.setItem('task_manager_token', token);
      localStorage.setItem('task_manager_user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  // POST /login
  async login(email, password) {
    try {
      const response = await this.post('/login', { email, password });
      const { token, ...user } = response.data;
      
      // Store in localStorage
      localStorage.setItem('task_manager_token', token);
      localStorage.setItem('task_manager_user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Client-side logout
  logout() {
    localStorage.removeItem('task_manager_token');
    localStorage.removeItem('task_manager_user');
    return true;
  }

  // Retrieve current active user from storage
  getCurrentUser() {
    const userJson = localStorage.getItem('task_manager_user');
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch (err) {
      this.logout();
      return null;
    }
  }

  // Check if user is logged in
  isAuthenticated() {
    return !!localStorage.getItem('task_manager_token');
  }
}

// Export a singleton instance
export default new AuthService();
