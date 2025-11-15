import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend URL
});

// Interceptor to add the token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const register = (userData) => api.post('/auth/register', userData);
export const login = (userData) => api.post('/auth/login', userData);

// Sweets Endpoints
export const getSweets = () => api.get('/sweets');
export const searchSweets = (params) => {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value != null && value !== '')
  );
  return api.get('/sweets/search', { params: filteredParams });
};
export const createSweet = (sweetData) => api.post('/sweets', sweetData);
export const updateSweet = (id, sweetData) => api.put(`/sweets/${id}`, sweetData);
export const deleteSweet = (id) => api.delete(`/sweets/${id}`);

// Inventory Endpoints
export const purchaseSweet = (id) => api.post(`/sweets/${id}/purchase`);
export const restockSweet = (id, amount) => api.post(`/sweets/${id}/restock`, { amount });

export default api;