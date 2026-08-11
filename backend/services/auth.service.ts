import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository';
import { AppError } from '../interfaces/error.interface';
import prisma from '../utils/prisma';
import { envConfig } from '../config/env.config';
import { BACKEND_CONSTANTS } from '../utils/constants';
import { toPublicUser } from '../models/user.model';
import { JwtPayload } from '../types/app.types';

const generateToken = (userId: string, role: string): string => {
  return jwt.sign(
    { userId, role } as JwtPayload,
    envConfig.jwtSecret,
    { expiresIn: BACKEND_CONSTANTS.JWT_EXPIRES_IN }
  );
};

export const authService = {
  async register(email: string, password: string, role?: 'ADMIN' | 'MERCHANT') {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AppError('A user with this email already exists.', 409, 'USER_EXISTS');
    }

    const hashed = await bcrypt.hash(password, BACKEND_CONSTANTS.BCRYPT_SALT_ROUNDS);
    const user = await userRepository.create({ email, password: hashed, role });

    if (role === 'MERCHANT') {
      const merchant = await prisma.merchant.create({
        data: {
          name: email.split('@')[0],
          businessId: `MCH-${Date.now().toString().slice(-6)}`,
          contactEmail: email,
        }
      });
      
      const dispute = await prisma.dispute.create({
        data: {
          merchantId: merchant.id,
          amount: 50.00,
          currency: 'USD',
          reason: 'Welcome to DisputeX! Please upload your first dummy evidence.',
          status: 'OPEN',
        }
      });
      
      await prisma.activity.create({
        data: {
          disputeId: dispute.id,
          action: 'MERCHANT_REGISTERED',
          description: 'Merchant registered successfully and default dispute initialized.'
        }
      });
    }

    const token = generateToken(user.id, user.role);
    return { token, user: toPublicUser(user) };
  },

  async login(email: string, password: string, role?: 'ADMIN' | 'MERCHANT') {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    if (role && user.role !== role) {
      throw new AppError(`Access denied. This account does not have ${role.toLowerCase()} privileges.`, 403, 'INVALID_ROLE_FOR_PORTAL');
    }

    const token = generateToken(user.id, user.role);
    return { token, user: toPublicUser(user) };
  },

  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found.', 404, 'USER_NOT_FOUND');
    }
    return user;
  },
};
