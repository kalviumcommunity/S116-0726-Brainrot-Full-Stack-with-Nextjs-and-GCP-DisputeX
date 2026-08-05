import { z } from 'zod';

export const createDisputeSchema = z.object({
  body: z.object({
    merchantId: z.string().uuid({ message: 'merchantId must be a valid UUID' }),
    amount: z
      .number({ message: 'amount must be a positive number' })
      .positive({ message: 'amount must be greater than 0' }),
    currency: z
      .string()
      .length(3, { message: 'currency must be a 3-letter ISO code (e.g. USD)' })
      .toUpperCase()
      .optional()
      .default('USD'),
    reason: z
      .string()
      .min(10, { message: 'reason must be at least 10 characters' })
      .max(1000, { message: 'reason must be at most 1000 characters' }),
  }),
});

export const updateDisputeStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: 'Dispute ID must be a valid UUID' }),
  }),
  body: z.object({
    status: z.enum(['OPEN', 'UNDER_REVIEW', 'WON', 'LOST', 'ESCALATED'] as const, {
      message: 'status must be one of: OPEN, UNDER_REVIEW, WON, LOST, ESCALATED',
    }),
  }),
});

export const getDisputeByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: 'Dispute ID must be a valid UUID' }),
  }),
});

export const listDisputesSchema = z.object({
  query: z.object({
    merchantId: z.string().uuid().optional(),
    status: z
      .enum(['OPEN', 'UNDER_REVIEW', 'WON', 'LOST', 'ESCALATED'] as const)
      .optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});
