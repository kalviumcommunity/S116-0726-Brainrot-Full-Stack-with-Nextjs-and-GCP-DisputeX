export interface EvidenceModel {
  /** URL of the uploaded file in GCP Storage */
  url: string;
  /** Original filename */
  filename: string;
  /** MIME type of the uploaded file */
  mimeType: string;
  /** File size in bytes */
  size: number;
  /** ID of the dispute this evidence belongs to */
  disputeId: string;
  /** When the evidence was uploaded */
  uploadedAt: Date;
}

/** Returns a display-friendly label for a MIME type */
export const mimeTypeLabel = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return 'Image';
  if (mimeType === 'application/pdf') return 'PDF Document';
  return 'File';
};
