import prisma from '../utils/prisma';

export const activityService = {
  createActivity: async (disputeId: string, action: string, description: string) => {
    return await prisma.activity.create({
      data: {
        disputeId,
        action,
        description,
      },
    });
  },

  getActivitiesByDispute: async (disputeId: string) => {
    return await prisma.activity.findMany({
      where: {
        disputeId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },
};
