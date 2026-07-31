import { Router } from 'express';
import { disputeController } from '../controllers/dispute.controller';
import { uploadService } from '../storage/upload.service';

const router = Router();

router.post('/', disputeController.createDispute);
router.get('/', disputeController.getDisputes);
router.get('/:id', disputeController.getDisputeById);
router.patch('/:id/status', disputeController.updateDisputeStatus);
router.get('/:id/activities', disputeController.getDisputeActivities);

// Evidence upload route
router.post(
  '/:id/evidence',
  uploadService.single('file'),
  disputeController.uploadEvidence
);

export default router;
