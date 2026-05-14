import express from 'express';
import multer from 'multer';
import path from 'path';
import CareNote from '../models/CareNote.js';
import Booking from '../models/Booking.js';
import Caregiver from '../models/Caregiver.js';
import { protect } from '../middleware/auth.js';
import { getIO } from '../sockets/tracking.js';
import { createNotification } from './notifications.js';

const router = express.Router();

// Multer config for care note photos
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, `note-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb('Error: Images Only!');
  }
});

// @route   GET /api/care-notes/:bookingId
// @desc    Get all care notes for a booking
// @access  Private
router.get('/:bookingId', protect, async (req, res) => {
  try {
    const notes = await CareNote.find({ bookingId: req.params.bookingId })
      .populate('authorId', 'name')
      .sort({ createdAt: 1 });

    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/care-notes
// @desc    Add a new care note
// @access  Private (Caregiver only)
router.post('/', protect, upload.array('photos', 3), async (req, res) => {
  try {
    if (req.user.role !== 'Caregiver') {
      return res.status(403).json({ message: 'Only caregivers can add care notes' });
    }

    const { bookingId, text } = req.body;

    if (!text || text.length > 500) {
      return res.status(400).json({ message: 'Note text is required and must be under 500 characters' });
    }

    // Verify the booking belongs to this caregiver
    const caregiver = await Caregiver.findOne({ userId: req.user.id });
    const booking = await Booking.findById(bookingId);

    if (!booking || booking.caregiverId.toString() !== caregiver._id.toString()) {
      return res.status(403).json({ message: 'Not authorized for this booking' });
    }

    const photos = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    const note = new CareNote({
      bookingId,
      authorId: req.user.id,
      text,
      photos
    });

    await note.save();

    // Populate author name before sending
    const populatedNote = await CareNote.findById(note._id).populate('authorId', 'name');

    // Emit real-time event
    try {
      const io = getIO();
      io.to(bookingId).emit('new_care_note', populatedNote);
    } catch (e) {
      console.log('Socket not available, skipping real-time emit');
    }

    // Create Notification for Family
    await createNotification({
      userId: booking.familyId,
      type: 'new_message',
      title: 'New Care Note',
      message: `${req.user.name} added a new care note for ${booking.serviceType}.`,
      link: `/tracking/${bookingId}`
    });

    res.status(201).json(populatedNote);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

export default router;
