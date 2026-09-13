import { AuthService } from '../services/auth.service.js';

export const AuthController = {
  async register(req, res) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json({
        success: true,
        message: 'Đăng ký tài khoản thành công',
        data: result
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        error: err.message
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.json({
        success: true,
        message: 'Đăng nhập thành công',
        data: result
      });
    } catch (err) {
      res.status(401).json({
        success: false,
        error: err.message
      });
    }
  },

  async getMe(req, res) {
    try {
      const userId = req.query.userId || req.headers['x-user-id'];
      const user = await AuthService.getProfile(userId);
      res.json({
        success: true,
        data: user
      });
    } catch (err) {
      res.status(404).json({
        success: false,
        error: err.message
      });
    }
  }
};
