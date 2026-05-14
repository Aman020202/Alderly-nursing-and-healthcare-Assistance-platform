import mongoose from 'mongoose';

const conditionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  colorCode: { type: String, default: 'bg-blue-100 text-blue-800' },
  isConfidential: { type: Boolean, default: false }
});

const patientSchema = new mongoose.Schema({
  familyUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: [true, 'Please provide patient name']
  },
  age: {
    type: Number,
    required: [true, 'Please provide patient age']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  medicalConditions: [conditionSchema],
  medications: [{ type: String }],
  allergies: [{ type: String }],
  emergencyContact: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relation: { type: String, required: true }
  }
}, { timestamps: true });

export default mongoose.model('Patient', patientSchema);
