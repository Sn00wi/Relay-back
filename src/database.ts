import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB,
})


export async function checkDatabaseConnection(): Promise<void> {
    const response = await pool.query('SELECT 1');
    console.log('Connection success', response.rows[0]);
}