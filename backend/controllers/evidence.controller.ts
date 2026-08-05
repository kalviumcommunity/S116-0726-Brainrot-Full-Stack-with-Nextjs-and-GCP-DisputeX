import { Request, Response, NextFunction } from 'express';
import { evidenceService } from '../services/evidence.service';
import { sendSuccess } from '../utils/response';

export const evidenceController = {
  async uploadEvidence(req: Request, res: Response, next: NextFunction) {
    try {
      const disputeId = req.params['id'] as string;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ status: 'error', message: 'No file uploaded.' });
      }

      const url = await evidenceService.uploadEvidence(disputeId, file);

      return sendSuccess(res, 200, {
        message: 'Evidence uploaded successfully.',
        data: { evidenceUrl: url },
      });
    } catch (error) {
      return next(error);
    }
  },

  async getEvidence(req: Request, res: Response, next: NextFunction) {
    try {
      const disputeId = req.params['id'] as string;
      const url = await evidenceService.getEvidenceUrl(disputeId);

      return sendSuccess(res, 200, {
        data: { evidenceUrl: url, hasEvidence: !!url },
      });
    } catch (error) {
      return next(error);
    }
  },
};
