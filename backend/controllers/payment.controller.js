import { PaymentService } from '../services/payment.service.js';

export const PaymentController = {
  async createPaymentIntent(req, res) {
    try {
      const paymentIntent = await PaymentService.createPaymentIntent(req.body);
      res.json({ success: true, data: paymentIntent });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async verifyPayment(req, res) {
    try {
      const { transactionId, method } = req.body;
      const result = await PaymentService.verifyPayment(transactionId, method);
      res.json({ success: true, data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};
