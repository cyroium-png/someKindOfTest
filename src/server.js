require('dotenv').config();
const http = require('http');
const app = require('./app');
const logger = require('./utils/logger');
const { PrismaClient } = require('@prisma/client');
const { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL, PORT } = require('./config');

const prisma = new PrismaClient();
const { ENABLE_CRON } = require('./config');
const { startCronJobs } = require('./utils/cron');
const validateEnv = require('./utils/validateEnv');

// Validate required environment variables and fail fast if missing
validateEnv();

const server = http.createServer(app);

const port = parseInt(PORT, 10) || 4000;

server.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
  if (ENABLE_CRON === 'true' || ENABLE_CRON === true) startCronJobs();
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection', { reason });
  // Optionally exit depending on severity
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', { err });
  process.exit(1);
});

const graceful = async () => {
  logger.info('Shutting down gracefully');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on('SIGINT', graceful);
process.on('SIGTERM', graceful);
