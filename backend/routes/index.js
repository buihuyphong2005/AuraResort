import express from 'express';
import hotelRoutes from './hotel.routes.js';
import bookingRoutes from './booking.routes.js';
import paymentRoutes from './payment.routes.js';
import reviewRoutes from './review.routes.js';
import loyaltyRoutes from './loyalty.routes.js';
import tourismRoutes from './tourism.routes.js';
import chatbotRoutes from './chatbot.routes.js';
import authRoutes from './auth.routes.js';
import articleRoutes from './article.routes.js';

const apiRouter = express.Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/articles', articleRoutes);
apiRouter.use('/hotels', hotelRoutes);
apiRouter.use('/bookings', bookingRoutes);
apiRouter.use('/payments', paymentRoutes);
apiRouter.use('/reviews', reviewRoutes);
apiRouter.use('/loyalty', loyaltyRoutes);
apiRouter.use('/tourism', tourismRoutes);
apiRouter.use('/chatbot', chatbotRoutes);

apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AuraResort Vietnam Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

export default apiRouter;
