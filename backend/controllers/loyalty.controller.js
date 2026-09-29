import { LoyaltyService } from '../services/loyalty.service.js';

export const LoyaltyController = {
  async getProfile(req, res) {
    try {
      const profile = await LoyaltyService.getProfile(req.query.userId);
      if (!profile) return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản người dùng' });
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
      const user = await LoyaltyService.markNotificationRead(req.query.userId, req.params.id);
      if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản người dùng' });
      res.json({ success: true, data: user });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};
