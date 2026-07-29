import { Router } from 'express';
import { createMerchant, getMerchants, getMerchantById } from '../controllers/merchant.controller';
import { validate } from '../middleware/validation.middleware';
import { createMerchantSchema } from '../validators/merchant.validator';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, requireRole(['ADMIN']), validate(createMerchantSchema), createMerchant);
router.get('/', authenticate, getMerchants);
router.get('/:id', authenticate, getMerchantById);

export default router;
