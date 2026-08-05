import prisma from '../utils/prisma';

export const notificationRepository = {
  async create(data: {
    merchantId: string;
    type: string;
    title: string;
    description: string;
  }) {
    return prisma.notification.create({ data });
  },

  async findByMerchant(merchantId: string, isRead?: boolean) {
    const where: any = { merchantId };
    if (isRead !== undefined) where.isRead = isRead;
    return prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  },

  async markAsRead(id: string) {
    return prisma.notification.update({ where: { id }, data: { isRead: true } });
  },

  async markAllAsRead(merchantId: string) {
    return prisma.notification.updateMany({
      where: { merchantId, isRead: false },
      data: { isRead: true },
    });
  },

  async countUnread(merchantId: string) {
    return prisma.notification.count({ where: { merchantId, isRead: false } });
  },
};
