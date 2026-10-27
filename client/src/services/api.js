import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor for consistent error extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An unexpected error occurred. Please try again.';
    if (error.response && error.response.data) {
      if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
        errorMessage = error.response.data.errors.join(', ');
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    return Promise.reject(new Error(errorMessage));
  }
);

export const spendSphereApi = {
  // Health
  getHealth: () => api.get('/health'),

  // Dashboard Aggregates
  getSummary: (period = 'this_month', startDate = null, endDate = null) => {
    const params = { period };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return api.get('/dashboard/summary', { params });
  },

  getCashflow: (period = 'this_month', startDate = null, endDate = null) => {
    const params = { period };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return api.get('/dashboard/cashflow', { params });
  },

  getCategories: (period = 'this_month', startDate = null, endDate = null) => {
    const params = { period };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return api.get('/dashboard/categories', { params });
  },

  // Transactions CRUD
  getTransactions: (params = {}) => api.get('/transactions', { params }),
  getTransaction: (id) => api.get(`/transactions/${id}`),
  createTransaction: (data) => api.post('/transactions', data),
  updateTransaction: (id, data) => api.put(`/transactions/${id}`, data),
  deleteTransaction: (id) => api.delete(`/transactions/${id}`),

  // Budgets
  getBudget: (month = null, year = null) => {
    const params = {};
    if (month) params.month = month;
    if (year) params.year = year;
    return api.get('/budgets', { params });
  },
  updateBudget: (data) => api.put('/budgets', data)
};

export default spendSphereApi;
