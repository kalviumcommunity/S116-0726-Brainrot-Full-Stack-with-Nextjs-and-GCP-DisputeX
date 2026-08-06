import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { sendSuccess } from '../utils/response';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role } = req.body;
    const result = await authService.register(email, password, role);
    return sendSuccess(res, 201, {
      message: 'User registered successfully.',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role } = req.body;
    const result = await authService.login(email, password, role);
    return sendSuccess(res, 200, {
      message: 'Login successful.',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getProfile(req.user!.userId);
    return sendSuccess(res, 200, { data: { user } });
  } catch (error) {
    return next(error);
  }
};
