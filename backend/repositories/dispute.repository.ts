import prisma from '../utils/prisma';
import { AppDisputeStatus } from '../types/app.types';

export interface DisputeFilters {
  merchantId?: string;
  status?: AppDisputeStatus;
}

export interface PaginationOptions {
  skip?: number;
  take?: number;
}

export const disputeRepository = {
  async create(data: {
    merchantId: string;
    amount: number;
    currency: string;
    reason: string;
  }) {
    return prisma.dispute.create({ data });
  },

  async findById(id: string) {
    return prisma.dispute.findUnique({
      where: { id },
      include: { merchant: true, activities: { orderBy: { createdAt: 'desc' } } },
    });
  },

  async findMany(filters: DisputeFilters = {}, pagination: PaginationOptions = {}) {
    const where: any = {};
    if (filters.merchantId) where.merchantId = filters.merchantId;
    if (filters.status) where.status = filters.status;

    return prisma.dispute.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { merchant: true },
      skip: pagination.skip,
      take: pagination.take,
    });
  },

  async count(filters: DisputeFilters = {}) {
    const where: any = {};
    if (filters.merchantId) where.merchantId = filters.merchantId;
    if (filters.status) where.status = filters.status;
    return prisma.dispute.count({ where });
  },

  async updateStatus(id: string, status: AppDisputeStatus) {
    return prisma.dispute.update({ where: { id }, data: { status: status as any } });
  },

  async updateEvidenceUrl(id: string, evidenceUrl: string) {
    return prisma.dispute.update({ where: { id }, data: { evidenceUrl } });
  },

  async countByStatus() {
    return prisma.dispute.groupBy({
      by: ['status'],
      _count: { _all: true },
    });
  },
};
