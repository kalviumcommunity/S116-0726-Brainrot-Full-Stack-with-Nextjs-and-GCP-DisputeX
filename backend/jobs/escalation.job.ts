import prisma from '../utils/prisma';
import { notificationService } from '../services/notification.service';
import { activityService } from '../services/activity.service';

// Escalate disputes that have been open for more than 7 days
export const escalationJob = async () => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const expiredDisputes = await prisma.dispute.findMany({
      where: {
        status: 'OPEN',
        createdAt: {
          lt: sevenDaysAgo,
        },
      },
    });

    for (const dispute of expiredDisputes) {
      // Update status to ESCALATED
      await prisma.dispute.update({
        where: { id: dispute.id },
        data: { status: 'ESCALATED' },
      });

      // Create activity
      await activityService.createActivity(
        dispute.id,
        'ESCALATED',
        'Dispute was escalated due to lack of response within 7 days.'
      );

      // Create notification
      await notificationService.createNotification(
        dispute.merchantId,
        'escalated',
        `Dispute ${dispute.id} escalated`,
        'This dispute was escalated because no evidence was submitted before the deadline.'
      );
      
      console.log(`[Job] Escalated dispute ${dispute.id}`);
    }
  } catch (error) {
    console.error('[Job] Error in escalationJob:', error);
  }
};
