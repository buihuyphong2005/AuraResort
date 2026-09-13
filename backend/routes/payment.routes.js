import express from 'express';
import { PaymentController } from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/intent', PaymentController.createPaymentIntent);
router.post('/verify', PaymentController.verifyPayment);

export default router;
