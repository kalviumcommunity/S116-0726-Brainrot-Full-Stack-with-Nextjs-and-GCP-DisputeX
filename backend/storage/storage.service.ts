import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const storageService = {
  /**
   * Uploads a file buffer directly to Cloudinary via a stream.
   * Returns the secure HTTPS URL of the uploaded asset.
   */
  async uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'disputex/evidence',
          public_id: fileName,
          resource_type: mimeType === 'application/pdf' ? 'raw' : 'auto',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary Upload Error:', error);
            return reject(error);
          }
          if (!result) {
            return reject(new Error('Cloudinary failed to return a result.'));
          }
          resolve(result.secure_url);
        }
      );
      
      // Write the buffer to the stream and end it
      uploadStream.end(fileBuffer);
    });
  },

  /**
   * Generates a secure signed delivery URL for PDFs to bypass restrictive access policies.
   */
  getSignedDeliveryUrl(url: string): string {
    if (!url || !url.includes('cloudinary.com') || !url.endsWith('.pdf')) {
      return url;
    }
    
    // Extract public_id from Cloudinary URL
    const urlParts = url.split('/upload/');
    if (urlParts.length === 2) {
      const pathAfterUpload = urlParts[1];
      const publicId = pathAfterUpload.replace(/^v\d+\//, '');
      
      return cloudinary.utils.private_download_url(publicId, 'pdf', {
        resource_type: 'raw',
        type: 'upload',
        expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hour
      });
    }
    return url;
  }
};
