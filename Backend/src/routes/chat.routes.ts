import { Router } from 'express';
import { getChatResponse } from '../controllers/chat.controller';
import { protectRoute } from '../middlewares/protectRoute';

const router = Router();

router.post('/assistant', protectRoute, getChatResponse);

export default router; 