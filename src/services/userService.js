const prisma = require('../config/prisma');

const findByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
};

const createUser = async ({ email, password, role = 'USER' }) => {
  return prisma.user.create({ data: { email, password, role } });
};

const findById = async (id) => {
  return prisma.user.findUnique({ where: { id } });
};

module.exports = { findByEmail, createUser, findById };
