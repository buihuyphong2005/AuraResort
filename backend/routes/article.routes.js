import { Router } from 'express';
import { ArticleController } from '../controllers/article.controller.js';

const router = Router();

router.get('/', ArticleController.getAll);
router.get('/:id', ArticleController.getById);

export default router;
