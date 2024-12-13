import dotenv from 'dotenv';
import { createTables } from './schema';

dotenv.config({ path: '.env.local' });

console.log('Environment variables:', {
  POSTGRES_URL: process.env.POSTGRES_URL ? 'Set' : 'Not Set',
});

async function initializeDatabase() {
  try {
    await createTables();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

initializeDatabase();
