import { UserModel } from '../models/user.model.js';
import { PromotionModel } from '../models/promotion.model.js';

const toSafeUser = user => {
  if (!user) return null;
  const data = user?._doc || user;
  const { password: ignoredPassword, ...safeUser } = data;
  return safeUser;
};

export const LoyaltyService = {
  async getProfile(userId) {
    return toSafeUser(await UserModel.getProfile(userId));
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

  async markNotificationRead(userId, notifId) {
    return toSafeUser(await UserModel.markNotificationRead(userId, notifId));
  }
};
