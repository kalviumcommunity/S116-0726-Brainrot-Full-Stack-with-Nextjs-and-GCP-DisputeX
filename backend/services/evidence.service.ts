import { evidenceRepository } from '../repositories/evidence.repository';
import { disputeRepository } from '../repositories/dispute.repository';
import { activityService } from './activity.service';
import { storageService } from '../storage/storage.service';
import { validateEvidenceFile } from '../validators/evidence.validator';
import { AppError } from '../interfaces/error.interface';

type UploadedFile = {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
};

export const evidenceService = {
  /**
   * Uploads a file to GCP Storage and stores the URL on the Dispute record.
   * Returns the updated evidence URL.
   */
  async uploadEvidence(disputeId: string, file: UploadedFile): Promise<string> {
    // 1. Validate file (MIME type + size)
    const fileError = validateEvidenceFile(file);
    if (fileError) {
      throw new AppError(fileError, 400, 'INVALID_FILE');
    }

    // 2. Verify dispute exists and check for existing evidence
    const dispute = await disputeRepository.findById(disputeId);
    if (!dispute) {
      throw new AppError('Dispute not found.', 404, 'DISPUTE_NOT_FOUND');
    }
    if (dispute.evidenceUrl) {
      throw new AppError('Evidence has already been uploaded for this dispute and cannot be altered.', 403, 'EVIDENCE_ALREADY_EXISTS');
    }

    // 3. Build a deterministic file path
    const safeFileName = file.originalname.replace(/\s+/g, '_');
    const filePath = `disputes/${disputeId}/evidence_${Date.now()}_${safeFileName}`;

    // 4. Upload to GCP (or mock if unconfigured)
    const url = await storageService.uploadFile(file.buffer, filePath, file.mimetype);

    // 5. Persist the URL on the dispute and update status to UNDER_REVIEW
    await require('../utils/prisma').default.dispute.update({
      where: { id: disputeId },
      data: { evidenceUrl: url, status: 'UNDER_REVIEW' }
    });

    // 6. Log the activity
    await activityService.createActivity(
      disputeId,
      'EVIDENCE_UPLOADED',
      `Evidence file "${file.originalname}" uploaded successfully.`
    );

    return url;
  },

  /** Returns the current evidence URL for a dispute, or null */
  async getEvidenceUrl(disputeId: string): Promise<string | null> {
    return evidenceRepository.getEvidenceUrl(disputeId);
  },

  /** Returns true if evidence has been submitted for a dispute */
  async hasEvidence(disputeId: string): Promise<boolean> {
    return evidenceRepository.hasEvidence(disputeId);
  },
};
