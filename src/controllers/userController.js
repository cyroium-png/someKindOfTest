const asyncWrapper = require('../middleware/asyncWrapper');
const userService = require('../services/userService');
const logger = require('../utils/logger');

exports.getProfile = asyncWrapper(async (req, res) => {
  const user = await userService.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, email: user.email, role: user.role, createdAt: user.createdAt });
});

exports.adminOnly = asyncWrapper(async (req, res) => {
  logger.info('Admin action', { actor: req.user.email, path: req.originalUrl });
  res.json({ message: 'Admin access granted' });
});
