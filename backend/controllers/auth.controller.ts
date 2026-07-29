import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

const generateToken = (userId: string, role: string) => {
  const secret = process.env.JWT_SECRET || 'supersecret';
  return jwt.sign({ userId, role }, secret, { expiresIn: '1d' });
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role || 'ADMIN',
      },
    });

    const token = generateToken(user.id, user.role);
    return res.status(201).json({ status: 'success', data: { token, user: { id: user.id, email: user.email, role: user.role } } });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.role);
    return res.status(200).json({ status: 'success', data: { token, user: { id: user.id, email: user.email, role: user.role } } });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
      select: { id: true, email: true, role: true, createdAt: true }
    });
    
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
    
    return res.status(200).json({ status: 'success', data: { user } });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};
