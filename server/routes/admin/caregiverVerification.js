import express from 'express';
import Caregiver from '../../models/Caregiver.js';
import { protect } from '../../middleware/auth.js';
import { authorize } from '../../middleware/roleCheck.js';

const router = express.Router();

// All routes in this file require Admin role
router.use(protect);
router.use(authorize('Admin'));

// @route   GET /api/admin/caregivers
// @desc    Get all caregivers with optional status filter
// @access  Private (Admin)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    
    if (status && status !== 'All') {
      query.verificationStatus = status;
    }

    const caregivers = await Caregiver.find(query)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });
      
    res.json(caregivers);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/caregivers/:id
// @desc    Get specific caregiver details
// @access  Private (Admin)
router.get('/:id', async (req, res) => {
  try {
    const caregiver = await Caregiver.findById(req.params.id)
      .populate('userId', 'name email phone createdAt');
      
    if (!caregiver) {
      return res.status(404).json({ message: 'Caregiver profile not found' });
    }

    res.json(caregiver);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Caregiver profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/admin/caregivers/:id/verify
// @desc    Update verification status
// @access  Private (Admin)
router.put('/:id/verify', async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    if (!['Pending', 'Verified', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const caregiver = await Caregiver.findById(req.params.id);
    
    if (!caregiver) {
      return res.status(404).json({ message: 'Caregiver profile not found' });
    }

    caregiver.verificationStatus = status;
    if (notes !== undefined) {
      caregiver.verificationNotes = notes;
    }

    await caregiver.save();
    
    res.json(caregiver);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/stats
// @desc    Get dashboard stats
// @access  Private (Admin)
router.get('/dashboard/stats', async (req, res) => {
  try {
    const pendingCount = await Caregiver.countDocuments({ verificationStatus: 'Pending' });
    const verifiedCount = await Caregiver.countDocuments({ verificationStatus: 'Verified' });
    const rejectedCount = await Caregiver.countDocuments({ verificationStatus: 'Rejected' });
    const totalCount = await Caregiver.countDocuments();
    
    res.json({
      pending: pendingCount,
      verified: verifiedCount,
      rejected: rejectedCount,
      total: totalCount
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

export default router;
