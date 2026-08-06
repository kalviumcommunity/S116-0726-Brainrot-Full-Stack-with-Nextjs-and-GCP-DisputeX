import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import { PrismaClient } from '@prisma/client';

neonConfig.webSocketConstructor = ws;
const connectionString = "postgresql://neondb_owner:npg_oJ1UVqkmb6nu@ep-lively-bonus-ax0hei4s-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require";

const pool = new Pool({ connectionString });

// @ts-ignore
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const res = await prisma.$queryRaw`SELECT 1`;
    console.log('Success!', res);
  } catch(e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
