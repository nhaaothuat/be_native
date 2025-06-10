import express from 'express'
import { verifyToken } from '../middleware/authMiddleware.js';
import { fetchAllMessageByConversationId } from '../controller/messageController.js';

const router = express.Router();

router.get("/:conversationId",verifyToken,fetchAllMessageByConversationId);


export default router;