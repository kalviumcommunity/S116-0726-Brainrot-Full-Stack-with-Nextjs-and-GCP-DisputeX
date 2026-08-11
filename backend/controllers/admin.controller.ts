import { Request, Response, NextFunction } from 'express';
import { DisputeStatus } from '@prisma/client';
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

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const recentDisputesForChart = await prisma.dispute.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true }
    });

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const casesByDay: { name: string; cases: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      casesByDay.push({
        name: days[d.getDay()],
        cases: 0
      });
    }

    recentDisputesForChart.forEach((d: { createdAt: Date }) => {
      const dayName = days[d.createdAt.getDay()];
      const entry = casesByDay.find(c => c.name === dayName);
      if (entry) entry.cases++;
    });

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
        casesByDay,
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

export const getAuditLogsAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);

    const [logs, total] = await Promise.all([
      prisma.activity.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.activity.count(),
    ]);

    const formattedLogs = logs.map((log: any) => ({
      id: log.id,
      action: log.action,
      entityType: 'Dispute',
      entityId: log.disputeId,
      details: { description: log.description },
      createdAt: log.createdAt,
    }));

    return res.status(200).json({
      status: 'success',
      data: formattedLogs,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return next(error);
  }
};

export const globalSearchAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = (req.query.q as string || '').trim();
    if (!q) {
      return res.status(200).json({
        status: 'success',
        data: { disputes: [], merchants: [], activities: [], notifications: [] }
      });
    }

    const ALL_STATUSES: DisputeStatus[] = ['OPEN', 'UNDER_REVIEW', 'WON', 'LOST', 'ESCALATED'];
    const statusMatches = ALL_STATUSES.filter(s =>
      s.toLowerCase().includes(q.toLowerCase())
    );

    const [disputes, merchants, activities, notifications] = await Promise.all([
      prisma.dispute.findMany({
        where: {
          OR: [
            { id: { contains: q, mode: 'insensitive' } },
            { reason: { contains: q, mode: 'insensitive' } },
            { merchant: { name: { contains: q, mode: 'insensitive' } } },
            { merchant: { contactEmail: { contains: q, mode: 'insensitive' } } },
            ...(statusMatches.length > 0 ? [{ status: { in: statusMatches } }] : [])
          ]
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          merchant: { select: { id: true, name: true, contactEmail: true } }
        }
      }),
      prisma.merchant.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { contactEmail: { contains: q, mode: 'insensitive' } },
            { businessId: { contains: q, mode: 'insensitive' } }
          ]
        },
        take: 5,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.activity.findMany({
        where: {
          OR: [
            { action: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } }
          ]
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          dispute: { select: { id: true, reason: true } }
        }
      }),
      prisma.notification.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { type: { contains: q, mode: 'insensitive' } }
          ]
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          merchant: { select: { name: true } }
        }
      })
    ]);

    return res.status(200).json({
      status: 'success',
      data: {
        disputes,
        merchants,
        activities,
        notifications
      }
    });
  } catch (error) {
    return next(error);
  }
};

