import mongoose from 'mongoose';
import { initialLoyaltyUser } from '../data/seedData.js';

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  tier: { type: String, default: 'Bronze' },
  points: { type: Number, default: 500 },
  pointsToNextTier: { type: Number, default: 2500 },
  nextTier: { type: String, default: 'Silver' },
  memberSince: { type: String, default: () => new Date().toISOString().split('T')[0] },
  totalBookings: { type: Number, default: 0 },
  benefits: [{ type: String }],
  notifications: [{
    id: String,
    title: String,
    content: String,
    time: String,
    read: Boolean,
    type: String
  }]
}, { timestamps: true });

export const MongooseUser = mongoose.models.User || mongoose.model('User', UserSchema);

// Initial list of registered users
let memoryUsers = [
  {
    ...initialLoyaltyUser,
    password: 'Password123@' // Demo password
  }
];

export const UserModel = {
  async findByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    if (mongoose.connection.readyState === 1) {
      try {
        const u = await MongooseUser.findOne({ email: cleanEmail });
        if (u) return u;
      } catch (e) {
        console.warn('Fallback to memory findByEmail:', e.message);
      }
    }
    return memoryUsers.find(u => u.email.toLowerCase() === cleanEmail) || null;
  },

  async findById(id) {
    if (mongoose.connection.readyState === 1) {
      try {
        const u = await MongooseUser.findOne({ id });
        if (u) return u;
      } catch (e) {
        console.warn('Fallback to memory findById:', e.message);
      }
    }
    return memoryUsers.find(u => u.id === id) || null;
  },

  async create(userData) {
    const newUser = {
      id: 'user-' + Date.now(),
      tier: 'Bronze',
      points: 500, // Welcome bonus points!
      pointsToNextTier: 2500,
      nextTier: 'Silver',
      memberSince: new Date().toISOString().split('T')[0],
      totalBookings: 0,
      benefits: [
        'Giảm giá hội viên mới 10% với mã AURA15',
        'Tặng 500 điểm thưởng chào mừng',
        'Nước uống thanh mát chào đón khi check-in'
      ],
      notifications: [
        {
          id: 'notif-welcome',
          title: 'Chào mừng gia nhập Aura Loyalty Club!',
          content: 'Bạn nhận được 500 điểm thưởng khởi đầu và voucher giảm 15% AURA15.',
          time: 'Vừa xong',
          read: false,
          type: 'promo'
        }
      ],
      ...userData
    };

    if (mongoose.connection.readyState === 1) {
      try {
        const created = await MongooseUser.create(newUser);
        memoryUsers.push(newUser);
        return created;
      } catch (e) {
        console.warn('Fallback to memory create user:', e.message);
      }
    }

    memoryUsers.push(newUser);
    return newUser;
  },

  async getProfile(userId) {
    if (userId) {
      const u = memoryUsers.find(user => user.id === userId);
      if (u) return u;
    }
    return memoryUsers[0];
  },

  async addPoints(userId, pts) {
    const target = userId ? memoryUsers.find(u => u.id === userId) : memoryUsers[0];
    if (target) {
      target.points += pts;
      target.totalBookings += 1;
      if (target.points >= 6000) {
        target.tier = 'Diamond';
        target.nextTier = 'Royalty Elite';
        target.pointsToNextTier = 0;
      } else if (target.points >= 3000) {
        target.tier = 'Gold';
        target.nextTier = 'Diamond';
        target.pointsToNextTier = 6000 - target.points;
      } else if (target.points >= 1500) {
        target.tier = 'Silver';
        target.nextTier = 'Gold';
        target.pointsToNextTier = 3000 - target.points;
      }
      return target;
    }
    return null;
  },

  async markNotificationRead(userId, notifId) {
    const target = userId ? memoryUsers.find(u => u.id === userId) : memoryUsers[0];
    if (target) {
      if (notifId === 'all') {
        target.notifications.forEach(n => n.read = true);
      } else {
        const n = target.notifications.find(item => item.id === notifId);
        if (n) n.read = true;
      }
      return target;
    }
    return null;
  },

  async addNotification(userId, title, content, type = 'promo') {
    const target = userId ? memoryUsers.find(u => u.id === userId) : memoryUsers[0];
    if (target) {
      const newNotif = {
        id: 'notif-' + Date.now(),
        title,
        content,
        time: 'Vừa xong',
        read: false,
        type
      };
      target.notifications.unshift(newNotif);
      return newNotif;
    }
    return null;
  }
};
