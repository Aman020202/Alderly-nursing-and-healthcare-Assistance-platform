import mongoose from 'mongoose';

const careNoteSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 500
  },
  photos: [{
    type: String
  }]
}, { timestamps: true });

export default mongoose.model('CareNote', careNoteSchema);
