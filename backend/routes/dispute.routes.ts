import { Router } from 'express';
import { disputeController } from '../controllers/dispute.controller';
import { uploadService } from '../storage/upload.service';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  createDisputeSchema,
  updateDisputeStatusSchema,
  getDisputeByIdSchema,
  listDisputesSchema,
} from '../validators/dispute.validator';

const router = Router();

// All dispute routes require authentication
router.use(authenticate);

router.post(
  '/',
  validate(createDisputeSchema),
  disputeController.createDispute
);

router.get(
  '/',
  validate(listDisputesSchema),
  disputeController.getDisputes
);

router.get(
  '/:id',
  validate(getDisputeByIdSchema),
  disputeController.getDisputeById
);

router.patch(
  '/:id/status',
  validate(updateDisputeStatusSchema),
  disputeController.updateDisputeStatus
);

router.get(
  '/:id/activities',
  validate(getDisputeByIdSchema),
  disputeController.getDisputeActivities
);

// Evidence upload (uses multer middleware)
router.post(
  '/:id/evidence',
  uploadService.single('file'),
  disputeController.uploadEvidence
);

export default router;
