import express from 'express'
import { verifyToken } from '../middleware/authMiddleware.js';
import { converController } from '../controller/converController.js';

const router = express.Router()

router.get("/",verifyToken,converController)

export default router;