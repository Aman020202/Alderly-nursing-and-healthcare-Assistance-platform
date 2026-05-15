import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Caregiver from '../models/Caregiver.js';
import User from '../models/User.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // 1. Verify all existing caregivers
    const updated = await Caregiver.updateMany(
      { verificationStatus: 'Pending' },
      { verificationStatus: 'Verified' }
    );
    console.log(`Verified ${updated.modifiedCount} existing pending caregivers.`);

    // 2. Add some sample caregivers if needed
    const count = await Caregiver.countDocuments();
    if (count < 3) {
      console.log('Adding sample caregivers...');
      
      const sampleData = [
        {
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          title: 'Registered Nurse',
          exp: 8,
          rate: 35,
          loc: 'London'
        },
        {
          name: 'Michael Chen',
          email: 'michael@example.com',
          title: 'Physical Therapist',
          exp: 5,
          rate: 45,
          loc: 'Manchester'
        }
      ];

      for (const data of sampleData) {
        // Create User
        let user = await User.findOne({ email: data.email });
        if (!user) {
          user = new User({
            name: data.name,
            email: data.email,
            password: 'password123',
            role: 'Caregiver'
          });
          await user.save();
        }

        // Create Caregiver Profile
        const exists = await Caregiver.findOne({ userId: user._id });
        if (!exists) {
          const caregiver = new Caregiver({
            userId: user._id,
            professionalTitle: data.title,
            experienceYears: data.exp,
            bio: `Experienced ${data.title} dedicated to providing high-quality care for elderly patients.`,
            qualifications: ['First Aid Certified', 'BLS'],
            serviceTypes: ['Post-Op Care', 'Mobility Support'],
            hourlyRate: data.rate,
            location: data.loc,
            verificationStatus: 'Verified',
            documents: {
              idProof: '/uploads/sample-id.png',
              degreeCertificate: '/uploads/sample-degree.png'
            }
          });
          await caregiver.save();
        }
      }
      console.log('Sample data added.');
    }

    await mongoose.disconnect();
    console.log('Database sync complete.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
