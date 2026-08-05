import { Request, Response, NextFunction } from 'express';
import { notificationService } from '../services/notification.service';
import { notificationRepository } from '../repositories/notification.repository';
import { sendSuccess } from '../utils/response';
import { AppError } from '../interfaces/error.interface';

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const merchantId = Array.isArray(req.query.merchantId)
      ? req.query.merchantId[0] as string
      : req.query.merchantId as string | undefined;

    if (!merchantId) {
      throw new AppError('merchantId query parameter is required.', 400, 'MISSING_MERCHANT_ID');
    }

    const isReadParam = req.query.isRead;
    const isReadStr = Array.isArray(isReadParam) ? isReadParam[0] : isReadParam;
    const isReadBool =
      isReadStr === 'true' ? true : isReadStr === 'false' ? false : undefined;

    const notifications = await notificationRepository.findByMerchant(merchantId, isReadBool);
    const unreadCount = await notificationRepository.countUnread(merchantId);

    return sendSuccess(res, 200, {
      data: { notifications, unreadCount },
    });
  } catch (error) {
    return next(error);
  }
};

export const markNotificationAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notification = await notificationRepository.markAsRead(req.params['id'] as string);
    return sendSuccess(res, 200, {
      message: 'Notification marked as read.',
      data: { notification },
    });
  } catch (error) {
    return next(error);
  }
};

export const markAllNotificationsAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { merchantId } = req.body;
    if (!merchantId) {
      throw new AppError('merchantId is required.', 400, 'MISSING_MERCHANT_ID');
    }
    await notificationRepository.markAllAsRead(merchantId);
    return sendSuccess(res, 200, { message: 'All notifications marked as read.' });
  } catch (error) {
    return next(error);
  }
};
