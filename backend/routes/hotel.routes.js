import express from 'express';
import { HotelController } from '../controllers/hotel.controller.js';

const router = express.Router();

router.get('/', HotelController.getAllHotels);
router.get('/rooms/all', HotelController.getAllRooms);
router.patch('/rooms/:id/stock', HotelController.updateRoomStock);
router.get('/:id', HotelController.getHotelById);
router.get('/:hotelId/rooms', HotelController.getRoomsByHotel);
router.get('/rooms/:id', HotelController.getRoomById);

export default router;
