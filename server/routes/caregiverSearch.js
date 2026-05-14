import express from 'express';
import Caregiver from '../models/Caregiver.js';

const router = express.Router();

// @route   GET /api/caregiver-search
// @desc    Search and filter verified caregivers
// @access  Public (or protected if only families can search)
router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      serviceType, 
      location, 
      minRating, 
      minPrice, 
      maxPrice,
      sort = 'rating_desc',
      page = 1,
      limit = 10
    } = req.query;

    // Only show verified caregivers
    let query = { verificationStatus: 'Verified' };

    // Search by name or title
    if (search) {
      // Since name is in the User model, we might need a separate lookup or regex
      // But for simplicity, we search by title here, and populate name
      query.$or = [
        { professionalTitle: { $regex: search, $options: 'i' } }
        // Note: searching across referenced collections in Mongoose without aggregate is tricky.
        // We will do a post-filter for name if search exists, or just filter title here.
      ];
    }

    if (serviceType) query.serviceTypes = serviceType;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (minRating) query.rating = { $gte: Number(minRating) };
    
    if (minPrice || maxPrice) {
      query.hourlyRate = {};
      if (minPrice) query.hourlyRate.$gte = Number(minPrice);
      if (maxPrice) query.hourlyRate.$lte = Number(maxPrice);
    }

    // Determine sorting
    let sortObj = {};
    switch (sort) {
      case 'price_asc': sortObj = { hourlyRate: 1 }; break;
      case 'price_desc': sortObj = { hourlyRate: -1 }; break;
      case 'exp_desc': sortObj = { experienceYears: -1 }; break;
      case 'rating_desc':
      default: sortObj = { rating: -1, reviewCount: -1 }; break;
    }

    const skip = (Number(page) - 1) * Number(limit);

    // Fetch and populate user
    let caregivers = await Caregiver.find(query)
      .populate('userId', 'name profilePicture') // Assumes user might have a picture later
      .sort(sortObj);

    // If there's a search term, we also manually filter by User name
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      caregivers = caregivers.filter(cg => 
        searchRegex.test(cg.userId.name) || searchRegex.test(cg.professionalTitle)
      );
    }

    // Manual Pagination after manual filtering
    const total = caregivers.length;
    const paginatedCaregivers = caregivers.slice(skip, skip + Number(limit));

    res.json({
      caregivers: paginatedCaregivers,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/caregiver-search/:id
// @desc    Get detailed public profile of a caregiver
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const caregiver = await Caregiver.findOne({ _id: req.params.id, verificationStatus: 'Verified' })
      .populate('userId', 'name email'); // Public profile only shows basic info

    if (!caregiver) {
      return res.status(404).json({ message: 'Verified caregiver profile not found' });
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

export default router;
