"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEvidenceFile = exports.uploadEvidenceSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../utils/constants");
exports.uploadEvidenceSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid({ message: 'Dispute ID must be a valid UUID' }),
    }),
});
/** Validates that a file was actually attached (used post-multer in controller) */
const validateEvidenceFile = (file) => {
    if (!file)
        return 'No file was uploaded.';
    if (!constants_1.BACKEND_CONSTANTS.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return `Invalid file type. Allowed types: ${constants_1.BACKEND_CONSTANTS.ALLOWED_MIME_TYPES.join(', ')}`;
    }
    if (file.size > constants_1.BACKEND_CONSTANTS.MAX_FILE_SIZE_BYTES) {
        return `File too large. Maximum size is ${constants_1.BACKEND_CONSTANTS.MAX_FILE_SIZE_BYTES / 1024 / 1024}MB.`;
    }
    return null; // valid
};
exports.validateEvidenceFile = validateEvidenceFile;
