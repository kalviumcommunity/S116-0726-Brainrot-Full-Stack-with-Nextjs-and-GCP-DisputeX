import api from '../lib/api';

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data.data;
  },

  getAllMerchants: async (page = 1, limit = 10) => {
    const response = await api.get(`/admin/merchants?page=${page}&limit=${limit}`);
    return response.data;
  },

  getAllDisputes: async (page = 1, limit = 10, status?: string, merchantId?: string) => {
    let url = `/admin/disputes?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    if (merchantId) url += `&merchantId=${merchantId}`;
    
    const response = await api.get(url);
    return response.data;
  },

  getAuditLogs: async (page = 1, limit = 100) => {
    const response = await api.get(`/admin/activities?page=${page}&limit=${limit}`);
    return response.data;
  }
};
