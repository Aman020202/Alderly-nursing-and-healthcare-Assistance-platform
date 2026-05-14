import express from 'express';
import User from '../../models/User.js';
import { protect } from '../../middleware/auth.js';
import { authorize } from '../../middleware/roleCheck.js';

const router = express.Router();
router.use(protect);
router.use(authorize('Admin'));

// @route   GET /api/admin/users
router.get('/', async (req, res) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role && role !== 'All') query.role = role;

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(query)
    ]);

    res.json({ users, total, totalPages: Math.ceil(total / Number(limit)), currentPage: Number(page) });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/admin/users/:id/suspend
router.put('/:id/suspend', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'Admin') return res.status(400).json({ message: 'Cannot suspend an admin' });

    user.isSuspended = !user.isSuspended;
    await user.save();

    res.json({ message: `User ${user.isSuspended ? 'suspended' : 'reactivated'}`, user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

export default router;
