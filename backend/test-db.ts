import prisma from './utils/prisma';

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log("Success! Users:", users.length);
  } catch (e) {
    console.error("Prisma error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
