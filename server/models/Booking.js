import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Patient'
  },
  caregiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Caregiver'
  },
  serviceType: {
    type: String,
    required: true
  },
  durationOption: {
    type: String,
    enum: ['Hourly', 'Daily', 'Weekly', 'Monthly'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
