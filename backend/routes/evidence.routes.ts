import { Router } from 'express';
import { evidenceController } from '../controllers/evidence.controller';
import { uploadService } from '../storage/upload.service';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All evidence routes require authentication
router.use(authenticate);

// POST /api/evidence/:id/upload — upload evidence for a dispute
router.post('/:id/upload', uploadService.single('file'), evidenceController.uploadEvidence);

// GET /api/evidence/:id — get evidence URL for a dispute
router.get('/:id', evidenceController.getEvidence);

export default router;
