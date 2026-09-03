import { Router } from 'express';
import multer from 'multer';

import {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument,
} from '../controllers/documents.js';

import { auth } from '../middleware/auth.js';

const documentsRouter = Router();

const upload = multer({ dest: 'uploads/' });

documentsRouter.use(auth);

documentsRouter.post('/', upload.single('file'), uploadDocument);

documentsRouter.get('/', getDocuments);

documentsRouter.get('/:id', getDocument);

documentsRouter.delete('/:id', deleteDocument);

export { documentsRouter };