const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

console.log('Environment variables:', {
  POSTGRES_URL: process.env.POSTGRES_URL ? 'Set' : 'Not Set',
});

const schema = require('./schema');

async function initializeDatabase() {
  try {
    await schema.createTables();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

initializeDatabase();
