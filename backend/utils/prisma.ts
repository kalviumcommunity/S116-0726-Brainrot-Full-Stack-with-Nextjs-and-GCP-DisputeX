import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = "postgresql://neondb_owner:npg_oJ1UVqkmb6nu@ep-lively-bonus-ax0hei4s-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require";

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });
export default prisma;
