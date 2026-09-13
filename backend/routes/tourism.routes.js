import express from 'express';
import { TourismController } from '../controllers/tourism.controller.js';

const router = express.Router();

router.get('/', TourismController.getAllTourism);
router.get('/hotel/:hotelId', TourismController.getTourismByHotel);
router.get('/:id', TourismController.getTourismDetail);

export default router;
