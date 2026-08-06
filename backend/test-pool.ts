import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;
const connectionString = "postgresql://neondb_owner:npg_oJ1UVqkmb6nu@ep-lively-bonus-ax0hei4s-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require";

const pool = new Pool({ connectionString });

pool.query('SELECT 1').then(res => {
  console.log('Success!', res.rows);
}).catch(err => {
  console.error('Error:', err);
});
