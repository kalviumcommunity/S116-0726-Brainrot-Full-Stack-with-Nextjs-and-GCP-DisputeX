import prisma from '../utils/prisma';
import { AppDisputeStatus } from '../types/app.types';
import { activityService } from './activity.service';

export const disputeService = {
  async createDispute(data: { merchantId: string; amount: number; currency?: string; reason: string }) {
    const dispute = await prisma.dispute.create({
      data,
    });
    
    await activityService.createActivity(
      dispute.id,
      'CREATED',
      `Dispute created for amount ${dispute.currency || 'USD'} ${dispute.amount}. Reason: ${dispute.reason}`
    );
    
    return dispute;
  },

  async getDisputeById(id: string) {
    return prisma.dispute.findUnique({
      where: { id },
      include: { merchant: true },
    });
  },

  async getAllDisputes(filters?: { merchantId?: string; status?: AppDisputeStatus }) {
    const where: any = {};
    if (filters?.merchantId) where.merchantId = filters.merchantId;
    if (filters?.status) where.status = filters.status;

    return prisma.dispute.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { merchant: true },
    });
  },

  async updateDisputeStatus(id: string, status: AppDisputeStatus) {
    const updated = await prisma.dispute.update({
      where: { id },
      data: { status: status as any },
    });
    
    await activityService.createActivity(
      id,
      'STATUS_UPDATED',
      `Dispute status updated to ${status}`
    );
    
    return updated;
  },

  async updateDisputeEvidence(id: string, evidenceUrl: string) {
    const updated = await prisma.dispute.update({
      where: { id },
      data: { evidenceUrl },
    });
    
    await activityService.createActivity(
      id,
      'EVIDENCE_UPLOADED',
      `Evidence uploaded via GCP Storage`
    );
    
    return updated;
  }
};
