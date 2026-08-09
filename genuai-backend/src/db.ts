import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.connect(async (err, client, release) => {
  if (err) {
    console.error('[DB] Database connection error:', err.message);
  } else {
    console.log('[DB] Connected to Supabase PostgreSQL successfully!');
    try {
      // Ensure the users table exists
      await client?.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role VARCHAR(50) DEFAULT 'candidate',
          phone VARCHAR(50),
          college VARCHAR(255),
          github VARCHAR(255),
          linkedin VARCHAR(255),
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);
      console.log('[DB] Verified users table structure in Supabase PostgreSQL.');
    } catch (tableErr: any) {
      console.error('[DB] Error verifying users table:', tableErr.message);
    } finally {
      release?.();
    }
  }
});

export default pool;
