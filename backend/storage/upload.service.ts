import multer from 'multer';
import { AppError } from '../interfaces/error.interface';

// Use memory storage since we will upload to Cloudinary directly
const storage = multer.memoryStorage();

export const uploadService = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // allow images and pdfs
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new AppError('Invalid file type. Only images and PDFs are allowed.', 400, 'INVALID_FILE_TYPE'));
    }
  },
});
