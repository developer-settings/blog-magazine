import type { Request, Response, NextFunction } from 'express';

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json('Access denied.');
  }
  next();
};
