"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageService = void 0;
const cloudinary_1 = require("cloudinary");
// Configure Cloudinary with environment variables
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
exports.storageService = {
    /**
     * Uploads a file buffer directly to Cloudinary via a stream.
     * Returns the secure HTTPS URL of the uploaded asset.
     */
    async uploadFile(fileBuffer, fileName, mimeType) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                folder: 'disputex/evidence',
                public_id: fileName,
                resource_type: 'auto', // Automatically detect image vs pdf
            }, (error, result) => {
                if (error) {
                    console.error('Cloudinary Upload Error:', error);
                    return reject(error);
                }
                if (!result) {
                    return reject(new Error('Cloudinary failed to return a result.'));
                }
                resolve(result.secure_url);
            });
            // Write the buffer to the stream and end it
            uploadStream.end(fileBuffer);
        });
    }
};
