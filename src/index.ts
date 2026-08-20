import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import { router } from './routes/index.js';
import { logger } from './middleware/logger.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(logger);
app.use(express.json());

// Health check
app.get('/health', (req, res): void => {
  res.status(200).json({
    success: true,
    data: { status: 'ok' },
    error: null,
  });
});

// Routes
app.use(router);

// 404 handler
app.use(notFoundHandler);

// 500 handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});