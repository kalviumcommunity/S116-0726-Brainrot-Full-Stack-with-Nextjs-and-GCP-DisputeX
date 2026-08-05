import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

// In Prisma v7, PrismaClient accepts a datasources config object
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export default prisma;
