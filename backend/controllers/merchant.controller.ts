import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const createMerchant = async (req: Request, res: Response) => {
  try {
    const { name, businessId, contactEmail } = req.body;

    const existingMerchant = await prisma.merchant.findUnique({ where: { businessId } });
    if (existingMerchant) {
      return res.status(400).json({ status: 'error', message: 'Merchant with this Business ID already exists' });
    }

    const merchant = await prisma.merchant.create({
      data: { name, businessId, contactEmail }
    });

    return res.status(201).json({ status: 'success', data: { merchant } });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getMerchants = async (req: Request, res: Response) => {
  try {
    const merchants = await prisma.merchant.findMany();
    return res.status(200).json({ status: 'success', data: { merchants } });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getMerchantById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const merchant = await prisma.merchant.findUnique({
      where: { id },
      include: { disputes: true }
    });
    
    if (!merchant) return res.status(404).json({ status: 'error', message: 'Merchant not found' });
    
    return res.status(200).json({ status: 'success', data: { merchant } });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};
