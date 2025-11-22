import dotenv from 'dotenv';
import connectDb from '../app/config/db.js';
import User from '../app/models/userModel.js';
import { hashPassword } from '../app/utils/auth.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    console.log('🌱 Starting admin seeder...');
    
    await connectDb();
    console.log('✅ Connected to database');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:');
      console.log('   Email:', existingAdmin.email);
      console.log('   Username:', existingAdmin.username);
      console.log('\n💡 If you want to create a new admin, delete the existing one first.');
      process.exit(0);
    }

    // Create admin user
    const adminData = {
      firstName: 'Admin',
      lastName: 'Bayanika',
      email: 'admin@bayanika.com',
      username: 'admin',
      password: await hashPassword('admin123'),
      role: 'admin',
      bayanihanPoints: 10000,
      xp: 5000,
      level: 10,
    };

    const admin = await User.create(adminData);

    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    admin@bayanika.com');
    console.log('👤 Username: admin');
    console.log('🔑 Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();

