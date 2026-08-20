import type { Request, Response } from 'express';

import Chat from '../models/chat.js';
import Message from '../models/message.js';
import Document from '../models/document.js';
import Chunk from '../models/chunk.js';

import { createEmbedding } from '../utils/embeddings.js';

import {
  getClient,
  LLM_MODEL,
  buildContext,
} from '../utils/openai-client.js';

import { rankBySimilarity } from '../utils/vector-search.js';

export const createMessage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { question } = req.body;

  // Convert req.params.id to a definite string
  const chatId = String(req.params.id);

  const userId = req.user!.userId;

  // Validate question
  if (!question) {
    res.status(400).json({
      success: false,
      data: null,
      error: { message: 'question is required' },
    });
    return;
  }

  // Verify that the chat exists and belongs to the logged-in user
  const chat = await Chat.findOne({
    _id: chatId,
    userId,
  });

  if (!chat) {
    res.status(404).json({
      success: false,
      data: null,
      error: { message: 'Chat not found' },
    });
    return;
  }

  // Find documents belonging to the logged-in user
  const userDocs = await Document.find({ userId }, '_id');

  const docIds = userDocs.map((document) => document._id);

  // Find chunks belonging to the user's documents
  const chunkRecords = await Chunk.find({
    documentId: { $in: docIds },
  });

  const chunks = chunkRecords.map((chunk) => ({
    id: String(chunk._id),
    documentId: String(chunk.documentId),
    text: chunk.text,
    embedding: chunk.embedding,
  }));

  // Create embedding for the question
  const queryEmbedding = await createEmbedding(question);

  // Find the most relevant chunks
  const ranked = rankBySimilarity(
    queryEmbedding,
    chunks,
    5,
  );

  // Build context for the LLM
  const context = buildContext(ranked);

  // Ask the LLM
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

  // Save the user's question
  const userMessage = await Message.create({
    chatId,
    role: 'user',
    content: question,
  });

  // Save the assistant's answer
  const assistantMessage = await Message.create({
    chatId,
    role: 'assistant',
    content: answer,
  });

  // Return both messages
  res.status(201).json({
    success: true,
    data: [userMessage, assistantMessage],
    error: null,
  });
};