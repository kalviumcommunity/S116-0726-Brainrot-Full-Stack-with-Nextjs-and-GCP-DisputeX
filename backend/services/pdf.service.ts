import PDFDocument from 'pdfkit';

interface Dispute {
  id: string;
  merchantId: string;
  amount: number;
  currency: string;
  reason: string;
  status: string;
  evidenceUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Merchant {
  id: string;
  name: string;
  businessId: string;
  contactEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Activity {
  id: string;
  disputeId: string;
  action: string;
  description: string;
  createdAt: Date;
}

interface DisputeWithDetails extends Dispute {
  merchant: Merchant;
  activities: Activity[];
}

export const pdfService = {
  generateDisputePackage(dispute: DisputeWithDetails): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      // Header Branding
      doc
        .rect(0, 0, 595.28, 80)
        .fill('#0B1021');

      doc
        .fillColor('#FFFFFF')
        .font('Helvetica-Bold')
        .fontSize(22)
        .text('DISPUTE-X', 50, 28);

      doc
        .fillColor('#9b87f5')
        .font('Helvetica')
        .fontSize(10)
        .text('DISPUTE EVIDENCE COMPILATION PACKAGE', 190, 36);

      // Section: Title and Metadata
      doc.y = 110;
      doc
        .fillColor('#1E293B')
        .font('Helvetica-Bold')
        .fontSize(18)
        .text('Official Evidence Summary File', 50, doc.y);

      doc
        .fillColor('#64748B')
        .font('Helvetica')
        .fontSize(10)
        .text(`Generated on: ${new Date().toLocaleString()}`, 50, doc.y + 6)
        .text(`Package Ref: DX-${dispute.id.slice(0, 8).toUpperCase()}`, 50, doc.y + 18);

      // Horizontal Divider
      doc
        .moveTo(50, doc.y + 35)
        .lineTo(545, doc.y + 35)
        .strokeColor('#CBD5E1')
        .stroke();

      // Section: Side-by-Side Details (Dispute & Merchant)
      const topY = doc.y + 50;

      // Left Column: Dispute Info
      doc
        .fillColor('#1E293B')
        .font('Helvetica-Bold')
        .fontSize(13)
        .text('Dispute Information', 50, topY);

      doc
        .fillColor('#334155')
        .font('Helvetica-Bold')
        .fontSize(10)
        .text('Dispute ID: ', 50, topY + 22)
        .font('Helvetica')
        .text(dispute.id, 120, topY + 22)
        .font('Helvetica-Bold')
        .text('Amount: ', 50, topY + 36)
        .font('Helvetica')
        .text(`${dispute.currency} ${dispute.amount.toFixed(2)}`, 120, topY + 36)
        .font('Helvetica-Bold')
        .text('Reason: ', 50, topY + 50)
        .font('Helvetica')
        .text(dispute.reason, 120, topY + 50)
        .font('Helvetica-Bold')
        .text('Status: ', 50, topY + 64)
        .font('Helvetica-Bold')
        .fillColor(dispute.status === 'WON' ? '#10B981' : dispute.status === 'LOST' ? '#EF4444' : '#F59E0B')
        .text(dispute.status, 120, topY + 64);

      // Right Column: Merchant Info
      doc
        .fillColor('#1E293B')
        .font('Helvetica-Bold')
        .fontSize(13)
        .text('Merchant Information', 320, topY);

      doc
        .fillColor('#334155')
        .font('Helvetica-Bold')
        .fontSize(10)
        .text('Name: ', 320, topY + 22)
        .font('Helvetica')
        .text(dispute.merchant.name, 390, topY + 22)
        .font('Helvetica-Bold')
        .text('Business ID: ', 320, topY + 36)
        .font('Helvetica')
        .text(dispute.merchant.businessId, 390, topY + 36)
        .font('Helvetica-Bold')
        .text('Contact Email: ', 320, topY + 50)
        .font('Helvetica')
        .text(dispute.merchant.contactEmail, 390, topY + 50);

      // Section: Evidence Files
      const evidenceY = topY + 100;
      doc
        .moveTo(50, evidenceY)
        .lineTo(545, evidenceY)
        .strokeColor('#E2E8F0')
        .stroke();

      doc
        .fillColor('#1E293B')
        .font('Helvetica-Bold')
        .fontSize(13)
        .text('Evidence & Submissions', 50, evidenceY + 15);

      if (dispute.evidenceUrl) {
        doc
          .fillColor('#334155')
          .font('Helvetica-Bold')
          .fontSize(10)
          .text('Primary Evidence Link:', 50, evidenceY + 37)
          .font('Helvetica')
          .fillColor('#2563EB')
          .text(dispute.evidenceUrl, 160, evidenceY + 37, { underline: true })
          .fillColor('#334155')
          .font('Helvetica')
          .text('This document has been uploaded to secure GCP Storage and verified as complete evidence for the dispute response.', 50, evidenceY + 52, { width: 495 });
      } else {
        doc
          .fillColor('#64748B')
          .font('Helvetica-Oblique')
          .fontSize(10)
          .text('No evidence files have been submitted for this dispute yet.', 50, evidenceY + 37);
      }

      // Section: Timeline & Activity Audit Trail
      const timelineY = evidenceY + 95;
      doc
        .moveTo(50, timelineY)
        .lineTo(545, timelineY)
        .strokeColor('#E2E8F0')
        .stroke();

      doc
        .fillColor('#1E293B')
        .font('Helvetica-Bold')
        .fontSize(13)
        .text('Activity Audit Timeline', 50, timelineY + 15);

      let currentActivityY = timelineY + 40;
      const sortedActivities = [...dispute.activities].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      if (sortedActivities.length > 0) {
        sortedActivities.forEach((activity, index) => {
          if (currentActivityY > 700) {
            doc.addPage();
            currentActivityY = 50;
          }

          // Bullet dot
          doc
            .circle(55, currentActivityY + 5, 3)
            .fill('#9b87f5');

          // Date
          doc
            .fillColor('#64748B')
            .font('Helvetica')
            .fontSize(8)
            .text(new Date(activity.createdAt).toLocaleString(), 70, currentActivityY + 1);

          // Action
          doc
            .fillColor('#0F172A')
            .font('Helvetica-Bold')
            .fontSize(9.5)
            .text(activity.action, 170, currentActivityY);

          // Description
          doc
            .fillColor('#475569')
            .font('Helvetica')
            .fontSize(9)
            .text(activity.description, 280, currentActivityY, { width: 265 });

          // Row separator line
          doc
            .moveTo(50, currentActivityY + 22)
            .lineTo(545, currentActivityY + 22)
            .strokeColor('#F1F5F9')
            .lineWidth(0.5)
            .stroke();

          currentActivityY += 27;
        });
      } else {
        doc
          .fillColor('#64748B')
          .font('Helvetica-Oblique')
          .fontSize(10)
          .text('No activities recorded on this dispute.', 50, timelineY + 37);
      }

      // Footnote
      if (currentActivityY > 730) {
        doc.addPage();
        currentActivityY = 50;
      }
      
      doc
        .moveTo(50, 750)
        .lineTo(545, 750)
        .strokeColor('#CBD5E1')
        .lineWidth(0.5)
        .stroke();

      doc
        .fillColor('#94A3B8')
        .font('Helvetica')
        .fontSize(8)
        .text('CONFIDENTIALITY NOTICE: This document contains proprietary financial information and merchant records.', 50, 760, { align: 'center' })
        .text('Generated automatically by Dispute-X Platform (powered by Next.js & Google Cloud Platform).', 50, 770, { align: 'center' });

      doc.end();
    });
  },
};
