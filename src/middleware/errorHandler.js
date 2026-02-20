const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message || 'Server error', { stack: err.stack, path: req.originalUrl });
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
};

module.exports = { errorHandler };
