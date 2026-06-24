import axios from 'axios';

class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:5000';
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this._initializeRequestInterceptors();
    this._initializeResponseInterceptors();
  }

  _initializeRequestInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('task_manager_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  _initializeResponseInterceptors() {
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Uniform error response extraction
        let errorMessage = 'Terjadi kesalahan sistem';
        let validationErrors = null;

        if (error.response) {
          const data = error.response.data;
          
          // Handle validation errors from express-validator
          if (data.errors && Array.isArray(data.errors)) {
            validationErrors = data.errors;
            errorMessage = data.errors.map(err => err.msg).join(', ');
          } else {
            errorMessage = data.message || errorMessage;
          }

          // If token expired/invalid, clean storage
          if (error.response.status === 401 && !window.location.pathname.includes('/login')) {
            localStorage.removeItem('task_manager_token');
            localStorage.removeItem('task_manager_user');
            // We can dispatch a custom event or let the hook handle it
            window.dispatchEvent(new Event('auth_session_expired'));
          }
        } else if (error.request) {
          errorMessage = 'Tidak dapat menghubungi server backend. Pastikan backend server menyala.';
        } else {
          errorMessage = error.message;
        }

        const customError = new Error(errorMessage);
        customError.status = error.response ? error.response.status : 500;
        customError.validationErrors = validationErrors;
        
        return Promise.reject(customError);
      }
    );
  }

  // Wrapper for HTTP GET
  async get(url, params = {}) {
    return this.client.get(url, { params });
  }

  // Wrapper for HTTP POST
  async post(url, data = {}) {
    return this.client.post(url, data);
  }

  // Wrapper for HTTP PUT
  async put(url, data = {}) {
    return this.client.put(url, data);
  }

  // Wrapper for HTTP DELETE
  async delete(url) {
    return this.client.delete(url);
  }
}

export default ApiService;
export { axios };
