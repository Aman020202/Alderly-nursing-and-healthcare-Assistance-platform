import express from 'express';
import Booking from '../models/Booking.js';
import Caregiver from '../models/Caregiver.js';
import { protect } from '../middleware/auth.js';
import { createNotification } from './notifications.js';

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking request
// @access  Private (Family)
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'Elderly/Family') {
      return res.status(403).json({ message: 'Only families can create bookings' });
    }

    const { patientId, caregiverId, serviceType, durationOption, startDate, endDate, notes } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // 1. Double check availability
    const overlappingBookings = await Booking.find({
      caregiverId,
      status: { $in: ['Accepted', 'In Progress'] },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }
      ]
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({ message: 'Caregiver is no longer available for these dates' });
    }

    // 2. Fetch caregiver rate and calculate total cost backend-side
    const caregiver = await Caregiver.findById(caregiverId).populate('userId', 'email name');
    if (!caregiver) {
      return res.status(404).json({ message: 'Caregiver not found' });
    }

    const durationMs = end.getTime() - start.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    
    // Exact hourly calculation regardless of durationOption label
    let totalAmount = durationHours * caregiver.hourlyRate;
    // Round to 2 decimal places
    totalAmount = Math.round(totalAmount * 100) / 100;

    const newBooking = new Booking({
      familyId: req.user.id,
      patientId,
      caregiverId,
      serviceType,
      durationOption,
      startDate: start,
      endDate: end,
      totalAmount,
      notes
    });

    const savedBooking = await newBooking.save();

    // Create Notification for Caregiver
    await createNotification({
      userId: caregiver.userId._id,
      type: 'booking_confirmation',
      title: 'New Booking Request',
      message: `You have a new booking request for ${serviceType} from ${req.user.name}.`,
      link: `/bookings`,
      sendEmailNotif: true,
      emailTo: caregiver.userId.email,
      emailTemplate: 'booking_confirmation',
      emailData: {
        recipientName: caregiver.userId.name,
        serviceType,
        patientName: 'Your Patient', // Could populate patient name if needed
        startDate: start.toLocaleDateString(),
        totalAmount
      }
    });

    res.status(201).json(savedBooking);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/bookings
// @desc    Get bookings for logged in user (Family or Caregiver)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    let query = {};
    
    if (req.user.role === 'Elderly/Family') {
      query.familyId = req.user.id;
    } else if (req.user.role === 'Caregiver') {
      const caregiver = await Caregiver.findOne({ userId: req.user.id });
      if (!caregiver) return res.json({ bookings: [], total: 0, totalPages: 0 });
      query.caregiverId = caregiver._id;
    } else if (req.user.role === 'Admin') {
      query = {};
    }

    if (status && status !== 'All') {
      if (status === 'Active') {
        query.status = { $in: ['Accepted', 'In Progress'] };
      } else if (status === 'Past') {
        query.status = { $in: ['Completed', 'Rejected', 'Cancelled'] };
      } else {
        query.status = status;
      }
    }

    // Since we need to search populated fields (patient name), 
    // we'd normally use aggregation, but for simplicity we'll filter by ID 
    // if search matches patient names (not ideal for huge scale but works here).
    // Or we just search serviceType and notes.
    if (search) {
      query.$or = [
        { serviceType: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('patientId', 'name age gender profilePicture')
        .populate({
           path: 'caregiverId',
           populate: { path: 'userId', select: 'name profilePicture email phone' }
        })
        .populate('familyId', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Booking.countDocuments(query)
    ]);

    res.json({ 
      bookings, 
      total, 
      totalPages: Math.ceil(total / Number(limit)), 
      currentPage: Number(page) 
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('patientId')
      .populate({
         path: 'caregiverId',
         populate: { path: 'userId', select: 'name profilePicture' }
      })
      .populate('familyId', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate('caregiverId').populate('familyId', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Role-based status transition checks
    const caregiverProfile = await Caregiver.findOne({ userId: req.user.id });
    const isCaregiver = caregiverProfile && booking.caregiverId._id.toString() === caregiverProfile._id.toString();
    const isFamily = booking.familyId._id.toString() === req.user.id;

    if (isFamily) {
      // Families can only Cancel
      if (status !== 'Cancelled') {
        return res.status(403).json({ message: 'Families can only cancel bookings' });
      }
    } else if (isCaregiver) {
      // Caregivers can Accept, Reject, mark In Progress, or Complete
      if (!['Accepted', 'Rejected', 'In Progress', 'Completed'].includes(status)) {
        return res.status(403).json({ message: 'Invalid status transition for caregiver' });
      }
    } else if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = status;
    await booking.save();

    // Create Notification for Family
    if (['Accepted', 'Rejected', 'Cancelled'].includes(status)) {
      const recipientId = status === 'Cancelled' ? booking.caregiverId.userId : booking.familyId._id;
      const recipientEmail = status === 'Cancelled' ? caregiverProfile?.userId?.email : booking.familyId.email;
      const recipientName = status === 'Cancelled' ? caregiverProfile?.userId?.name : booking.familyId.name;

      await createNotification({
        userId: recipientId,
        type: 'status_change',
        title: `Booking ${status}`,
        message: `Your booking request for ${booking.serviceType} has been ${status.toLowerCase()}.`,
        link: `/bookings`,
        sendEmailNotif: true,
        emailTo: recipientEmail,
        emailTemplate: 'status_change',
        emailData: {
          recipientName,
          status,
          message: `Your booking for ${booking.serviceType} is now ${status.toLowerCase()}.`
        }
      });
    }

    res.json(booking);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

export default router;
