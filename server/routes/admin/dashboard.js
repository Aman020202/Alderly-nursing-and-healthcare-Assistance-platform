import express from 'express';
import User from '../../models/User.js';
import Caregiver from '../../models/Caregiver.js';
import Booking from '../../models/Booking.js';
import Review from '../../models/Review.js';
import { protect } from '../../middleware/auth.js';
import { authorize } from '../../middleware/roleCheck.js';

const router = express.Router();
router.use(protect);
router.use(authorize('Admin'));

// @route   GET /api/admin/dashboard/kpis
router.get('/kpis', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalUsers, totalCaregivers, activeCaregivers, bookingsThisMonth, revenueAgg] = await Promise.all([
      User.countDocuments(),
      Caregiver.countDocuments(),
      Caregiver.countDocuments({ verificationStatus: 'Verified' }),
      Booking.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Booking.aggregate([
        { $match: { createdAt: { $gte: startOfMonth }, status: { $in: ['Completed', 'In Progress', 'Accepted'] } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);

    res.json({
      totalUsers,
      totalCaregivers,
      activeCaregivers,
      bookingsThisMonth,
      revenueThisMonth: revenueAgg[0]?.total || 0
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/dashboard/booking-trends
router.get('/booking-trends', async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const trends = await Booking.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formatted = trends.map(t => ({
      month: `${months[t._id.month - 1]} ${t._id.year}`,
      bookings: t.count,
      revenue: Math.round(t.revenue * 100) / 100
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/dashboard/revenue-by-service
router.get('/revenue-by-service', async (req, res) => {
  try {
    const data = await Booking.aggregate([
      { $match: { status: { $in: ['Completed', 'In Progress', 'Accepted'] } } },
      { $group: { _id: '$serviceType', revenue: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
      { $sort: { revenue: -1 } }
    ]);

    const formatted = data.map(d => ({
      service: d._id,
      revenue: Math.round(d.revenue * 100) / 100,
      bookings: d.count
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/dashboard/satisfaction
router.get('/satisfaction', async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const data = await Review.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formatted = data.map(d => ({
      month: `${months[d._id.month - 1]}`,
      avgRating: Math.round(d.avgRating * 10) / 10,
      reviews: d.count
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

export default router;
