import type { Request, Response } from 'express';

import Document from '../models/document.js';
import Chunk from '../models/chunk.js';

import { createEmbedding } from '../utils/embeddings.js';

import {
  getClient,
  LLM_MODEL,
  buildContext,
} from '../utils/openai-client.js';

import { rankBySimilarity } from '../utils/vector-search.js';

export const queryDocuments = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { question } = req.body;

  if (!question) {
    res.status(400).json({
      success: false,
      data: null,
      error: { message: 'question is required' },
    });
    return;
  }

  const userId = req.user!.userId;

  // Find documents belonging to the logged-in user
  const userDocs = await Document.find({ userId }, '_id');

  // Get the document IDs
  const docIds = userDocs.map((doc) => doc._id);

  // Find chunks belonging to those documents
  const chunkRecords = await Chunk.find({
    documentId: { $in: docIds },
  });

  const chunks = chunkRecords.map((c) => ({
    id: String(c._id),
    documentId: String(c.documentId),
    text: c.text,
    embedding: c.embedding,
  }));

  // Create an embedding for the question
  const questionEmbedding = await createEmbedding(question);

  // Rank chunks by similarity
  const rankedChunks = rankBySimilarity(
    questionEmbedding,
    chunks,
    5,
  );

  // Build context for the AI
  const context = buildContext(rankedChunks);

  // Generate answer
  const response = await getClient().chat.completions.create({
    model: LLM_MODEL,
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful assistant. Answer the question using only the provided context. If the answer cannot be found in the context, say you do not have enough information.',
      },
      {
        role: 'user',
        content: `Context:\n${context}\n\nQuestion:\n${question}`,
      },
    ],
  });

  const answer =
    response.choices[0]?.message?.content ??
    'No answer was generated.';

  res.status(200).json({
    success: true,
    data: {
      answer,
    },
    error: null,
  });
};