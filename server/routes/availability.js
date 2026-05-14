import express from 'express';
import Booking from '../models/Booking.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/availability/check
// @desc    Check caregiver availability for a date range
// @access  Private
router.get('/check', protect, async (req, res) => {
  try {
    const { caregiverId, startDate, endDate } = req.query;

    if (!caregiverId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({ message: 'Start date must be before end date' });
    }

    // Check for overlapping bookings that are Accepted or In Progress
    const overlappingBookings = await Booking.find({
      caregiverId,
      status: { $in: ['Accepted', 'In Progress'] },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }
      ]
    });

    if (overlappingBookings.length > 0) {
      return res.json({ available: false, message: 'Caregiver is not available during this time' });
    }

    res.json({ available: true, message: 'Caregiver is available' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

export default router;
