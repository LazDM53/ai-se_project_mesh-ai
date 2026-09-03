import type { Request, Response } from 'express';

import { readFileSync } from 'fs';
import { PDFParse } from 'pdf-parse';

import Document from '../models/document.js';
import Chunk from '../models/chunk.js';

import { chunkText } from '../utils/chunk.js';
import { createEmbedding } from '../utils/embeddings.js';

export const uploadDocument = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.file) {
    res.status(400).json({
      success: false,
      data: null,
      error: { message: 'File is required' },
    });
    return;
  }

  // Parse the PDF
  const buffer = readFileSync(req.file.path);

  const parser = new PDFParse({
    data: buffer,
  });

  const { text } = await parser.getText();

  // Split text into chunks
  const chunks = chunkText(text);

  // Use provided title or original filename
  const title = req.body.title || req.file.originalname;

  // Create document
  const document = await Document.create({
    title,
    fileName: req.file.originalname,
    userId: req.user!.userId,
  });

  // Create embeddings and save chunks
  await Promise.all(
    chunks.map(async (text) => {
      const embedding = await createEmbedding(text);

      return Chunk.create({
        documentId: document._id,
        text,
        embedding,
      });
    }),
  );

  res.status(201).json({
    success: true,
    data: document,
    error: null,
  });
};

export const getDocuments = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user!.userId;

  const documents = await Document.find({ userId });

  res.status(200).json({
    success: true,
    data: documents,
    error: null,
  });
};

export const getDocument = (
  req: Request,
  res: Response,
): void => {
  res.status(200).json({
    success: true,
    data: {},
    error: null,
  });
};

export const deleteDocument = (
  req: Request,
  res: Response,
): void => {
  res.sendStatus(204);
};