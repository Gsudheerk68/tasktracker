import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Handle response errors
apiClient.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// TASK CRUD OPERATIONS

export const getTasks = async () => {
  return apiClient.get('/tasks');
};

export const getTaskById = async (taskId) => {
  return apiClient.get(`/tasks/${taskId}`);
};

export const createTask = async (taskData) => {
  return apiClient.post('/tasks', taskData);
};

export const updateTask = async (taskId, updates) => {
  return apiClient.put(`/tasks/${taskId}`, updates);
};

export const deleteTask = async (taskId) => {
  return apiClient.delete(`/tasks/${taskId}`);
};

export const getTaskStats = async () => {
  return apiClient.get('/tasks/stats');
};

// FILTER & SEARCH

export const searchTasks = async (query) => {
  return apiClient.get('/tasks/search', { params: { q: query } });
};

export const getTasksByStatus = async (status) => {
  return apiClient.get(`/tasks/status/${status}`);
};

export const getTasksByPriority = async (priority) => {
  return apiClient.get(`/tasks/priority/${priority}`);
};

export default apiClient;
