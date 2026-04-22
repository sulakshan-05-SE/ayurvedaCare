import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/User.js';
import Service from './models/Service.js';
import Doctor from './models/Doctor.js';
import News from './models/News.js';
import Feedback from './models/Feedback.js';

dotenv.config();

connectDB();

const seedData = async () => {
  try {
    await User.deleteMany();
    await Service.deleteMany();
    await Doctor.deleteMany();
    await News.deleteMany();
    await Feedback.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    
    // Create Admin
    await User.create({
      name: 'Admin',
      email: 'admin@clinic.com',
      password: adminPassword,
      role: 'admin'
    });

    // Create Doctors
    const docPassword = await bcrypt.hash('doctor123', salt);
    
    const docUser1 = await User.create({
      name: 'Dr. Ayurveda Sharma',
      email: 'doctor@clinic.com',
      password: docPassword,
      role: 'doctor'
    });
    
    const docUser2 = await User.create({
      name: 'Dr. Anjali Patil',
      email: 'anjali@clinic.com',
      password: docPassword,
      role: 'doctor'
    });

    await Doctor.create([
      {
        userId: docUser1._id,
        specialization: 'Panchakarma Specialist',
        experience: 15,
        consultationFee: 500,
        about: 'Expert in detoxification and classical Ayurvedic cleansing.',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=60' // generic doctor
      },
      {
        userId: docUser2._id,
        specialization: 'Herbal Medicine',
        experience: 8,
        consultationFee: 400,
        about: 'Specializes in creating custom herbal formulations.',
        image: 'https://images.unsplash.com/photo-1594824432258-20d0f28243fc?w=500&auto=format&fit=crop&q=60'
      }
    ]);

    // Create Services
    await Service.create([
      { 
        title: 'Panchakarma Detox', 
        description: 'Complete holistic detox and cleansing program.', 
        price: 5000, 
        duration: '2 Hours',
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500&auto=format&fit=crop&q=60' // Massage therapy
      },
      { 
        title: 'Abhyanga Body Massage', 
        description: 'A warm oil healing massage to improve circulation.', 
        price: 2000, 
        duration: '1 Hour',
        image: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=500&auto=format&fit=crop&q=60' // Spa herbs
      },
      { 
        title: 'Shirodhara Therapy', 
        description: 'Pouring of warm herbal oil on the forehead for relaxation.', 
        price: 2500, 
        duration: '45 Mins',
        image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&auto=format&fit=crop&q=60' // Spa
      }
    ]);

    // Create News
    await News.create([
      {
        title: 'Clinic Awarded Best Ayurveda Spa',
        content: 'We are thrilled to announce we won the national health care award for holistic practices out in our main branch!',
        type: 'news'
      },
      {
        title: 'Daily Turmeric Tip',
        content: 'Did you know? Adding a pinch of black pepper to your turmeric tea enhances circumen absorption by 2000%.',
        type: 'tip'
      }
    ]);

    // Create Dummy User & Feedback
    const dummyUser = await User.create({
      name: 'Sarah Connor',
      email: 'sarah@test.com',
      password: docPassword,
      role: 'user'
    });

    await Feedback.create([
      { user: dummyUser._id, message: 'Absolutely life changing. My joint pain has reduced significantly after the Panchakarma sessions!', rating: 5 },
      { user: dummyUser._id, message: 'The Shirodhara therapy cleared my migraines. Definitely worth it.', rating: 5 }
    ]);

    console.log('Database Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
