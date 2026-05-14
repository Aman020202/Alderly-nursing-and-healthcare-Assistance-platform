import express from 'express';
import Service from '../models/Service.js';

const router = express.Router();

// Initial seed data
const seedServices = [
  {
    name: 'Nursing Care',
    description: 'Professional medical care provided by registered nurses, including wound dressing, vital signs monitoring, and IV administration.',
    basePrice: 50,
    requiredQualifications: ['Registered Nurse (RN)', 'BSN'],
    icon: 'Stethoscope'
  },
  {
    name: 'Elderly Attendant',
    description: 'Non-medical assistance for daily living activities including bathing, grooming, meal preparation, and companionship.',
    basePrice: 25,
    requiredQualifications: ['Home Health Aide (HHA)', 'CPR Certified'],
    icon: 'UserHeart'
  },
  {
    name: 'Physiotherapy',
    description: 'In-home physical therapy to improve mobility, relieve pain, and prevent or limit permanent physical disabilities.',
    basePrice: 80,
    requiredQualifications: ['Licensed Physical Therapist'],
    icon: 'Activity'
  },
  {
    name: 'Post-Hospital Care',
    description: 'Comprehensive care bridging the transition from hospital to home, ensuring recovery protocols are strictly followed.',
    basePrice: 60,
    requiredQualifications: ['LPN', 'RN'],
    icon: 'HomeHeart'
  }
];

// @route   GET /api/services
// @desc    Get all services (and seed if empty)
// @access  Public
router.get('/', async (req, res) => {
  try {
    let services = await Service.find();
    
    // Seed database if empty
    if (services.length === 0) {
      await Service.insertMany(seedServices);
      services = await Service.find();
    }
    
    res.json(services);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/services
// @desc    Create a new service (Admin)
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { name, description, basePrice, requiredQualifications, icon } = req.body;
    const service = new Service({ name, description, basePrice, requiredQualifications: requiredQualifications || [], icon: icon || 'Activity' });
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/services/:id
// @desc    Update a service (Admin)
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

export default router;
