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
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
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
    id: 'user-admin',
    name: 'Quản Trị Viên AuraResort',
    email: 'admin@auraresort.vn',
    password: 'Admin123@',
    phone: '0901234567',
    role: 'admin',
    tier: 'Diamond',
    points: 99999,
    pointsToNextTier: 0,
    nextTier: 'Royalty Elite',
    memberSince: '2024-01-01',
    totalBookings: 0,
    benefits: ['Quyền quản trị toàn hệ thống AuraResort'],
    notifications: []
  },
  {
    ...initialLoyaltyUser,
    role: 'user',
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
    if (!userId) return memoryUsers.find(user => user.role !== 'admin') || null;
    if (mongoose.connection.readyState === 1) {
      try {
        const user = await MongooseUser.findOne({ id: userId });
        if (user) return user;
      } catch (e) {
        console.warn('Fallback to memory getProfile:', e.message);
      }
    }
    return memoryUsers.find(user => user.id === userId) || null;
  },

  async addPoints(userId, pts) {
    if (!userId) return null;
    let target = null;
    if (mongoose.connection.readyState === 1) {
      try {
        target = await MongooseUser.findOne({ id: userId });
      } catch (e) {
        console.warn('Fallback to memory addPoints:', e.message);
      }
    }
    target ||= memoryUsers.find(user => user.id === userId);
    if (!target) return null;

    {
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
      if (target.save) await target.save();
      return target;
    }
  },

  async markNotificationRead(userId, notifId) {
    if (!userId) return null;
    let target = null;
    if (mongoose.connection.readyState === 1) {
      try {
        target = await MongooseUser.findOne({ id: userId });
      } catch (e) {
        console.warn('Fallback to memory markNotificationRead:', e.message);
      }
    }
    target ||= memoryUsers.find(user => user.id === userId);
    if (!target) return null;
    if (notifId === 'all') {
      target.notifications.forEach(n => n.read = true);
    } else {
      const notification = target.notifications.find(item => item.id === notifId);
      if (notification) notification.read = true;
    }
    if (target.save) await target.save();
    return target;
  },

  async addNotification(userId, title, content, type = 'promo') {
    if (!userId) return null;
    let target = null;
    if (mongoose.connection.readyState === 1) {
      try {
        target = await MongooseUser.findOne({ id: userId });
      } catch (e) {
        console.warn('Fallback to memory addNotification:', e.message);
      }
    }
    target ||= memoryUsers.find(user => user.id === userId);
    if (!target) return null;
    const newNotification = {
      id: 'notif-' + Date.now(),
      title,
      content,
      time: 'Vừa xong',
      read: false,
      type
    };
    target.notifications.unshift(newNotification);
    if (target.save) await target.save();
    return newNotification;
  },

  async getAll() {
    if (mongoose.connection.readyState === 1) {
      try {
        const users = await MongooseUser.find({});
        if (users && users.length > 0) return users;
      } catch (e) {
        console.warn('Fallback to memory getAll users:', e.message);
      }
    }
    return memoryUsers;
  }
};
