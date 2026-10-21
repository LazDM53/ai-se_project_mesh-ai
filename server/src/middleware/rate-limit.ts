import rateLimit from 'express-rate-limit';

const isProduction = process.env.NODE_ENV === 'production';
console.log('Rate limiter production mode:', isProduction);

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skip: () => !isProduction,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    error: {
      message: 'Too many login attempts. Please try again later.',
    },
  },
});

export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skip: () => !isProduction,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    error: {
      message: 'Too many registration attempts. Please try again later.',
    },
  },
});