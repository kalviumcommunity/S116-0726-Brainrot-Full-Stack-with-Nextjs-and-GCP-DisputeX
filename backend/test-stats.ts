import prisma from './utils/prisma';
async function test() {
  try {
    await prisma.dispute.count({ where: { status: 'ESCALATED' } });
    console.log('count ESCALATED ok');
  } catch(e) {
    console.error('Error count:', e);
  }
  try {
    await prisma.activity.findMany({ take: 10, include: { dispute: { select: { id: true, reason: true, merchant: { select: { name: true } } } } } });
    console.log('activity findMany ok');
  } catch(e) {
    console.error('Error activity:', e);
  }
}
test();
