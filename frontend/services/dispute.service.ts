import api from '../lib/api';

export interface Dispute {
  id: string;
  merchantId: string;
  amount: number;
  currency: string;
  reason: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'WON' | 'LOST' | 'ESCALATED';
  evidenceUrl: string | null;
  createdAt: string;
  updatedAt: string;
  merchant?: {
    id: string;
    name: string;
    businessId: string;
    contactEmail: string;
  };
}

export interface Activity {
  id: string;
  disputeId: string;
  action: string;
  description: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  merchantId: string;
  type: string;
  title: string;
  description: string;
  isRead: boolean;
  createdAt: string;
}

export const disputeService = {
  createDispute: async (data: { merchantId: string; amount: number; reason: string; currency?: string }) => {
    const response = await api.post('/disputes', data);
    return response.data;
  },

  getDisputes: async (filters?: { merchantId?: string; status?: string }) => {
    let url = '/disputes';
    if (filters) {
      const params = new URLSearchParams();
      if (filters.merchantId) params.append('merchantId', filters.merchantId);
      if (filters.status) params.append('status', filters.status);
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    const response = await api.get(url);
    return response.data;
  },

  getDisputeById: async (id: string) => {
    const response = await api.get(`/disputes/${id}`);
    return response.data;
  },

  updateDisputeStatus: async (id: string, status: string) => {
    const response = await api.patch(`/disputes/${id}/status`, { status });
    return response.data;
  },

  uploadEvidence: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/evidence/${id}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getEvidenceUrl: async (id: string) => {
    const response = await api.get(`/evidence/${id}`);
    return response.data;
  },

  getDisputeActivities: async (id: string) => {
    const response = await api.get(`/disputes/${id}/activities`);
    return response.data;
  },

  getNotifications: async (merchantId: string) => {
    const response = await api.get(`/notifications?merchantId=${merchantId}`);
    return response.data;
  },

  markNotificationAsRead: async (id: string) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllNotificationsAsRead: async (merchantId: string) => {
    const response = await api.patch(`/notifications/read-all`, { merchantId });
    return response.data;
  }
};
