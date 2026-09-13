import express from 'express';
import { ReviewController } from '../controllers/review.controller.js';

const router = express.Router();

router.get('/hotel/:hotelId', ReviewController.getReviewsByHotel);
router.post('/', ReviewController.addReview);
router.post('/:id/like', ReviewController.likeReview);

export default router;
