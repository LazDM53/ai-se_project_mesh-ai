import { Router } from 'express';
import { query } from '../controllers/query.js';

const queryRouter = Router();

queryRouter.post('/', query);

export { queryRouter };