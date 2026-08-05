import { z } from 'zod';

export const getNotificationsSchema = z.object({
  query: z.object({
    merchantId: z.string().uuid({ message: 'merchantId must be a valid UUID' }),
    isRead: z
      .enum(['true', 'false'])
      .transform((v) => v === 'true')
      .optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});

export const markNotificationReadSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: 'Notification ID must be a valid UUID' }),
  }),
});

export const markAllNotificationsReadSchema = z.object({
  body: z.object({
    merchantId: z.string().uuid({ message: 'merchantId must be a valid UUID' }),
  }),
});
