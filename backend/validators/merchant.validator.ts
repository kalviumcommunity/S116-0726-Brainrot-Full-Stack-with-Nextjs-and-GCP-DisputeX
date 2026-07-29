import { z } from 'zod';

export const createMerchantSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    businessId: z.string().min(2),
    contactEmail: z.string().email()
  })
});
