import prisma from '../utils/prisma';

export const userRepository = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true, createdAt: true, updatedAt: true },
    });
  },

  async create(data: { email: string; password: string; role?: 'ADMIN' | 'MERCHANT' }) {
    return prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        role: data.role ?? 'ADMIN',
      },
    });
  },

  async count() {
    return prisma.user.count();
  },
};
