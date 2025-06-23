import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      email: process.env.ADMIN_EMAIL,
      role: 'admin' 
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'Administrator',
      email: process.env.ADMIN_EMAIL || 'admin@leadgenpro.com',
      password: process.env.ADMIN_PASSWORD || 'admin123456',
      role: 'admin',
      isActive: true,
      emailVerified: true
    });

    console.log('Admin user created successfully:');
    console.log('Email:', adminUser.email);
    console.log('Password:', process.env.ADMIN_PASSWORD || 'admin123456');

    // Create sample regular user
    const existingUser = await User.findOne({ email: 'user@leadgenpro.com' });
    
    if (!existingUser) {
      const sampleUser = await User.create({
        name: 'Sample User',
        email: 'user@leadgenpro.com',
        password: 'user123456',
        role: 'user',
        isActive: true,
        emailVerified: true
      });

      console.log('Sample user created:');
      console.log('Email:', sampleUser.email);
      console.log('Password: user123456');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
