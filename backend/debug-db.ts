import prisma from './utils/prisma';

async function checkDb() {
  const users = await prisma.user.findMany();
  console.log('USERS:', users.map(u => ({ id: u.id, email: u.email, role: u.role })));

  const merchants = await prisma.merchant.findMany();
  console.log('MERCHANTS:', merchants.map(m => ({ id: m.id, contactEmail: m.contactEmail })));

  const disputes = await prisma.dispute.findMany();
  console.log(`Total Disputes: ${disputes.length}`);
  
  const notifications = await prisma.notification.findMany();
  console.log(`Total Notifications: ${notifications.length}`);
}

checkDb().catch(console.error).finally(() => process.exit(0));
