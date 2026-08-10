"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mimeTypeLabel = void 0;
/** Returns a display-friendly label for a MIME type */
const mimeTypeLabel = (mimeType) => {
    if (mimeType.startsWith('image/'))
        return 'Image';
    if (mimeType === 'application/pdf')
        return 'PDF Document';
    return 'File';
};
exports.mimeTypeLabel = mimeTypeLabel;
