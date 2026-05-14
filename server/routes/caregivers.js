import express from 'express';
import multer from 'multer';
import path from 'path';
import { body, validationResult } from 'express-validator';
import Caregiver from '../models/Caregiver.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Multer config for document upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, `cg-${req.user.id}-${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10000000 }, // 10MB max for docs/pdfs
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images and PDFs Only!');
    }
  }
});

// @route   GET /api/caregivers/me
// @desc    Get current caregiver profile
// @access  Private (Caregiver)
router.get('/me', protect, async (req, res) => {
  try {
    if (req.user.role !== 'Caregiver') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const profile = await Caregiver.findOne({ userId: req.user.id }).populate('userId', 'name email phone');
    if (!profile) {
      return res.status(404).json({ message: 'Caregiver profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/caregivers
// @desc    Create or update caregiver profile
// @access  Private (Caregiver)
router.post(
  '/',
  protect,
  upload.fields([
    { name: 'idProof', maxCount: 1 },
    { name: 'degreeCertificate', maxCount: 1 },
    { name: 'experienceCertificate', maxCount: 1 }
  ]),
  [
    body('professionalTitle', 'Professional title is required').not().isEmpty(),
    body('experienceYears', 'Valid experience years required').isNumeric(),
    body('bio', 'Bio is required').not().isEmpty()
  ],
  async (req, res) => {
    if (req.user.role !== 'Caregiver') {
      return res.status(403).json({ message: 'Only users with Caregiver role can create this profile' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let caregiver = await Caregiver.findOne({ userId: req.user.id });
      
      const updateData = {
        userId: req.user.id,
        professionalTitle: req.body.professionalTitle,
        experienceYears: req.body.experienceYears,
        bio: req.body.bio,
        hourlyRate: req.body.hourlyRate,
        location: req.body.location,
        qualifications: req.body.qualifications ? JSON.parse(req.body.qualifications) : [],
        serviceTypes: req.body.serviceTypes ? JSON.parse(req.body.serviceTypes) : [],
        // Reset verification status if they update their profile
        verificationStatus: 'Pending',
        verificationNotes: ''
      };

      // Handle documents
      const docs = caregiver ? { ...caregiver.documents } : {};
      
      if (req.files) {
        if (req.files.idProof) {
          docs.idProof = `/uploads/${req.files.idProof[0].filename}`;
        }
        if (req.files.degreeCertificate) {
          docs.degreeCertificate = `/uploads/${req.files.degreeCertificate[0].filename}`;
        }
        if (req.files.experienceCertificate) {
          docs.experienceCertificate = `/uploads/${req.files.experienceCertificate[0].filename}`;
        }
      }

      if (!caregiver && (!docs.idProof || !docs.degreeCertificate)) {
         return res.status(400).json({ message: 'ID Proof and Degree Certificate are required for initial registration' });
      }

      updateData.documents = docs;

      if (caregiver) {
        // Update
        caregiver = await Caregiver.findOneAndUpdate(
          { userId: req.user.id },
          { $set: updateData },
          { new: true }
        );
      } else {
        // Create
        caregiver = new Caregiver(updateData);
        await caregiver.save();
      }

      res.json(caregiver);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

export default router;
