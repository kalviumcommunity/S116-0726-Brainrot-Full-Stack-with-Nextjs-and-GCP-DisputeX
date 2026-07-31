import prisma from '../utils/prisma';

export const notificationService = {
  createNotification: async (merchantId: string, type: string, title: string, description: string) => {
    return await prisma.notification.create({
      data: {
        merchantId,
        type,
        title,
        description,
      },
    });
  },

  getNotifications: async (merchantId: string) => {
    return await prisma.notification.findMany({
      where: {
        merchantId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  markAsRead: async (id: string) => {
    return await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  },
};
