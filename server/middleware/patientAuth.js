import Patient from '../models/Patient.js';

export const checkPatientOwnership = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check if the current user is the owner or an admin
    if (patient.familyUserId.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'User not authorized to access this patient profile' });
    }

    // Pass patient object to next middleware/route handler to avoid redundant DB queries
    req.patient = patient;
    next();
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(500).send('Server Error');
  }
};
