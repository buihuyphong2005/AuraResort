import express from 'express';
import { BookingController } from '../controllers/booking.controller.js';

const router = express.Router();

router.post('/', BookingController.createBooking);
router.get('/', BookingController.getBookings);
router.get('/code/:code', BookingController.getBookingByCode);

export default router;
