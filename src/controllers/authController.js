const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncWrapper = require('../middleware/asyncWrapper');
const userService = require('../services/userService');
const logger = require('../utils/logger');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config');

exports.register = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const existing = await userService.findByEmail(email);
  if (existing) return res.status(409).json({ error: 'Email already in use' });
  const hashed = await bcrypt.hash(password, 12);
  const user = await userService.createUser({ email, password: hashed });
  res.status(201).json({ id: user.id, email: user.email });
});

exports.login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await userService.findByEmail(email);
  if (!user) {
    logger.warn('Failed login attempt', { email });
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    logger.warn('Failed login attempt', { email });
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  res.json({ token });
});
