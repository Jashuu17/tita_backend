require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  // Delete existing users
  await User.deleteMany({});

  // Create fresh users
  const users = [
    { username: 'admin', password: 'admin123', role: 'Admin' },
    { username: 'faculty1', password: 'faculty123', role: 'Faculty' }
  ];

  for (let u of users) {
    const user = new User(u);
    await user.save();
  }

  console.log('Admin and Faculty users created with proper hashed passwords.');
  process.exit();
});