import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { sendSuccess } from '../utils/response';
import { AppError } from '../interfaces/error.interface';
import { parsePagination } from '../interfaces/request.interface';

export const createMerchant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, businessId, contactEmail } = req.body;

    const existing = await prisma.merchant.findUnique({ where: { businessId } });
    if (existing) {
      throw new AppError('A merchant with this Business ID already exists.', 409, 'MERCHANT_EXISTS');
    }

    const merchant = await prisma.merchant.create({ data: { name, businessId, contactEmail } });
    return sendSuccess(res, 201, { message: 'Merchant created successfully.', data: { merchant } });
  } catch (error) {
    return next(error);
  }
};

export const getMerchants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);

    const [merchants, total] = await Promise.all([
      prisma.merchant.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
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

export const getMerchantById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const merchant = await prisma.merchant.findUnique({
      where: { id: req.params.id as string },
      include: {
        disputes: { orderBy: { createdAt: 'desc' }, take: 10 },
        _count: { select: { disputes: true, notifications: true } },
      },
    });

    if (!merchant) throw new AppError('Merchant not found.', 404, 'MERCHANT_NOT_FOUND');

    return sendSuccess(res, 200, { data: { merchant } });
  } catch (error) {
    return next(error);
  }
};
