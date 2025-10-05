import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/3d-models';

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
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test user data
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123', // Will be hashed
    };

    // Check if user already exists
    const existingUser = await User.findOne({ email: testUser.email });
    
    if (existingUser) {
      console.log('⚠️  User already exists with email:', testUser.email);
      console.log('📧 Email:', testUser.email);
      console.log('🔑 Password: password123');
      await mongoose.disconnect();
      return;
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
