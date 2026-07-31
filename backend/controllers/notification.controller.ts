import { Request, Response } from 'express';
import { notificationService } from '../services/notification.service';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { merchantId } = req.query;
    
    if (!merchantId || typeof merchantId !== 'string') {
      return res.status(400).json({ status: 'error', message: 'merchantId is required' });
    }

    const notifications = await notificationService.getNotifications(merchantId as string);
    return res.status(200).json({ status: 'success', notifications });
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const notification = await notificationService.markAsRead(id);
    return res.status(200).json({ status: 'success', notification });
  } catch (error: any) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};
