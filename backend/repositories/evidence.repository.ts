import prisma from '../utils/prisma';

export const evidenceRepository = {
  /**
   * Evidence is stored as a single URL on the Dispute model (current schema).
   * This repository abstracts that access so it can be migrated to a
   * separate Evidence model later without touching service/controller code.
   */
  async getEvidenceUrl(disputeId: string): Promise<string | null> {
    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
      select: { evidenceUrl: true },
    });
    return dispute?.evidenceUrl ?? null;
  },

  async setEvidenceUrl(disputeId: string, url: string): Promise<string> {
    const updated = await prisma.dispute.update({
      where: { id: disputeId },
      data: { evidenceUrl: url },
      select: { evidenceUrl: true },
    });
    return updated.evidenceUrl!;
  },

  async hasEvidence(disputeId: string): Promise<boolean> {
    const url = await this.getEvidenceUrl(disputeId);
    return !!url;
  },
};
