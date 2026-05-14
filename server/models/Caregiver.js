import mongoose from 'mongoose';

const caregiverSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true // One user can only have one caregiver profile
  },
  professionalTitle: {
    type: String,
    required: [true, 'Please provide a professional title (e.g., Registered Nurse)']
  },
  experienceYears: {
    type: Number,
    required: [true, 'Please provide years of experience']
  },
  bio: {
    type: String,
    required: [true, 'Please provide a brief biography or summary of experience']
  },
  qualifications: [{
    type: String
  }],
  serviceTypes: [{
    type: String
  }],
  hourlyRate: {
    type: Number,
    required: [true, 'Please provide an hourly rate']
  },
  location: {
    type: String,
    required: [true, 'Please provide your primary location/city']
  },
  rating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  documents: {
    idProof: { type: String, required: true },
    degreeCertificate: { type: String, required: true },
    experienceCertificate: { type: String }
  },
  verificationStatus: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending'
  },
  verificationNotes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

export default mongoose.model('Caregiver', caregiverSchema);
