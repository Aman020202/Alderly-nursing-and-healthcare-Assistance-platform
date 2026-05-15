import express from 'express';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import Patient from '../models/Patient.js';
import { protect } from '../middleware/auth.js';
import { checkPatientOwnership } from '../middleware/patientAuth.js';

const router = express.Router();

// Multer config for image upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5000000 }, // 5MB max
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  }
});

// Middleware to parse JSON strings from form-data
const parseJsonFields = (req, res, next) => {
  const fields = ['medicalConditions', 'medications', 'allergies', 'emergencyContact'];
  fields.forEach(field => {
    if (req.body[field] && typeof req.body[field] === 'string') {
      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch (err) {
        console.error(`Error parsing field ${field}:`, err);
      }
    }
  });
  next();
};

// @route   GET /api/patients
// @desc    Get all patients for the logged-in family user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let patients;
    if (req.user.role === 'Admin') {
      // Admin sees all
      patients = await Patient.find().sort({ createdAt: -1 });
    } else {
      patients = await Patient.find({ familyUserId: req.user.id }).sort({ createdAt: -1 });
    }
    res.json(patients);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/patients/:id
// @desc    Get single patient
// @access  Private
router.get('/:id', protect, checkPatientOwnership, async (req, res) => {
  res.json(req.patient);
});

// @route   POST /api/patients
// @desc    Create a patient profile
// @access  Private (Family/Admin)
router.post(
  '/',
  protect,
  upload.single('profilePicture'),
  parseJsonFields,
  [
    body('name', 'Name is required').not().isEmpty(),
    body('age', 'Valid age is required').isNumeric(),
    body('gender', 'Gender is required').isIn(['Male', 'Female', 'Other']),
    body('emergencyContact.name', 'Emergency contact name is required').not().isEmpty(),
    body('emergencyContact.phone', 'Emergency contact phone is required').not().isEmpty(),
    body('emergencyContact.relation', 'Emergency contact relation is required').not().isEmpty(),
  ],
  async (req, res) => {
    // Only Family or Admin can create
    if (req.user.role !== 'Elderly/Family' && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to create patient profiles' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const patientData = {
        ...req.body,
        familyUserId: req.user.id,
      };

      if (req.file) {
        patientData.profilePicture = `/uploads/${req.file.filename}`;
      }

      const newPatient = new Patient(patientData);
      const patient = await newPatient.save();
      res.status(201).json(patient);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT /api/patients/:id
// @desc    Update patient profile
// @access  Private
router.put(
  '/:id',
  protect,
  checkPatientOwnership,
  upload.single('profilePicture'),
  parseJsonFields,
  async (req, res) => {
    try {
      let updateData = { ...req.body };

      if (req.file) {
        updateData.profilePicture = `/uploads/${req.file.filename}`;
      }

      const patient = await Patient.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true }
      );

      res.json(patient);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE /api/patients/:id
// @desc    Delete patient profile
// @access  Private
router.delete('/:id', protect, checkPatientOwnership, async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: 'Patient profile removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

export default router;
