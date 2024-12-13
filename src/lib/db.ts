import { sql, createPool } from '@vercel/postgres';

if (!process.env.POSTGRES_URL) {
  console.error('POSTGRES_URL environment variable is not set');
  process.exit(1);
}

const pool = createPool({
  connectionString: process.env.POSTGRES_URL,
});

export { sql, pool };
