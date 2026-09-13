import express from 'express';
import { LoyaltyController } from '../controllers/loyalty.controller.js';

const router = express.Router();

router.get('/profile', LoyaltyController.getProfile);
router.get('/promotions', LoyaltyController.getPromotions);
router.get('/voucher/:code', LoyaltyController.validateVoucher);
router.patch('/notifications/:id/read', LoyaltyController.markNotificationRead);

export default router;
