import { LoyaltyService } from '../services/loyalty.service.js';

export const LoyaltyController = {
  async getProfile(req, res) {
    try {
      const profile = await LoyaltyService.getProfile();
      res.json({ success: true, data: profile });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getPromotions(req, res) {
    try {
      const promotions = await LoyaltyService.getPromotions();
      res.json({ success: true, data: promotions });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async validateVoucher(req, res) {
    try {
      const voucher = await LoyaltyService.validateVoucher(req.params.code);
      res.json({ success: true, data: voucher });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async markNotificationRead(req, res) {
    try {
      const user = await LoyaltyService.markNotificationRead(req.params.id);
      res.json({ success: true, data: user });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};
