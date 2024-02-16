import type { Request, Response, NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}

export const authorization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json('Access denied. No token provided.');
  }
  try {
    const decoded = jsonwebtoken.verify(token, Bun.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json('Invalid token.');
  }
};
