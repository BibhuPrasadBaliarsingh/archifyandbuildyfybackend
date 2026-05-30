// seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Client = require('./models/Client');
const Staff = require('./models/Staff');
const Lead = require('./models/Lead');

const admins = [
  {
    username: 'admin',
    password: 'abc',
    name: 'admin'
  }
];

const staffs = [
  {
    username: 'bruno',
    fullname: 'Bruno Den',
    password: 'password123',
    email: 'brunoden@mail.com',
    address: '26 Morris Street',
    designation: 'Cashier',
    gender: 'Male',
    contact: '852028120',
    status: 'Active'
  },
  {
    username: 'michelle',
    fullname: 'Michelle R. Lane',
    password: 'password123',
    email: 'michelle@mail.com',
    address: '61 Stone Lane',
    designation: 'Architect',
    gender: 'Female',
    contact: '2147483647',
    status: 'Active'
  },
  {
    username: 'james',
    fullname: 'James Brown',
    password: 'password123',
    email: 'jamesb@mail.com',
    address: '12 Deer Ridge Drive',
    designation: 'Landscape Architect',
    gender: 'Male',
    contact: '21474836',
    status: 'Active'
  }
];

const clients = [
  {
    fullname: 'PRAJUKTA',
    gender: 'Female',
    contact_number: '123456789',
    whatsapp_number: '234567',
    address: '68, Shaileshree Vihar',
    services: ['Interior Designing', 'House Loan'],
    email: 'prajukta@mail.com'
  },
  {
    fullname: 'Sriya',
    gender: 'Female',
    contact_number: '23456789',
    whatsapp_number: '1234567890',
    address: 'Berhampur, Odisha',
    services: ['Landscape Designing'],
    email: 'sriya@mail.com'
  }
];

const leads = [
  {
    lead_name: 'sriya',
    contact_number: '23456789',
    email_address: 'abc@gmail.com',
    lead_source: 'Social Media',
    project_type: 'Renovation',
    project_location: 'Bhubaneswar',
    project_budget: '23455',
    lead_status: 'Lost',
    lead_priority: 'Medium',
    lead_notes: 'Seeded lead record',
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding');

    await Promise.all([
      Admin.deleteMany(),
      Client.deleteMany(),
      Staff.deleteMany(),
      Lead.deleteMany(),
    ]);

    await Promise.all([
      Admin.create(admins),
      Client.create(clients),
      Staff.create(staffs),
      Lead.create(leads),
    ]);

    console.log('Seed completed:', {
      admins: admins.length,
      staffs: staffs.length,
      clients: clients.length,
      leads: leads.length,
    });
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

seed();
