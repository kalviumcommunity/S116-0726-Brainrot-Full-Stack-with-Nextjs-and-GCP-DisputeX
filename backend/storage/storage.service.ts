import { Storage } from '@google-cloud/storage';

const projectId = process.env.GCP_PROJECT_ID;
const keyFilename = process.env.GCP_KEY_FILENAME; // if using local key file
const credentials = process.env.GCP_CLIENT_EMAIL && process.env.GCP_PRIVATE_KEY ? {
  client_email: process.env.GCP_CLIENT_EMAIL,
  private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, '\n'),
} : undefined;

let storage: Storage | null = null;

try {
  if (projectId) {
    storage = new Storage({ projectId, credentials, keyFilename });
    console.log('GCP Storage initialized.');
  } else {
    console.warn('GCP_PROJECT_ID not set, GCP Storage is mocked.');
  }
} catch (error) {
  console.error('Error initializing GCP Storage:', error);
}

const bucketName = process.env.GCP_BUCKET_NAME || 'disputex-evidence-bucket';

export const storageService = {
  async uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
    if (!storage) {
      console.warn('Mock upload for file:', fileName);
      return `https://mock-storage.com/${bucketName}/${fileName}`;
    }

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);
    
    await file.save(fileBuffer, {
      contentType: mimeType,
      resumable: false,
    });

    return `https://storage.googleapis.com/${bucketName}/${fileName}`;
  }
};
