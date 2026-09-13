import express from 'express';
import { ChatbotController } from '../controllers/chatbot.controller.js';

const router = express.Router();

router.post('/chat', ChatbotController.chat);
router.post('/recommend', ChatbotController.recommend);
router.get('/suggest', ChatbotController.getSuggestions);
router.get('/config', ChatbotController.getConfig);
router.post('/config', ChatbotController.updateConfig);

export default router;

