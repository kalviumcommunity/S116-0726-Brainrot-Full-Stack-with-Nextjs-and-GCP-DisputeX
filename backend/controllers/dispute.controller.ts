import { Request, Response } from 'express';
import { disputeService } from '../services/dispute.service';
import { storageService } from '../storage/storage.service';
import { DisputeStatus } from '@prisma/client';
import { activityService } from '../services/activity.service';

export const disputeController = {
  async createDispute(req: Request, res: Response) {
    try {
      const { merchantId, amount, currency, reason } = req.body;
      if (!merchantId || !amount || !reason) {
        return res.status(400).json({ error: 'merchantId, amount, and reason are required' });
      }

      const dispute = await disputeService.createDispute({
        merchantId,
        amount: parseFloat(amount),
        currency: currency || 'USD',
        reason
      });

      res.status(201).json({ message: 'Dispute created successfully', dispute });
    } catch (error: any) {
      console.error('Error creating dispute:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getDisputes(req: Request, res: Response) {
    try {
      const { merchantId, status } = req.query;
      const filters: any = {};
      
      if (merchantId) filters.merchantId = merchantId as string;
      if (status) filters.status = status as DisputeStatus;

      const disputes = await disputeService.getAllDisputes(filters);
      res.json({ disputes });
    } catch (error: any) {
      console.error('Error fetching disputes:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getDisputeById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const dispute = await disputeService.getDisputeById(id);

      if (!dispute) {
        return res.status(404).json({ error: 'Dispute not found' });
      }

      res.json({ dispute });
    } catch (error: any) {
      console.error('Error fetching dispute:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async updateDisputeStatus(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { status } = req.body;

      if (!Object.values(DisputeStatus).includes(status as DisputeStatus)) {
         return res.status(400).json({ error: 'Invalid status value' });
      }

      const dispute = await disputeService.updateDisputeStatus(id, status as DisputeStatus);
      res.json({ message: 'Dispute status updated', dispute });
    } catch (error: any) {
      console.error('Error updating dispute status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async uploadEvidence(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'Evidence file is required' });
      }

      const dispute = await disputeService.getDisputeById(id);
      if (!dispute) {
        return res.status(404).json({ error: 'Dispute not found' });
      }

      const fileName = `disputes/${id}/evidence_${Date.now()}_${file.originalname.replace(/\\s+/g, '_')}`;
      
      const evidenceUrl = await storageService.uploadFile(file.buffer, fileName, file.mimetype);

      const updatedDispute = await disputeService.updateDisputeEvidence(id, evidenceUrl);

      res.json({ message: 'Evidence uploaded successfully', dispute: updatedDispute });
    } catch (error: any) {
      console.error('Error uploading evidence:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getDisputeActivities(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const activities = await activityService.getActivitiesByDispute(id);
      res.json({ activities });
    } catch (error: any) {
      console.error('Error fetching activities:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
