import { UserModel } from '../models/user.model.js';
import { PromotionModel } from '../models/promotion.model.js';

export const LoyaltyService = {
  async getProfile() {
    return await UserModel.getProfile();
  },

  async getPromotions() {
    return await PromotionModel.find();
  },

  async validateVoucher(code) {
    const voucher = await PromotionModel.findByCode(code);
    if (!voucher) {
      throw new Error('Mã ưu đãi không hợp lệ hoặc đã hết hạn');
    }
    return voucher;
  },

  async markNotificationRead(notifId) {
    return await UserModel.markNotificationRead(notifId);
  }
};
