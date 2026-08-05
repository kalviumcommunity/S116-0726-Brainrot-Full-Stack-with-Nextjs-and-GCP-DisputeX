import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository';
import { AppError } from '../interfaces/error.interface';
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

    const token = generateToken(user.id, user.role);
    return { token, user: toPublicUser(user) };
  },

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
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
