require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const admins = await Admin.find().lean();
    console.log('Admins:');
    admins.forEach(a => {
      console.log(`- username: ${a.username}, id: ${a._id}, passwordHash: ${a.password}`);
    });
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
