import { z } from 'zod';
import { validateEmailDomain, checkEmailTypo } from '../utils/email.utils';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email().superRefine(async (val, ctx) => {
      const typo = checkEmailTypo(val);
      if (typo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Please check your email domain. Did you mean ${typo}?`,
        });
        return z.NEVER;
      }

      const isValidDNS = await validateEmailDomain(val, false);
      if (!isValidDNS) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter an email address with a valid domain.",
        });
      }
    }),
    password: z.string().min(6),
    role: z.enum(['ADMIN', 'MERCHANT']).optional()
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6)
  })
});
