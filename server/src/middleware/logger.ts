import type { Request, Response, NextFunction } from 'express';
import { logger as appLogger } from '../utils/logger.js';

export const logger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  appLogger.info(`${req.method} ${req.path}`);
  next();
};