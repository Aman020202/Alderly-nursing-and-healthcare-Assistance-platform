import express from 'express';
import Booking from '../models/Booking.js';
import Caregiver from '../models/Caregiver.js';
import Review from '../models/Review.js';
import { protect } from '../middleware/auth.js';
import { getIO } from '../sockets/tracking.js';
import { createNotification } from './notifications.js';

const router = express.Router();

// @route   GET /api/tracking/:bookingId
// @desc    Get full booking details for tracking
// @access  Private
router.get('/:bookingId', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate('patientId', 'name age gender')
      .populate({
        path: 'caregiverId',
        populate: { path: 'userId', select: 'name profilePicture email' }
      })
      .populate('familyId', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check for existing review
    const review = await Review.findOne({ bookingId: req.params.bookingId });

    res.json({ booking, review });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/tracking/:bookingId/status
// @desc    Update booking status with real-time broadcast
// @access  Private (Caregiver or Family)
router.put('/:bookingId/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.bookingId)
      .populate('caregiverId')
      .populate('familyId', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Authorization check
    const caregiverProfile = await Caregiver.findOne({ userId: req.user.id });
    const isCaregiver = caregiverProfile && booking.caregiverId._id.toString() === caregiverProfile._id.toString();
    const isFamily = booking.familyId._id.toString() === req.user.id;

    if (!isCaregiver && !isFamily && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = status;
    await booking.save();

    // Emit real-time status update
    try {
      const io = getIO();
      io.to(req.params.bookingId).emit('status_update', {
        bookingId: req.params.bookingId,
        status: booking.status,
        updatedAt: new Date()
      });
    } catch (e) {
      console.log('Socket not available, skipping real-time emit');
    }

    // Create Notification
    const recipientId = isCaregiver ? booking.familyId._id : booking.caregiverId.userId;
    const recipientEmail = isCaregiver ? booking.familyId.email : ''; // Populate if needed
    const recipientName = isCaregiver ? booking.familyId.name : ''; // Populate if needed

    await createNotification({
      userId: recipientId,
      type: 'status_change',
      title: `Service ${status}`,
      message: `Your service for ${booking.serviceType} is now ${status.toLowerCase()}.`,
      link: `/tracking/${req.params.bookingId}`,
      sendEmailNotif: status === 'Completed' && isCaregiver,
      emailTo: recipientEmail,
      emailTemplate: status === 'Completed' ? 'review_request' : 'status_change',
      emailData: {
        recipientName,
        status,
        caregiverName: isCaregiver ? caregiverProfile.professionalTitle : '',
        serviceType: booking.serviceType
      }
    });

    res.json(booking);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/tracking/:bookingId/review
// @desc    Submit rating and review after completion
// @access  Private (Family)
router.post('/:bookingId/review', protect, async (req, res) => {
  try {
    if (req.user.role !== 'Elderly/Family') {
      return res.status(403).json({ message: 'Only family members can submit reviews' });
    }

    const { rating, reviewText } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'Completed') {
      return res.status(400).json({ message: 'Can only review completed bookings' });
    }

    // Check if already reviewed
    const existing = await Review.findOne({ bookingId: req.params.bookingId });
    if (existing) {
      return res.status(400).json({ message: 'This booking has already been reviewed' });
    }

    const review = new Review({
      bookingId: req.params.bookingId,
      familyId: req.user.id,
      caregiverId: booking.caregiverId,
      rating,
      reviewText
    });

    await review.save();

    // Update caregiver aggregate rating
    const allReviews = await Review.find({ caregiverId: booking.caregiverId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Caregiver.findByIdAndUpdate(booking.caregiverId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length
    });

    res.status(201).json(review);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

export default router;
