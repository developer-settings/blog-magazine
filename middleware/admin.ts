import { Role } from '@prisma/client';
import type { Request, Response, NextFunction } from 'express';

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role !== Role.ADMIN) {
    return res.status(403).json('Access denied.');
  }
  next();
};
