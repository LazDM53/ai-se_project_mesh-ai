import { Router } from 'express';
import {
  getChats,
  createChat,
  getChat,
  deleteChat,
  createMessage,
} from '../controllers/chats.js';

const chatsRouter = Router();

chatsRouter.get('/', getChats);
chatsRouter.post('/', createChat);
chatsRouter.get('/:id', getChat);
chatsRouter.delete('/:id', deleteChat);
chatsRouter.post('/:id/messages', createMessage);

export { chatsRouter };