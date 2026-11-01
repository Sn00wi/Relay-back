import { Pool } from 'pg';
import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['PG_USER', 'PG_PASSWORD', 'PG_DB'] as const;

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB,
  connectionTimeoutMillis: 5000,
  max: 10,
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle postgres client', err);
});

const adapter = new PrismaPg(pool)

export const prisma = new PrismaClient({adapter: adapter})

export async function checkDatabaseConnection(): Promise<void> {
  await prisma.$connect();
  await prisma.$queryRaw`SELECT 1`
}