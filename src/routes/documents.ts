import { Router } from 'express';

import {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument,
} from '../controllers/documents.js';

import { auth } from '../middleware/auth.js';

const documentsRouter = Router();

documentsRouter.use(auth);

documentsRouter.post('/', uploadDocument);

documentsRouter.get('/', getDocuments);

documentsRouter.get('/:id', getDocument);

documentsRouter.delete('/:id', deleteDocument);

export { documentsRouter };