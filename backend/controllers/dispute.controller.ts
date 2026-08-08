import { Request, Response, NextFunction } from 'express';
import { disputeService } from '../services/dispute.service';
import { activityService } from '../services/activity.service';
import { evidenceService } from '../services/evidence.service';
import { disputeRepository } from '../repositories/dispute.repository';
import { pdfService } from '../services/pdf.service';
import { AppDisputeStatus } from '../types/app.types';
import { sendSuccess, sendPaginated } from '../utils/response';
import { parsePagination } from '../interfaces/request.interface';
import { AppError } from '../interfaces/error.interface';

const VALID_STATUSES: AppDisputeStatus[] = ['OPEN', 'UNDER_REVIEW', 'WON', 'LOST', 'ESCALATED'];

export const disputeController = {
  async createDispute(req: Request, res: Response, next: NextFunction) {
    try {
      const { merchantId, amount, currency, reason } = req.body;
      const dispute = await disputeService.createDispute({
        merchantId,
        amount: parseFloat(amount),
        currency: currency || 'USD',
        reason,
      });
      return sendSuccess(res, 201, { message: 'Dispute created successfully.', data: { dispute } });
    } catch (error) {
      return next(error);
    }
  },

  async getDisputes(req: Request, res: Response, next: NextFunction) {
    try {
      const merchantId = Array.isArray(req.query.merchantId) ? req.query.merchantId[0] : req.query.merchantId;
      const status = Array.isArray(req.query.status) ? req.query.status[0] : req.query.status;
      const { page, limit, skip } = parsePagination(req.query);

      const filters: any = {};
      if (merchantId) filters.merchantId = merchantId as string;
      if (status && VALID_STATUSES.includes(status as AppDisputeStatus)) {
        filters.status = status as AppDisputeStatus;
      }

      const [disputes, total] = await Promise.all([
        disputeRepository.findMany(filters, { skip, take: limit }),
        disputeRepository.count(filters),
      ]);

      return sendPaginated(res, disputes, page, limit, total);
    } catch (error) {
      return next(error);
    }
  },

  async getDisputeById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const dispute = await disputeRepository.findById(id);
      if (!dispute) throw new AppError('Dispute not found.', 404, 'DISPUTE_NOT_FOUND');
      return sendSuccess(res, 200, { data: { dispute } });
    } catch (error) {
      return next(error);
    }
  },

  async updateDisputeStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      if (!VALID_STATUSES.includes(status as AppDisputeStatus)) {
        throw new AppError('Invalid status value.', 400, 'INVALID_STATUS');
      }
      const dispute = await disputeService.updateDisputeStatus(req.params['id'] as string, status as AppDisputeStatus);
      return sendSuccess(res, 200, { message: 'Dispute status updated.', data: { dispute } });
    } catch (error) {
      return next(error);
    }
  },

  async uploadEvidence(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new AppError('No file uploaded.', 400, 'NO_FILE');
      }
      const url = await evidenceService.uploadEvidence(req.params['id'] as string, req.file);
      return sendSuccess(res, 200, { message: 'Evidence uploaded successfully.', data: { evidenceUrl: url } });
    } catch (error) {
      return next(error);
    }
  },

  async getDisputeActivities(req: Request, res: Response, next: NextFunction) {
    try {
      const activities = await activityService.getActivitiesByDispute(req.params['id'] as string);
      return sendSuccess(res, 200, { data: { activities } });
    } catch (error) {
      return next(error);
    }
  },

  async downloadDisputePdf(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const dispute = await disputeRepository.findById(id);
      if (!dispute) throw new AppError('Dispute not found.', 404, 'DISPUTE_NOT_FOUND');

      const pdfBuffer = await pdfService.generateDisputePackage(dispute as any);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="dispute-evidence-${id}.pdf"`);
      return res.send(pdfBuffer);
    } catch (error) {
      return next(error);
    }
  },
};
