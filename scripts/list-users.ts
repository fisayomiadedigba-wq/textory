import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env file manually
const envPath = resolve('.env');
const envContent = readFileSync(envPath, 'utf-8');
const envVars: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const MONGODB_URI = envVars.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set in .env');
  process.exit(1);
}

async function listUsers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      dbName: envVars.MONGODB_DB || 'story_platform',
    });
    console.log('Connected successfully\n');

    // Define User schema inline for this script
    const UserSchema = new mongoose.Schema({
      username: String,
      email: String,
      displayName: String,
      role: String,
      emailVerifiedAt: Date,
      createdAt: Date,
    });

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    const users = await User.find({}, { email: 1, username: 1, displayName: 1, emailVerifiedAt: 1, createdAt: 1 })
      .sort({ createdAt: -1 });

    console.log(`Total users: ${users.length}\n`);
    console.log('Email addresses:');
    console.log('================');
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Display Name: ${user.displayName}`);
      console.log(`   Email Verified: ${user.emailVerifiedAt ? 'Yes' : 'No'}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log('');
    });

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

listUsers();
