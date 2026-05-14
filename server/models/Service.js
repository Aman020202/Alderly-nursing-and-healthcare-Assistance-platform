import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  basePrice: {
    type: Number,
    required: true
  },
  requiredQualifications: [{
    type: String
  }],
  icon: {
    type: String,
    default: 'Activity'
  }
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
