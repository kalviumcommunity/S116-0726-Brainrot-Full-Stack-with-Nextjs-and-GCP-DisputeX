"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../utils/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function main() {
    console.log('🌱 Starting database seeding with deterministic PRD scenarios...');
    // 1. Clear existing mock data (but keep Admin User)
    console.log('🧹 Clearing old activities, disputes, and merchants...');
    await prisma_1.default.activity.deleteMany({});
    await prisma_1.default.notification.deleteMany({});
    await prisma_1.default.dispute.deleteMany({});
    await prisma_1.default.merchant.deleteMany({});
    // 2. Ensure Admin User exists
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'AdminPassword123';
    const hashedPassword = await bcryptjs_1.default.hash(adminPassword, 10);
    let adminUser = await prisma_1.default.user.findUnique({ where: { email: adminEmail } });
    if (!adminUser) {
        adminUser = await prisma_1.default.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                role: 'ADMIN'
            }
        });
        console.log(`✅ Admin user created: ${adminEmail}`);
    }
    // 3. Find all Merchant Users and create scenarios for them!
    const merchantUsers = await prisma_1.default.user.findMany({ where: { role: 'MERCHANT' } });
    if (merchantUsers.length === 0) {
        const defaultMerchant = await prisma_1.default.user.create({
            data: { email: 'merchant@disputex.com', password: hashedPassword, role: 'MERCHANT' }
        });
        merchantUsers.push(defaultMerchant);
        console.log('✅ Created default Merchant user');
    }
    const now = new Date();
    const daysAgo = (days) => {
        const d = new Date();
        d.setDate(d.getDate() - days);
        return d;
    };
    const hoursAgo = (hours) => {
        const d = new Date();
        d.setHours(d.getHours() - hours);
        return d;
    };
    for (const user of merchantUsers) {
        // Ensure Merchant Profile exists
        let merchant = await prisma_1.default.merchant.findFirst({ where: { contactEmail: user.email } });
        if (!merchant) {
            merchant = await prisma_1.default.merchant.create({
                data: {
                    name: user.email.split('@')[0],
                    businessId: `MCH-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 100)}`,
                    contactEmail: user.email,
                }
            });
        }
        console.log(`📦 Creating specific PRD scenarios for merchant: ${user.email}...`);
        // Scenario 1: Fresh dispute created today (OPEN)
        await createDisputeScenario(merchant.id, {
            amount: 120.50,
            reason: 'Customer claims unauthorized transaction (Fresh)',
            status: 'OPEN',
            createdAt: hoursAgo(2),
            hasEvidence: false
        });
        // Scenario 2: Active dispute, 3 days old (OPEN)
        await createDisputeScenario(merchant.id, {
            amount: 450.00,
            reason: 'Item not received (Active)',
            status: 'OPEN',
            createdAt: daysAgo(3),
            hasEvidence: false
        });
        // Scenario 3: 24-Hour Warning Countdown, 6.5 days old (OPEN)
        const warningDisputeId = await createDisputeScenario(merchant.id, {
            amount: 99.99,
            reason: 'Defective product (24h Warning Countdown)',
            status: 'OPEN',
            createdAt: hoursAgo(7 * 24 - 12),
            hasEvidence: false
        });
        // Scenario 4: Expired dispute past 7 days (ESCALATED - Auto Escalation)
        const escalatedDisputeId = await createDisputeScenario(merchant.id, {
            amount: 1500.00,
            reason: 'Fraudulent charge (Auto-Escalated Demo)',
            status: 'ESCALATED',
            createdAt: daysAgo(8),
            hasEvidence: false,
            autoEscalated: true
        });
        // Scenario 5: Dispute with Evidence Submitted (UNDER_REVIEW)
        const reviewDisputeId = await createDisputeScenario(merchant.id, {
            amount: 75.00,
            reason: 'Subscription cancelled but billed (Evidence Uploaded)',
            status: 'UNDER_REVIEW',
            createdAt: daysAgo(4),
            hasEvidence: true
        });
        // Create a few mock notifications for the dashboard
        await prisma_1.default.notification.createMany({
            data: [
                {
                    merchantId: merchant.id,
                    type: 'reminder',
                    title: 'Daily Reminder: Evidence Required',
                    description: `You have 3 days left to submit evidence for dispute ${warningDisputeId.slice(0, 8)}.`,
                    isRead: false,
                    createdAt: hoursAgo(1),
                },
                {
                    merchantId: merchant.id,
                    type: 'escalated',
                    title: 'Dispute Escalated',
                    description: `Dispute ${escalatedDisputeId.slice(0, 8)} has been escalated due to missed deadline.`,
                    isRead: false,
                    createdAt: daysAgo(1),
                },
                {
                    merchantId: merchant.id,
                    type: 'status_update',
                    title: 'Evidence Accepted',
                    description: `Dispute ${reviewDisputeId.slice(0, 8)} is now under review.`,
                    isRead: true,
                    createdAt: daysAgo(2),
                }
            ]
        });
    }
    console.log('✅ Seeding finished successfully.');
}
async function createDisputeScenario(merchantId, options) {
    const dispute = await prisma_1.default.dispute.create({
        data: {
            merchantId,
            amount: options.amount,
            currency: 'USD',
            reason: options.reason,
            status: options.status,
            createdAt: options.createdAt,
            updatedAt: options.createdAt,
            evidenceUrl: options.hasEvidence ? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' : null
        }
    });
    const activities = [
        {
            disputeId: dispute.id,
            action: 'DISPUTE_OPENED',
            description: `Dispute opened for reason: ${dispute.reason}`,
            createdAt: options.createdAt
        }
    ];
    if (options.hasEvidence) {
        const evidenceTime = new Date(options.createdAt);
        evidenceTime.setHours(evidenceTime.getHours() + 24); // Uploaded 1 day later
        activities.push({
            disputeId: dispute.id,
            action: 'EVIDENCE_UPLOADED',
            description: 'Evidence file uploaded successfully.',
            createdAt: evidenceTime
        });
    }
    if (options.autoEscalated) {
        const escalationTime = new Date(options.createdAt);
        escalationTime.setDate(escalationTime.getDate() + 7); // Escalated on day 7
        activities.push({
            disputeId: dispute.id,
            action: 'ESCALATED',
            description: 'Dispute was escalated due to lack of response within 7 days.',
            createdAt: escalationTime
        });
    }
    await prisma_1.default.activity.createMany({ data: activities });
    return dispute.id;
}
main()
    .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
});
