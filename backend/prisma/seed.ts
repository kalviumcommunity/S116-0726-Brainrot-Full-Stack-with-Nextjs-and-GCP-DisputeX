import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
dotenv.config();

neonConfig.webSocketConstructor = ws;

async function main() {
  console.log('🌱 Starting database seeding...');
  
  const pool = new Pool({ connectionString: 'postgresql://neondb_owner:npg_oJ1UVqkmb6nu@ep-lively-bonus-ax0hei4s-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require' });

  // 1. Create an Admin User
  const adminEmail = 'admin@disputex.com';
  const adminPassword = 'AdminPassword123!';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  try {
    const { rows } = await pool.query('SELECT email FROM "User" WHERE email = $1', [adminEmail]);
    
    if (rows.length === 0) {
      await pool.query(
        'INSERT INTO "User" (id, email, password, role, "updatedAt") VALUES ($1, $2, $3, $4, NOW())',
        [uuidv4(), adminEmail, hashedPassword, 'ADMIN']
      );
      console.log(`✅ Admin user created: ${adminEmail}`);
    } else {
      console.log(`ℹ️ Admin user already exists: ${adminEmail}`);
    }

    // 2. Create Dummy Merchant
    const merchantBusinessId = 'MCH-99901';
    const { rows: merchantRows } = await pool.query('SELECT id FROM "Merchant" WHERE "businessId" = $1', [merchantBusinessId]);
    
    if (merchantRows.length === 0) {
      const merchantId = uuidv4();
      await pool.query(
        'INSERT INTO "Merchant" (id, name, "businessId", "contactEmail", "updatedAt") VALUES ($1, $2, $3, $4, NOW())',
        [merchantId, 'Acme Corp', merchantBusinessId, 'acme@example.com']
      );
      console.log(`✅ Dummy Merchant created: Acme Corp`);
      
      await pool.query(
        'INSERT INTO "Dispute" (id, "merchantId", amount, currency, reason, status, "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, NOW())',
        [uuidv4(), merchantId, 450.00, 'USD', 'Customer claims item not received', 'OPEN']
      );
      console.log(`✅ Dummy Dispute created for Acme Corp`);
    } else {
      console.log(`ℹ️ Dummy Merchant already exists.`);
    }

    console.log('✅ Seeding finished.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);
