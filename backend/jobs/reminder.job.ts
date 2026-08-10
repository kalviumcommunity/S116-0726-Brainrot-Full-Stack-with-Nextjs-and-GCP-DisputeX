import prisma from '../utils/prisma';
import { notificationService } from '../services/notification.service';

// Send reminder for all OPEN disputes
export const reminderJob = async () => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Find disputes that are OPEN and less than 7 days old (7+ days are handled by escalationJob)
    const disputesToRemind = await prisma.dispute.findMany({
      where: {
        status: 'OPEN',
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    for (const dispute of disputesToRemind) {
      await notificationService.createNotification(
        dispute.merchantId,
        'reminder',
        `Reminder: ${dispute.id}`,
        'Upload supporting evidence before the 7-day deadline expires.'
      );
      console.log(`[Job] Sent reminder for dispute ${dispute.id}`);
    }
  } catch (error) {
    console.error('[Job] Error in reminderJob:', error);
  }
};
