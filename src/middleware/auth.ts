import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const auth = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      data: null,
      error: { message: 'Unauthorized' },
    });
    return;
  }

  const token = authorization.split(' ')[1];

  if (!token) {
    res.status(401).json({
      success: false,
      data: null,
      error: { message: 'Unauthorized' },
    });
    return;
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as jwt.JwtPayload;

    if (typeof payload.userId !== 'string') {
      res.status(401).json({
        success: false,
        data: null,
        error: { message: 'Unauthorized' },
      });
      return;
    }

    req.user = { userId: payload.userId };

    next();
  } catch {
    res.status(401).json({
      success: false,
      data: null,
      error: { message: 'Unauthorized' },
    });
  }
};