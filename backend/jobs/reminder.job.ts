import prisma from '../utils/prisma';
import { notificationService } from '../services/notification.service';

// Send reminder for disputes open for 5 days
export const reminderJob = async () => {
  try {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    
    // To avoid spamming, we might want to check if a reminder was already sent.
    // For simplicity in this demo, we'll just check if it's exactly 5 days old (approx)
    // We can just find disputes created between 5 and 6 days ago
    const sixDaysAgo = new Date();
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);

    const disputesToRemind = await prisma.dispute.findMany({
      where: {
        status: 'OPEN',
        createdAt: {
          lt: fiveDaysAgo,
          gte: sixDaysAgo,
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
