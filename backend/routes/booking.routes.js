import express from 'express';
import { BookingController } from '../controllers/booking.controller.js';

const router = express.Router();

router.post('/', BookingController.createBooking);
router.get('/', BookingController.getBookingsByEmail);
router.get('/code/:code', BookingController.getBookingByCode);

export default router;
