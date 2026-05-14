import express from 'express';
import Booking from '../../models/Booking.js';
import Caregiver from '../../models/Caregiver.js';
import Review from '../../models/Review.js';
import Dispute from '../../models/Dispute.js';
import { protect } from '../../middleware/auth.js';
import { authorize } from '../../middleware/roleCheck.js';

const router = express.Router();
router.use(protect);
router.use(authorize('Admin'));

// @route   GET /api/admin/reports/caregiver-performance
router.get('/caregiver-performance', async (req, res) => {
  try {
    const caregivers = await Caregiver.find().populate('userId', 'name email');

    const report = await Promise.all(caregivers.map(async (cg) => {
      const totalBookings = await Booking.countDocuments({ caregiverId: cg._id });
      const completed = await Booking.countDocuments({ caregiverId: cg._id, status: 'Completed' });
      const revenue = await Booking.aggregate([
        { $match: { caregiverId: cg._id, status: 'Completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);

      return {
        name: cg.userId.name,
        email: cg.userId.email,
        title: cg.professionalTitle,
        totalBookings,
        completedBookings: completed,
        completionRate: totalBookings > 0 ? Math.round((completed / totalBookings) * 100) : 0,
        rating: cg.rating,
        reviewCount: cg.reviewCount,
        totalRevenue: revenue[0]?.total || 0
      };
    }));

    res.json(report);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/reports/booking-completion
router.get('/booking-completion', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let match = {};
    if (startDate && endDate) {
      match.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const [total, completed, cancelled, rejected] = await Promise.all([
      Booking.countDocuments(match),
      Booking.countDocuments({ ...match, status: 'Completed' }),
      Booking.countDocuments({ ...match, status: 'Cancelled' }),
      Booking.countDocuments({ ...match, status: 'Rejected' })
    ]);

    res.json({
      total,
      completed,
      cancelled,
      rejected,
      inProgress: total - completed - cancelled - rejected,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/reports/revenue
router.get('/revenue', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let match = { status: { $in: ['Completed', 'In Progress', 'Accepted'] } };
    if (startDate && endDate) {
      match.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const data = await Booking.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$serviceType',
          revenue: { $sum: '$totalAmount' },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);

    res.json({
      byService: data.map(d => ({ service: d._id, revenue: Math.round(d.revenue * 100) / 100, bookings: d.bookings })),
      totalRevenue: Math.round(totalRevenue * 100) / 100
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// ---- Dispute Routes ----

// @route   GET /api/admin/reports/disputes
router.get('/disputes', async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status && status !== 'All') query.status = status;

    const disputes = await Dispute.find(query)
      .populate('bookingId')
      .populate('raisedBy', 'name email role')
      .sort({ createdAt: -1 });

    res.json(disputes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/admin/reports/disputes/:id
router.put('/disputes/:id', async (req, res) => {
  try {
    const { status, adminNotes, resolution } = req.body;
    const dispute = await Dispute.findById(req.params.id);
    if (!dispute) return res.status(404).json({ message: 'Dispute not found' });

    if (status) dispute.status = status;
    if (adminNotes !== undefined) dispute.adminNotes = adminNotes;
    if (resolution !== undefined) dispute.resolution = resolution;

    await dispute.save();
    res.json(dispute);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

export default router;
