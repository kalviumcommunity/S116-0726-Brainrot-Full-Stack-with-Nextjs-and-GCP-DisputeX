import api from '../lib/api';

export const authService = {
  login: async (email: string, password: string, role?: string) => {
    const payload = role ? { email, password, role } : { email, password };
    const response = await api.post('/auth/login', payload);
    return response.data;
  },

  register: async (email: string, password: string, role: string) => {
    const response = await api.post('/auth/register', { email, password, role });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  isAuthenticated: () => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  },

  getUser: () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }
};
