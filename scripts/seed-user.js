const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI is not defined in .env.local');
  console.error('Please make sure .env.local file exists with your MongoDB Atlas connection string');
  process.exit(1);
}

// User Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seedUser() {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    console.log('📍 Database:', MONGODB_URI.split('@')[1]?.split('?')[0] || 'Unknown');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Test user data
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123', // Will be hashed
    };

    // Check if user already exists
    const existingUser = await User.findOne({ email: testUser.email });
    
    if (existingUser) {
      console.log('⚠️  User already exists. Deleting old user...');
      await User.deleteOne({ email: testUser.email });
      console.log('�️  Old user deleted');
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(testUser.password, 10);

    // Create user
    console.log('👤 Creating user...');
    const user = await User.create({
      name: testUser.name,
      email: testUser.email,
      password: hashedPassword,
    });

    console.log('');
    console.log('✅ User created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', user.email);
    console.log('👤 Name:', user.name);
    console.log('🔑 Password: password123');
    console.log('🆔 User ID:', user._id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('You can now login with these credentials at:');
    console.log('http://localhost:3000/login');

    await mongoose.disconnect();
    console.log('');
    console.log('🔌 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error seeding user:', error);
    process.exit(1);
  }
}

// Run the seed function
seedUser();
