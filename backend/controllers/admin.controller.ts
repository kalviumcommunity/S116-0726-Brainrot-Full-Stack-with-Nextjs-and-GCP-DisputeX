import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { sendSuccess } from '../utils/response';
import { parsePagination } from '../interfaces/request.interface';

export const getAdminStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [
      totalDisputes,
      openDisputes,
      underReviewDisputes,
      escalatedDisputes,
      wonDisputes,
      lostDisputes,
      totalMerchants,
      recentDisputes,
      recentActivities,
    ] = await Promise.all([
      prisma.dispute.count(),
      prisma.dispute.count({ where: { status: 'OPEN' } }),
      prisma.dispute.count({ where: { status: 'UNDER_REVIEW' } }),
      prisma.dispute.count({ where: { status: 'ESCALATED' } }),
      prisma.dispute.count({ where: { status: 'WON' } }),
      prisma.dispute.count({ where: { status: 'LOST' } }),
      prisma.merchant.count(),
      prisma.dispute.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { merchant: true },
      }),
      prisma.activity.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { dispute: { select: { id: true, reason: true, merchant: { select: { name: true } } } } },
      }),
    ]);

    return sendSuccess(res, 200, {
      data: {
        stats: {
          disputes: {
            total: totalDisputes,
            open: openDisputes,
            underReview: underReviewDisputes,
            escalated: escalatedDisputes,
            won: wonDisputes,
            lost: lostDisputes,
          },
          merchants: {
            total: totalMerchants,
          },
        },
        recentDisputes,
        recentActivities,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getAllMerchantsAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);

    const [merchants, total] = await Promise.all([
      prisma.merchant.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { disputes: true } } },
      }),
      prisma.merchant.count(),
    ]);

    return res.status(200).json({
      status: 'success',
      data: merchants,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return next(error);
  }
};

export const getAllDisputesAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, merchantId } = req.query;
    const { page, limit, skip } = parsePagination(req.query);

    const where: any = {};
    if (status) where.status = status;
    if (merchantId) where.merchantId = merchantId;

    const [disputes, total] = await Promise.all([
      prisma.dispute.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { merchant: true },
      }),
      prisma.dispute.count({ where }),
    ]);

    return res.status(200).json({
      status: 'success',
      data: disputes,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return next(error);
  }
};
