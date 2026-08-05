import { Router } from 'express';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  getNotificationsSchema,
  markNotificationReadSchema,
  markAllNotificationsReadSchema,
} from '../validators/notification.validator';

const router = Router();

// All notification routes require authentication
router.use(authenticate);

router.get('/', validate(getNotificationsSchema), getNotifications);
router.patch('/:id/read', validate(markNotificationReadSchema), markNotificationAsRead);
router.patch('/read-all', validate(markAllNotificationsReadSchema), markAllNotificationsAsRead);

export default router;
