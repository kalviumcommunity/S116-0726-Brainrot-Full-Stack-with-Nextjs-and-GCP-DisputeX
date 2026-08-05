import { z } from 'zod';
import { BACKEND_CONSTANTS } from '../utils/constants';

export const uploadEvidenceSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: 'Dispute ID must be a valid UUID' }),
  }),
});

type UploadedFile = {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
};

/** Validates that a file was actually attached (used post-multer in controller) */
export const validateEvidenceFile = (file: UploadedFile | undefined): string | null => {
  if (!file) return 'No file was uploaded.';
  if (!BACKEND_CONSTANTS.ALLOWED_MIME_TYPES.includes(file.mimetype as any)) {
    return `Invalid file type. Allowed types: ${BACKEND_CONSTANTS.ALLOWED_MIME_TYPES.join(', ')}`;
  }
  if (file.size > BACKEND_CONSTANTS.MAX_FILE_SIZE_BYTES) {
    return `File too large. Maximum size is ${BACKEND_CONSTANTS.MAX_FILE_SIZE_BYTES / 1024 / 1024}MB.`;
  }
  return null; // valid
};
