import { UserModel } from '../models/user.model.js';

export const AuthService = {
  async register(data) {
    const { name, email, password, phone } = data;

    if (!name || !email || !password) {
      throw new Error('Vui lòng cung cấp đầy đủ họ tên, email và mật khẩu');
    }

    if (password.length < 6) {
      throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
    }

    const existing = await UserModel.findByEmail(email);
    if (existing) {
      throw new Error('Email này đã được đăng ký tài khoản. Vui lòng đăng nhập.');
    }

    const user = await UserModel.create({
      name,
      email: email.trim().toLowerCase(),
      password, // In demo environment stored simply, or hashed
      phone: phone || ''
    });

    const token = 'token-' + user.id + '-' + Date.now();

    const { password: _, ...safeUser } = user;
    return {
      user: safeUser,
      token
    };
  },

  async login(email, password) {
    if (!email || !password) {
      throw new Error('Vui lòng nhập đầy đủ email và mật khẩu');
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Tài khoản không tồn tại. Vui lòng kiểm tra lại email.');
    }

    if (user.password !== password) {
      throw new Error('Mật khẩu không chính xác');
    }

    const token = 'token-' + user.id + '-' + Date.now();

    const { password: _, ...safeUser } = user;
    return {
      user: safeUser,
      token
    };
  },

  async getProfile(userId) {
    const user = await UserModel.getProfile(userId);
    if (!user) {
      throw new Error('Không tìm thấy tài khoản người dùng');
    }
    const { password: _, ...safeUser } = user;
    return safeUser;
  }
};
