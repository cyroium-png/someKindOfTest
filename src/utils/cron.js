const cron = require('node-cron');
const logger = require('./logger');

// Example cron job: hourly heartbeat log. Enable via ENABLE_CRON=true in env.
const startCronJobs = () => {
  logger.info('Starting cron jobs');
  // runs every hour at minute 0
  cron.schedule('0 * * * *', () => {
    logger.info('Heartbeat cron job executed');
  });
};

module.exports = { startCronJobs };
