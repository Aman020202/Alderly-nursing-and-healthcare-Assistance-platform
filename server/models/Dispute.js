import mongoose from 'mongoose';

const disputeSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Open', 'Under Review', 'Resolved', 'Dismissed'],
    default: 'Open'
  },
  adminNotes: {
    type: String,
    default: ''
  },
  resolution: {
    type: String,
    default: ''
  }
}, { timestamps: true });

export default mongoose.model('Dispute', disputeSchema);
