import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Caregiver from '../models/Caregiver.js';
import User from '../models/User.js';

dotenv.config();

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const count = await Caregiver.countDocuments();
    const verifiedCount = await Caregiver.countDocuments({ verificationStatus: 'Verified' });
    const pendingCount = await Caregiver.countDocuments({ verificationStatus: 'Pending' });
    
    console.log('Total Caregivers:', count);
    console.log('Verified Caregivers:', verifiedCount);
    console.log('Pending Caregivers:', pendingCount);
    
    if (count > 0) {
      const caregivers = await Caregiver.find().limit(5).populate('userId', 'name');
      console.log('Sample Caregivers:', caregivers.map(c => ({ 
        name: c.userId?.name, 
        status: c.verificationStatus,
        title: c.professionalTitle
      })));
    }
    
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

checkData();
