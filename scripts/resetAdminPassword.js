require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

async function reset() {
  await mongoose.connect(process.env.MONGO_URI);
  const admin = await Admin.findOne({ username: 'admin' });
  if (!admin) {
    console.log('No admin found');
    process.exit(1);
  }
  admin.password = 'admin123';
  await admin.save();
  console.log('Admin password reset to: admin / admin123');
  process.exit(0);
}

reset().catch(err => { console.error(err); process.exit(1); });
