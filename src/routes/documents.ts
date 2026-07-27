import { Router } from 'express';
import {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument,
} from '../controllers/documents.js';

const documentsRouter = Router();

documentsRouter.post('/', uploadDocument);
documentsRouter.get('/', getDocuments);
documentsRouter.get('/:id', getDocument);
documentsRouter.delete('/:id', deleteDocument);

export { documentsRouter };