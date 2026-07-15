import express from 'express';
import { router } from './routes/index.js';
import { logger } from './middleware/logger.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(logger);
app.use(express.json());

// Routes
app.use(router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});