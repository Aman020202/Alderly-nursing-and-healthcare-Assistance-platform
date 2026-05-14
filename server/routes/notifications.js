import express from 'express';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';
import { getIO } from '../sockets/tracking.js';
import { sendEmail } from '../services/emailService.js';
import { sendPushNotification } from '../services/pushService.js';

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get notifications for logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [notifications, unreadCount, total] = await Promise.all([
      Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Notification.countDocuments({ userId: req.user.id, isRead: false }),
      Notification.countDocuments({ userId: req.user.id })
    ]);

    res.json({ notifications, unreadCount, total, totalPages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/notifications/unread-count
// @desc    Get unread count only (lightweight)
// @access  Private
router.get('/unread-count', protect, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ userId: req.user.id, isRead: false });
    res.json({ count });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark a single notification as read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isRead: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Not found' });

    // Emit updated unread count
    try {
      const io = getIO();
      const count = await Notification.countDocuments({ userId: req.user.id, isRead: false });
      io.to(`user_${req.user.id}`).emit('unread_count', count);
    } catch (e) {}

    res.json(notification);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/notifications/mark-all-read
// @desc    Mark all notifications as read
// @access  Private
router.put('/mark-all-read', protect, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id, isRead: false }, { isRead: true });

    try {
      const io = getIO();
      io.to(`user_${req.user.id}`).emit('unread_count', 0);
    } catch (e) {}

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete a notification
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// ---- Helper: Create and emit a notification ----
export const createNotification = async ({ userId, type, title, message, link, metadata, sendEmailNotif = false, emailTo, emailTemplate, emailData }) => {
  try {
    const notification = new Notification({ userId, type, title, message, link, metadata });
    await notification.save();

    // Real-time via Socket.io
    try {
      const io = getIO();
      io.to(`user_${userId}`).emit('new_notification', notification);
      const count = await Notification.countDocuments({ userId, isRead: false });
      io.to(`user_${userId}`).emit('unread_count', count);
    } catch (e) {}

    // Email
    if (sendEmailNotif && emailTo && emailTemplate) {
      await sendEmail(emailTo, emailTemplate, emailData || {});
    }

    // Push
    await sendPushNotification(userId, { title, body: message, link });

    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error.message);
  }
};

export default router;
