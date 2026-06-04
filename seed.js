const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const Admin = require('./models/Admin');
const Announcement = require('./models/Announcement');
const Attendance = require('./models/Attendance');
const Client = require('./models/Client');
const Equipment = require('./models/Equipment');
const Invoice = require('./models/Invoice');
const Lead = require('./models/Lead');
const Member = require('./models/Member');
const Project = require('./models/Project');
const Quotation = require('./models/Quotation');
const Rate = require('./models/Rate');
const Receipt = require('./models/Receipt');
const Reminder = require('./models/Reminder');
const Staff = require('./models/Staff');
const Department = require('./models/Department');
const Employee = require('./models/Employee');
const Location = require('./models/Location');
const Shift = require('./models/Shift');
const Todo = require('./models/Todo');

const parseDate = (value) => {
  if (!value || value === '0000-00-00') return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const parseSlashDate = (value) => {
  if (!value || value === '0000-00-00') return null;
  const [day, month, year] = value.split('/').map((v) => Number(v));
  if (!day || !month || !year) return null;
  return new Date(Date.UTC(year, month - 1, day));
};

const parseDateTime = (dateText, timeText) => {
  if (!dateText || !timeText || dateText === '0000-00-00') return null;
  const datePart = dateText.trim();
  const timePart = timeText.trim();
  if (!datePart || !timePart) return null;
  const combined = `${datePart}T${timePart}`;
  const parsed = new Date(combined);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const normalizeString = (value) => {
  if (value === undefined || value === null) return undefined;
  return String(value).trim();
};

const normalizeGender = (value) => {
  if (!value) return undefined;
  const normalized = String(value).trim().toLowerCase();
  if (normalized === 'male') return 'Male';
  if (normalized === 'female') return 'Female';
  if (normalized === 'other') return 'Other';
  return String(value).trim();
};

const splitComma = (value) => {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const hashPassword = async (password) => {
  return await bcrypt.hash(String(password), 10);
};

const announcements = [
  { message: 'Hello Demo', date: parseDate('2025-02-13') },
];

const admins = [
  { username: 'admin', password: 'abc', name: 'admin' },
];

const clients = [
  {
    fullname: 'PRAJUKTA',
    gender: 'Female',
    dor: parseDate('2025-03-18'),
    contact_number: '123456789',
    whatsapp_number: '234567',
    address: '68,Shaileshree vihar',
    quotation: 'uploads/1741067389_receipt.pdf',
    services: splitComma('Interior Designing, House Loan'),
    status: 'Active',
  },
  {
    fullname: 'Sriya',
    gender: 'Female',
    dor: parseDate('2025-03-18'),
    contact_number: '23456789',
    whatsapp_number: '1234567890',
    address: 'Berhampur,Odisha',
    quotation: 'uploads/1741083184_receipt.pdf',
    services: splitComma('Landscape Designing'),
    status: 'Active',
  },
  {
    fullname: 'prajukta mahakud',
    gender: 'Female',
    dor: parseDate('2025-03-18'),
    contact_number: '07008049087',
    whatsapp_number: '1234567890',
    address: 'Nayapalii',
    quotation: 'uploads/1741090851_receipt.pdf',
    services: splitComma('House Plan as per Vaastu, 3D Visualization, Construction'),
    status: 'Active',
  },
];

const equipment = [
  { name: 'Treadmill', amount: 909, quantity: 4, vendor: 'DnS', description: 'Edited Description', address: '7 Cedarstone Drive', contact: '8521479633', date: parseDate('2019-03-07') },
  { name: 'Vertical Press Machine', amount: 949, quantity: 3, vendor: 'SS Industries', description: 'For Biceps And Triceps, Upper Back, Chest', address: '7 Cedarstone Drive', contact: '1245558980', date: parseDate('2020-03-19') },
  { name: 'Dumbell - Adjustable', amount: 102, quantity: 26, vendor: 'Uptown Suppliers', description: 'Material: Steel, Rubber Plastic, Concrete', address: '7 Cedarstone Drive', contact: '9875552100', date: parseDate('2020-03-29') },
  { name: 'Multi Bench Press Machine', amount: 219, quantity: 2, vendor: 'DnS Suppliers', description: '6 In 1 Multi Bench With Incline, Flat, Decline Ben', address: '7 Cedarstone Drive', contact: '7410001010', date: parseDate('2020-04-05') },
  { name: 'Demo', amount: 265, quantity: 5, vendor: 'Demo', description: 'This is a demo test.', address: '77 Demo Lane', contact: '8524445452', date: parseDate('2020-04-03') },
  { name: 'RowWarrior Fitness Rowing Mach', amount: 5616, quantity: 12, vendor: 'Roww Stores', description: 'HIGHEST QUALITY: This best of class air rowing mac', address: '52 Weekley Street', contact: '7412585555', date: parseDate('2021-06-12') },
];

const invoices = [
  { originalId: 8, address: 'Raj Nivas,G.A. 432,B1,Second floor,near DAV School,Kalinga Nagar,Bhubaneswar,Odisha 751003', invoice_number: 'INV-2025-1001', client_name: 'sriya', client_address: 'berhampur', client_contact: '345678', invoice_date: parseDate('2025-02-14'), description: 'hello', area: 678.0, unit_price: 67.0, discount: 3, gst: 3, grand_total: 45426.0 },
  { originalId: 12, address: '', invoice_number: 'INV-2025-1002', client_name: 'abc', client_address: 'berhampur', client_contact: '345678', invoice_date: parseDate('2025-02-17'), description: 'dumbble', area: 678.0, unit_price: 67.0, discount: 5, gst: 6, grand_total: 45743.98 },
  { originalId: 13, address: '', invoice_number: 'INV-2025-1003', client_name: 'abc', client_address: 'berhampur', client_contact: '345678', invoice_date: parseDate('2025-02-17'), description: 'dumbble', area: 678.0, unit_price: 67.0, discount: 5, gst: 6, grand_total: 45743.98 },
  { originalId: 16, address: '', invoice_number: 'ABC-2025-1004', client_name: 'abc', client_address: 'berhampur', client_contact: '345678', invoice_date: parseDate('2025-02-17'), description: 'dumbble', area: 678.0, unit_price: 67.0, discount: 5, gst: 6, grand_total: 45426.0 },
  { originalId: 17, address: '', invoice_number: 'ABC-2025-1005', client_name: 'abc', client_address: 'berhampur', client_contact: '345678', invoice_date: parseDate('2025-02-17'), description: 'dumbble', area: 678.0, unit_price: 67.0, discount: 5, gst: 6, grand_total: 45426.0 },
  { originalId: 18, address: '', invoice_number: 'ABC-2025-1006', client_name: 'abc', client_address: 'berhampur', client_contact: '345678', invoice_date: parseDate('2025-02-17'), description: 'dumbble', area: 678.0, unit_price: 67.0, discount: 5, gst: 6, grand_total: 45426.0 },
  { originalId: 19, address: '', invoice_number: 'ABC-2025-1007', client_name: 'abc', client_address: 'berhampur', client_contact: '345678', invoice_date: parseDate('2025-02-17'), description: 'dumbble', area: 678.0, unit_price: 67.0, discount: 5, gst: 6, grand_total: 45426.0 },
  { originalId: 20, address: '', invoice_number: 'ABC-2025-1008', client_name: 'abc', client_address: 'berhampur', client_contact: '345678', invoice_date: parseDate('2025-02-11'), description: 'hello', area: 678.0, unit_price: 67.0, discount: 3, gst: 3, grand_total: 45426.0 },
  { originalId: 21, address: '', invoice_number: 'ABC-2025-1009', client_name: 'abc', client_address: 'bbsr', client_contact: '345678', invoice_date: parseDate('2025-02-11'), description: 'dumbble', area: 678.0, unit_price: 67.0, discount: 5, gst: 5, grand_total: 45426.0 },
  { originalId: 22, address: '', invoice_number: 'ABC-2025-1010', client_name: 'prajukta mahakud', client_address: 'unit 4', client_contact: '123456789', invoice_date: parseDate('2020-02-13'), description: 'interior', area: 1223.0, unit_price: 12.0, discount: 5, gst: 5, grand_total: 14676.0 },
  { originalId: 23, address: '', invoice_number: 'ABC-2025-1011', client_name: 'abc', client_address: 'gthyjkl', client_contact: '345678', invoice_date: parseDate('2025-02-20'), description: 'dumbble', area: 678.0, unit_price: 67.0, discount: 23, gst: 2, grand_total: 45426.0 },
  { originalId: 24, address: '', invoice_number: 'ABC-2025-1012', client_name: 'abc', client_address: 'gthyjkl', client_contact: '345678', invoice_date: parseDate('2025-02-20'), description: 'dumbble', area: 678.0, unit_price: 67.0, discount: 23, gst: 2, grand_total: 45426.0 },
  { originalId: 25, address: '', invoice_number: 'ABC-2025-1013', client_name: 'abc', client_address: 'ghjk', client_contact: '345678', invoice_date: parseDate('2025-02-21'), description: 'dumbble', area: 678.0, unit_price: 67.0, discount: 23, gst: 3, grand_total: 45426.0 },
  { originalId: 26, address: '', invoice_number: 'ABC-2025-1014', client_name: 'sriya', client_address: 'bbsr', client_contact: '345678', invoice_date: parseDate('2025-03-11'), description: 'dumbble', area: 678.0, unit_price: 67.0, discount: 3, gst: 3, grand_total: 45426.0 },
  { originalId: 27, address: '', invoice_number: 'ABC-2025-1015', client_name: 'prajukta mahakud', client_address: 'Nayapalii', client_contact: '2147483647', invoice_date: parseDate('2025-03-07'), description: 'abc', area: 123.0, unit_price: 5.0, discount: 3, gst: 5, grand_total: 615.0 },
];

const leads = [
  {
    originalId: 20,
    lead_name: 'sriya',
    contact_number: '23456789',
    email_address: 'abc@gmail.com',
    lead_source: 'Social Media',
    project_type: 'Renovation',
    project_location: 'bhubaneswar',
    project_budget: 23455.0,
    lead_status: 'Follow-up Required',
    lead_priority: 'Medium',
    lead_notes: '234567',
    follow_ups: [
      { date: parseDate('2025-02-07'), assigned_to: 'asdfghj', note: 'fvghjk' },
      { date: parseDate('2025-02-06'), assigned_to: 'cfvgbhnm', note: 'vfgbhnjm' },
      { date: null, assigned_to: '', note: '' },
      { date: null, assigned_to: '', note: '' },
      { date: null, assigned_to: '', note: '' },
    ],
    lead_conversion: 'Lost',
    reason_for_loss: 'cfvgbhnjmk',
  },
  {
    originalId: 21,
    lead_name: 'abc',
    contact_number: '123456789',
    email_address: 'abc12@gmail.com',
    lead_source: 'Referral',
    project_type: 'Interior Design',
    project_location: 'bhubaneswar',
    project_budget: 123456.0,
    lead_status: 'Follow-up Required',
    lead_priority: 'High',
    lead_notes: 'abc',
    follow_ups: [
      { date: parseDate('2025-03-11'), assigned_to: 'abc', note: 'done' },
      { date: parseDate('2025-03-17'), assigned_to: 'abc', note: 'done' },
      { date: null, assigned_to: '', note: '' },
      { date: null, assigned_to: '', note: '' },
      { date: null, assigned_to: '', note: '' },
    ],
    lead_conversion: 'Converted',
    reason_for_loss: 'done',
  },
  {
    originalId: 22,
    lead_name: 'sriya',
    contact_number: '1234567890',
    email_address: 'abc@gmail.com',
    lead_source: 'Other',
    project_type: 'Commercial',
    project_location: 'bhubaneswar',
    project_budget: 23455.0,
    lead_status: 'Follow-up Required',
    lead_priority: 'Low',
    lead_notes: 'xsdcfvgbhnjmk',
    follow_ups: [
      { date: parseDate('2025-03-26'), assigned_to: 'asdfghj', note: 'dcfvgbhnjmk' },
      { date: null, assigned_to: '', note: '' },
      { date: null, assigned_to: '', note: '' },
      { date: null, assigned_to: '', note: '' },
      { date: null, assigned_to: '', note: '' },
    ],
    lead_conversion: 'Converted',
    reason_for_loss: 'done',
  },
  {
    originalId: 23,
    lead_name: 'sriya',
    contact_number: '1234567890',
    email_address: 'abc@gmail.com',
    lead_source: 'Other',
    project_type: 'Interior Design',
    project_location: 'bhubaneswar',
    project_budget: 23455.0,
    lead_status: 'Follow-up Required',
    lead_priority: 'Low',
    lead_notes: 'ddd',
    follow_ups: [
      { date: parseDate('2025-03-10'), assigned_to: '', note: 'dvb' },
      { date: null, assigned_to: '', note: '' },
      { date: null, assigned_to: '', note: '' },
      { date: null, assigned_to: '', note: '' },
      { date: null, assigned_to: '', note: '' },
    ],
    lead_conversion: 'Converted',
    reason_for_loss: 'done',
  },
  {
    originalId: 24,
    lead_name: 'sriya',
    contact_number: '123456',
    email_address: 'abc@gmail.com',
    lead_source: 'Other',
    project_type: 'Other',
    project_location: 'bhubaneswar',
    project_budget: 23455.0,
    lead_status: 'Proposal Sent',
    lead_priority: 'Low',
    lead_notes: 'dfghj',
    follow_ups: [
      { date: parseDate('2025-03-28'), assigned_to: '', note: 'vfghjmk' },
      { date: null, assigned_to: '', note: '' },
      { date: null, assigned_to: '', note: '' },
      { date: null, assigned_to: '', note: '' },
      { date: null, assigned_to: '', note: '' },
    ],
    lead_conversion: 'Converted',
    reason_for_loss: 'bghjk',
  },
  {
    originalId: 25,
    lead_name: 'sriya',
    contact_number: '1234567890',
    email_address: 'abc@gmail.com',
    lead_source: 'email-h',
    project_type: 'Renovation',
    project_location: 'bhubaneswar',
    project_budget: 23455.0,
    lead_status: 'Follow-up Required',
    lead_priority: 'Medium',
    lead_notes: 'dfghjk',
    follow_ups: [
      { date: parseDate('2025-03-20'), assigned_to: 'asdfghj', note: 'cfvghjk' },
      { date: parseDate('2025-04-02'), assigned_to: 'wedrfgthjkl', note: 'vgbhnjmk,' },
      { date: null, assigned_to: '', note: '' },
      { date: null, assigned_to: '', note: '' },
      { date: null, assigned_to: '', note: '' },
    ],
    lead_conversion: 'Converted',
    reason_for_loss: 'cvfgbhnj',
  },
];

const members = [];

const projectDetails = [
  {
    originalId: 1,
    date: parseDate('2025-02-13'),
    clientName: 'sriya',
    contactNumber: '123456789',
    address: 'BBSR',
    projectLocation: 'bbsr',
    projectType: 'Institutional',
    twoDPlan: { status: 'Completed', architect: 'Mark Taylor' },
    threeDElevation: { status: 'Completed', architect: 'Jane Smith' },
    interiorDesignStatus: 'Work in Progress',
    interiorDesignArchitect: 'Alice Brown',
    planApprovedStatus: 'Work in Progress',
    planApprovedArchitect: 'Jane Smith',
    structureDetailingStatus: 'Completed',
    structureDetailingArchitect: 'Mark Taylor',
    threeDElevationDetailingStatus: 'Work in Progress',
    threeDElevationDetailingArchitect: 'Jane Smith',
    interiorDetailingStatus: 'Work in Progress',
    interiorDetailingArchitect: 'Jane Smith',
    detailEstimateStatus: 'Work in Progress',
    detailEstimateArchitect: 'John Doe',
    projectHandOver: 'xcvbn',
    projectHandOverDate: parseDate('2025-02-12'),
    paymentStatus: 'cfvgbhnjmk,',
  },
  {
    originalId: 2,
    date: parseDate('2025-02-13'),
    clientName: 'sriya',
    contactNumber: '123456789',
    address: 'BBSR',
    projectLocation: 'bbsr',
    projectType: 'Institutional',
    twoDPlan: { status: 'Completed', architect: 'Mark Taylor' },
    threeDElevation: { status: 'Completed', architect: 'Jane Smith' },
    interiorDesignStatus: 'Work in Progress',
    interiorDesignArchitect: 'Alice Brown',
    planApprovedStatus: 'Work in Progress',
    planApprovedArchitect: 'Jane Smith',
    structureDetailingStatus: 'Completed',
    structureDetailingArchitect: 'Mark Taylor',
    threeDElevationDetailingStatus: 'Work in Progress',
    threeDElevationDetailingArchitect: 'Jane Smith',
    interiorDetailingStatus: 'Work in Progress',
    interiorDetailingArchitect: 'Jane Smith',
    detailEstimateStatus: 'Work in Progress',
    detailEstimateArchitect: 'John Doe',
    projectHandOver: 'xcvbn',
    projectHandOverDate: parseDate('2025-02-12'),
    paymentStatus: 'cfvgbhnjmk,',
  },
  {
    originalId: 3,
    date: parseDate('2025-02-03'),
    clientName: 'sriya',
    contactNumber: '1234567890',
    address: 'BBSR',
    projectLocation: 'bbsr',
    projectType: 'Institutional',
    twoDPlan: { status: 'Work in Progress', architect: 'Jane Smith' },
    threeDElevation: { status: 'Completed', architect: 'Jane Smith' },
    interiorDesignStatus: 'Completed',
    interiorDesignArchitect: 'John Doe',
    planApprovedStatus: 'Work in Progress',
    planApprovedArchitect: 'Mark Taylor',
    structureDetailingStatus: 'Work in Progress',
    structureDetailingArchitect: 'Mark Taylor',
    threeDElevationDetailingStatus: 'Work in Progress',
    threeDElevationDetailingArchitect: 'Mark Taylor',
    interiorDetailingStatus: 'Work in Progress',
    interiorDetailingArchitect: 'Jane Smith',
    detailEstimateStatus: 'Completed',
    detailEstimateArchitect: 'Mark Taylor',
    projectHandOver: 'xcvbn',
    projectHandOverDate: parseDate('2025-02-20'),
    paymentStatus: 'cfvgbhnjmk,',
  },
  {
    originalId: 4,
    date: parseDate('2025-02-04'),
    clientName: 'sriya',
    contactNumber: '1234567890',
    address: '68,Shaileshree vihar',
    projectLocation: 'bbsr',
    projectType: 'Landscape',
    twoDPlan: { status: 'Work in Progress', architect: 'Jane Smith' },
    threeDElevation: { status: 'Work in Progress', architect: 'Jane Smith' },
    interiorDesignStatus: 'Work in Progress',
    interiorDesignArchitect: 'Mark Taylor',
    planApprovedStatus: 'Work in Progress',
    planApprovedArchitect: 'Alice Brown',
    structureDetailingStatus: 'Completed',
    structureDetailingArchitect: 'Jane Smith',
    threeDElevationDetailingStatus: 'Work in Progress',
    threeDElevationDetailingArchitect: 'Jane Smith',
    interiorDetailingStatus: 'Completed',
    interiorDetailingArchitect: 'Jane Smith',
    detailEstimateStatus: 'Work in Progress',
    detailEstimateArchitect: 'Mark Taylor',
    projectHandOver: 'xcvbn',
    projectHandOverDate: parseDate('2025-02-03'),
    paymentStatus: 'cfvgbhnjmk,',
  },
  {
    originalId: 5,
    date: parseDate('2025-02-05'),
    clientName: 'sriya',
    contactNumber: '1234567890',
    address: 'BBSR',
    projectLocation: 'bbsr',
    projectType: 'Mixed Used',
    twoDPlan: { status: 'Completed', architect: 'Jane Smith' },
    threeDElevation: { status: 'Work in Progress', architect: 'Alice Brown' },
    interiorDesignStatus: 'Not Required',
    interiorDesignArchitect: 'John Doe',
    planApprovedStatus: 'Completed',
    planApprovedArchitect: 'Mark Taylor',
    structureDetailingStatus: 'Work in Progress',
    structureDetailingArchitect: 'Jane Smith',
    threeDElevationDetailingStatus: 'Not Required',
    threeDElevationDetailingArchitect: 'Mark Taylor',
    interiorDetailingStatus: 'Not Required',
    interiorDetailingArchitect: 'John Doe',
    detailEstimateStatus: 'Not Required',
    detailEstimateArchitect: 'John Doe',
    projectHandOver: 'xcvbn',
    projectHandOverDate: parseDate('0002-03-01'),
    paymentStatus: 'ok',
  },
  {
    originalId: 6,
    date: parseDate('2025-02-27'),
    clientName: 'sriya',
    contactNumber: '1234567890',
    address: 'BBSR',
    projectLocation: 'bbsr',
    projectType: 'Institutional',
    twoDPlan: { status: '', architect: 'Ar.Shri Dinesh' },
    threeDElevation: { status: '', architect: 'Er.Priti Mishra' },
    interiorDesignStatus: 'Completed',
    interiorDesignArchitect: 'Er.Priti Mishra',
    planApprovedStatus: 'Completed',
    planApprovedArchitect: 'Ar.Uday Kumar',
    structureDetailingStatus: 'Completed',
    structureDetailingArchitect: 'Er.Sandip Barik',
    threeDElevationDetailingStatus: 'Completed',
    threeDElevationDetailingArchitect: 'Ar.Uday Kumar',
    interiorDetailingStatus: 'Work in Progress',
    interiorDetailingArchitect: 'Er.Priti Mishra',
    detailEstimateStatus: 'Completed',
    detailEstimateArchitect: 'Er.Pream Sagar Kumar',
    projectHandOver: 'xcvbn',
    projectHandOverDate: parseDate('2025-02-10'),
    paymentStatus: 'cfvgbhnjmk,',
  },
  {
    originalId: 7,
    date: parseDate('2025-01-30'),
    clientName: 'sriya',
    contactNumber: '1234567890',
    address: 'BBSR',
    projectLocation: 'bbsr',
    projectType: 'Hospital',
    twoDPlan: { status: '', architect: 'Er.Priti Mishra' },
    threeDElevation: { status: '', architect: 'Er.Priti Mishra' },
    interiorDesignStatus: 'Completed',
    interiorDesignArchitect: 'Ar.Hanumant Pandey',
    planApprovedStatus: 'Work in Progress',
    planApprovedArchitect: 'Ar.Uday Kumar',
    structureDetailingStatus: 'Work in Progress',
    structureDetailingArchitect: 'Er.Sandip Barik',
    threeDElevationDetailingStatus: 'Completed',
    threeDElevationDetailingArchitect: 'Er.Priti Mishra',
    interiorDetailingStatus: 'Work in Progress',
    interiorDetailingArchitect: 'Er.Priti Mishra',
    detailEstimateStatus: 'Work in Progress',
    detailEstimateArchitect: 'Er.Pream Sagar Kumar',
    projectHandOver: 'xcvbn',
    projectHandOverDate: parseDate('2025-02-21'),
    paymentStatus: 'cfvgbhnjmk,',
  },
  {
    originalId: 8,
    date: parseDate('2025-03-12'),
    clientName: 'asdfg',
    contactNumber: '12345678',
    address: 'dcfvgbhnjmk',
    projectLocation: 'dcfvgbh',
    projectType: 'Landscape',
    twoDPlan: { status: '', architect: 'Ar.Rupesh Sanani' },
    threeDElevation: { status: '', architect: 'Er.Sarita Sahu' },
    interiorDesignStatus: 'Work in Progress',
    interiorDesignArchitect: 'Er.Priti Mishra',
    planApprovedStatus: 'Completed',
    planApprovedArchitect: 'Ar.Shri Dinesh',
    structureDetailingStatus: 'Work in Progress',
    structureDetailingArchitect: 'Er.Sandip Barik',
    threeDElevationDetailingStatus: 'Completed',
    threeDElevationDetailingArchitect: 'Er.Shri Dinesh',
    interiorDetailingStatus: 'Completed',
    interiorDetailingArchitect: 'Ar.Rupesh Sanani',
    detailEstimateStatus: 'Completed',
    detailEstimateArchitect: 'Er.Tapan Patro',
    projectHandOver: 'fvgbhn',
    projectHandOverDate: parseDate('2025-03-24'),
    paymentStatus: 'xsdcfvgbh',
  },
  {
    originalId: 9,
    date: parseDate('2025-03-13'),
    clientName: 'asdfg',
    contactNumber: '12345678',
    address: 'bhubaneswar',
    projectLocation: 'dcfvgbh',
    projectType: 'Government Project',
    twoDPlan: { status: '', architect: 'Ar.Uday Kumar' },
    threeDElevation: { status: '', architect: 'Ar.Shri Dinesh' },
    interiorDesignStatus: 'Completed',
    interiorDesignArchitect: 'Ar.Uday Kumar',
    planApprovedStatus: 'Work in Progress',
    planApprovedArchitect: 'Ar.Shri Dinesh',
    structureDetailingStatus: 'Completed',
    structureDetailingArchitect: 'Er.Tapan Patro',
    threeDElevationDetailingStatus: 'Work in Progress',
    threeDElevationDetailingArchitect: 'Ar.Shri Dinesh',
    interiorDetailingStatus: 'Work in Progress',
    interiorDetailingArchitect: 'Ar.Uday Kumar',
    detailEstimateStatus: 'Work in Progress',
    detailEstimateArchitect: 'Er.Tapan Patro',
    projectHandOver: 'fvgbhn',
    projectHandOverDate: parseDate('2025-03-12'),
    paymentStatus: 'xsdcfvgbh',
  },
  {
    originalId: 10,
    date: parseDate('2025-03-13'),
    clientName: 'abc',
    contactNumber: '12345678',
    address: 'bhubaneswar',
    projectLocation: 'bhubaneswar',
    projectType: 'Institutional',
    twoDPlan: { status: 'Work in Progress', architect: 'Ar.Uday Kumar' },
    threeDElevation: { status: 'Work in Progress', architect: 'Ar.Kunal Ranjan Patra' },
    interiorDesignStatus: 'Work in Progress',
    interiorDesignArchitect: 'Ar.Uday Kumar',
    planApprovedStatus: 'Work in Progress',
    planApprovedArchitect: 'Ar.Uday Kumar',
    structureDetailingStatus: 'Work in Progress',
    structureDetailingArchitect: 'Er.Tapan Patro',
    threeDElevationDetailingStatus: 'Work in Progress',
    threeDElevationDetailingArchitect: 'Er.Priti Mishra',
    interiorDetailingStatus: 'Work in Progress',
    interiorDetailingArchitect: 'Ar.Shri Dinesh',
    detailEstimateStatus: 'Completed',
    detailEstimateArchitect: 'Er.Tapan Patro',
    projectHandOver: 'abc',
    projectHandOverDate: parseDate('2025-03-12'),
    paymentStatus: 'done',
  },
];

const quotations = [
  { originalId: 86, quotation_number: 'ABC-2025-0001', address: 'Mission Chowk, Jyoti Nagar, Sundargarh, Odisha, 770001', requested_by: 'prajukta', present_address: 'Bhubaneswar', project_location: 'Bhubaneswar', project_type: '3D (Three Dimensional) Elevation', contact_number: '7978970897', quotation_date: parseDate('1298-12-22'), valid_date: parseDate('2025-12-12'), prepared_by: 'Prajukta', description: '2D (Two Dimensional) plan', plan_type: '', ground: 123.0, first: 123.0, second: 123.0, third: 0.0, fourth: 0.0, fifth: 0.0, total_area: 369.0, unit_price: 10.0, grand_total: 3690.0, createdAt: parseDate('2025-02-21 05:22:46') },
  { originalId: 87, quotation_number: 'ABC-2025-0002', address: 'Raj Nivas,G.A. 432,B1,Second floor,near DAV School,Kalinga Nagar,Bhubaneswar,Odisha 751003', requested_by: 'SRIYA', present_address: 'bhubaneswar', project_location: 'bhubaneswar', project_type: 'Interior Design', contact_number: '1234567890', quotation_date: parseDate('2025-02-18'), valid_date: parseDate('2025-02-07'), prepared_by: 'Akash', description: '2D (Two Dimensional) plan', plan_type: '', ground: 20.0, first: 60.0, second: 0.0, third: 0.0, fourth: 0.0, fifth: 0.0, total_area: 80.0, unit_price: 10.0, grand_total: 800.0, createdAt: parseDate('2025-02-24 09:14:27') },
  { originalId: 88, quotation_number: 'ABC-2025-0003', address: 'Raj Nivas,G.A. 432,B1,Second floor,near DAV School,Kalinga Nagar,Bhubaneswar,Odisha 751003', requested_by: 'SRIYA', present_address: 'bhubaneswar', project_location: 'bhubaneswar', project_type: '3D (Three Dimensional) Elevation', contact_number: '1234567890', quotation_date: parseDate('2025-02-13'), valid_date: parseDate('2025-02-19'), prepared_by: 'fghjk', description: 'Interior Design', plan_type: '', ground: 1000.0, first: 2000.0, second: 0.0, third: 0.0, fourth: 0.0, fifth: 0.0, total_area: 3000.0, unit_price: 50.0, grand_total: 150000.0, createdAt: parseDate('2025-02-25 06:45:12') },
  { originalId: 89, quotation_number: 'ABC-2025-0004', address: 'Raj Nivas,G.A. 432,B1,Second floor,near DAV School,Kalinga Nagar,Bhubaneswar,Odisha 751003', requested_by: 'SRIYA', present_address: 'bhubaneswar', project_location: 'bhubaneswar', project_type: '3D (Three Dimensional) Elevation', contact_number: '1234567890', quotation_date: parseDate('2025-02-13'), valid_date: parseDate('2025-02-19'), prepared_by: 'fghjk', description: 'Interior Design', plan_type: '', ground: 1000.0, first: 2000.0, second: 0.0, third: 0.0, fourth: 0.0, fifth: 0.0, total_area: 3000.0, unit_price: 50.0, grand_total: 150000.0, createdAt: parseDate('2025-02-25 06:47:09') },
  { originalId: 90, quotation_number: 'ABC-2025-0005', address: 'Mission Chowk, Jyoti Nagar, Sundargarh, Odisha, 770001', requested_by: 'SRIYA', present_address: 'bhubaneswar', project_location: 'bhubanesrar', project_type: 'Landscaping', contact_number: '123456', quotation_date: parseDate('2025-02-25'), valid_date: parseDate('2025-02-28'), prepared_by: 'fghjk', description: 'Interior Design', plan_type: '', ground: 1000.0, first: 1000.0, second: 0.0, third: 0.0, fourth: 0.0, fifth: 0.0, total_area: 2000.0, unit_price: 50.0, grand_total: 100000.0, createdAt: parseDate('2025-02-25 10:23:08') },
  { originalId: 91, quotation_number: 'ABC-2025-0006', address: 'Mission Chowk, Jyoti Nagar, Sundargarh, Odisha, 770001', requested_by: 'SRIYA', present_address: 'bhubaneswar', project_location: 'bhubanesrar', project_type: 'Landscaping', contact_number: '123456', quotation_date: parseDate('2025-02-25'), valid_date: parseDate('2025-02-28'), prepared_by: 'fghjk', description: 'Interior Design', plan_type: '', ground: 1000.0, first: 1000.0, second: 0.0, third: 0.0, fourth: 0.0, fifth: 0.0, total_area: 2000.0, unit_price: 50.0, grand_total: 100000.0, createdAt: parseDate('2025-02-25 10:24:18') },
  { originalId: 92, quotation_number: 'ABC-2025-0007', address: 'Raj Nivas,G.A. 432,B1,Second floor,near DAV School,Kalinga Nagar,Bhubaneswar,Odisha 751003', requested_by: 'SRIYA', present_address: 'vgbn', project_location: 'b n', project_type: 'Interior Design', contact_number: '1234567890', quotation_date: parseDate('2025-02-06'), valid_date: parseDate('2025-02-28'), prepared_by: 'fghjk', description: 'Interior Design', plan_type: '', ground: 1000.0, first: 1000.0, second: 0.0, third: 1000.0, fourth: 0.0, fifth: 0.0, total_area: 3000.0, unit_price: 50.0, grand_total: 150000.0, createdAt: parseDate('2025-02-25 11:43:35') },
  { originalId: 93, quotation_number: 'ABC-2025-0008', address: 'Mission Chowk, Jyoti Nagar, Sundargarh, Odisha, 770001', requested_by: 'SRIYA', present_address: 'bhubaneswar', project_location: 'bhubaneswar', project_type: '3D (Three Dimensional) Elevation', contact_number: '123456', quotation_date: parseDate('2025-02-13'), valid_date: parseDate('2025-02-21'), prepared_by: 'sdfghjk', description: '3D (Three Dimensional) Elevation', plan_type: '', ground: 1000.0, first: 1000.0, second: 0.0, third: 0.0, fourth: 0.0, fifth: 0.0, total_area: 2000.0, unit_price: 5.0, grand_total: 10000.0, createdAt: parseDate('2025-02-26 10:22:22') },
  { originalId: 94, quotation_number: 'ABC-2025-0009', address: 'Mission Chowk, Jyoti Nagar, Sundargarh, Odisha, 770001', requested_by: 'SRIYA', present_address: 'bhubaneswar', project_location: 'bhubaneswar', project_type: '3D (Three Dimensional) Elevation', contact_number: '1234567890', quotation_date: parseDate('2025-03-12'), valid_date: parseDate('2025-03-22'), prepared_by: 'Mr. Akash', description: 'Landscaping', plan_type: '', ground: 50.0, first: 0.0, second: 40.0, third: 0.0, fourth: 0.0, fifth: 0.0, total_area: 90.0, unit_price: 20.0, grand_total: 1800.0, createdAt: parseDate('2025-03-04 10:16:12') },
  { originalId: 95, quotation_number: 'ABC-2025-0010', address: 'Mission Chowk, Jyoti Nagar, Sundargarh, Odisha, 770001', requested_by: 'abc', present_address: 'bhubaneswar', project_location: 'bhubaneswar', project_type: 'Interior Design', contact_number: '12312345', quotation_date: parseDate('2025-03-19'), valid_date: parseDate('2025-03-14'), prepared_by: 'abc', description: '2D (Two Dimensional) plan', plan_type: '', ground: 1000.0, first: 1000.0, second: 0.0, third: 0.0, fourth: 0.0, fifth: 0.0, total_area: 2000.0, unit_price: 10.0, grand_total: 20000.0, createdAt: parseDate('2025-03-04 12:25:03') },
];

const rates = [
  { name: 'Fitness', charge: 55 },
  { name: 'Sauna', charge: 35 },
  { name: 'Cardio', charge: 40 },
];

const receipts = [
  { originalId: 1, receipt_number: 'ABC-2025-0001', address: '', client_name: 'abc', client_address: 'gthyjkl', client_contact: '345678', receipt_date: parseDate('2025-02-21'), description: 'dumbble', area: 678.0, unit_price: 67.0, grand_total: 45426.0, payment_date: parseDate('2025-02-27'), payment_mode: 'fghjmk', advance_amount: 66666.0 },
  { originalId: 2, receipt_number: 'ABC-2025-0002', address: '', client_name: 'abc', client_address: 'gthyjkl', client_contact: '345678', receipt_date: parseDate('2025-02-21'), description: 'dumbble', area: 678.0, unit_price: 67.0, grand_total: 45426.0, payment_date: parseDate('2025-02-27'), payment_mode: 'fghjmk', advance_amount: 66666.0 },
  { originalId: 3, receipt_number: 'ABC-2025-0003', address: '', client_name: 'prajukta mahakud', client_address: 'unit 4', client_contact: '12345678', receipt_date: parseDate('2025-03-13'), description: 'interior design', area: 1223.0, unit_price: 12.0, grand_total: 14676.0, payment_date: parseDate('2025-04-12'), payment_mode: 'online', advance_amount: 5000.0 },
  { originalId: 4, receipt_number: 'ABC-2025-0004', address: '', client_name: 'abc', client_address: 'bhjmk', client_contact: '345678', receipt_date: parseDate('2025-02-25'), description: 'dumbble', area: 678.0, unit_price: 67.0, grand_total: 45426.0, payment_date: parseDate('2025-02-25'), payment_mode: 'online', advance_amount: 3456.0 },
  { originalId: 5, receipt_number: 'ABC-2025-0005', address: '', client_name: 'abc', client_address: 'bhjmk', client_contact: '345678', receipt_date: parseDate('2025-02-20'), description: 'dumbble', area: 678.0, unit_price: 67.0, grand_total: 45426.0, payment_date: parseDate('2025-02-13'), payment_mode: 'online', advance_amount: 1234.0 },
  { originalId: 6, receipt_number: 'ABC-2025-0006', address: '', client_name: 'sriya', client_address: 'bbsr', client_contact: '345678', receipt_date: parseDate('2025-03-22'), description: 'hello', area: 678.0, unit_price: 67.0, grand_total: 45426.0, payment_date: parseDate('2025-03-12'), payment_mode: 'fghjmk', advance_amount: 234.0 },
  { originalId: 7, receipt_number: 'ABC-2025-0007', address: '', client_name: 'prajukta mahakud', client_address: 'Nayapalii', client_contact: '2147483647', receipt_date: parseDate('2025-03-12'), description: 'abc', area: 123.0, unit_price: 5.0, grand_total: 615.0, payment_date: parseDate('2025-03-06'), payment_mode: 'online', advance_amount: 12345.0 },
  { originalId: 8, receipt_number: 'ABC-2025-0008', address: '', client_name: 'prajukta mahakud', client_address: 'Nayapalii', client_contact: '2147483647', receipt_date: parseDate('2025-03-19'), description: 'abc', area: 123.0, unit_price: 5.0, grand_total: 615.0, payment_date: parseDate('2025-03-13'), payment_mode: 'online', advance_amount: 12345.0 },
];

const reminders = [
  { originalId: 12, name: 'staff', message: 'asd', status: 'unread', date: parseDate('2020-04-16 22:39:59'), userId: 0 },
  { originalId: 13, name: 'staff', message: 'asdasdas', status: 'unread', date: parseDate('2020-04-16 22:40:49'), userId: 0 },
  { originalId: 14, name: 'staff', message: 'ASasA', status: 'unread', date: parseDate('2020-04-16 22:41:59'), userId: 0 },
  { originalId: 15, name: 'staff', message: 'asdasdasd', status: 'unread', date: parseDate('2020-04-16 22:42:28'), userId: 0 },
];

const staffs = [
  { userId: 1, username: 'bruno', password: 'cac29d7a34687eb14b37068ee4708e7b', email: 'brunoden@mail.com', fullname: 'Bruno Den', address: '26 Morris Street', designation: 'Cashier', gender: 'Male', contact: '852028120' },
  { userId: 2, username: 'michelle', password: 'cac29d7a34687eb14b37068ee4708e7b', email: 'michelle@mail.com', fullname: 'Michelle R. Lane', address: '61 Stone Lane', designation: 'Architects', gender: 'Male', contact: '2147483647' },
  { userId: 3, username: 'james', password: 'cac29d7a34687eb14b37068ee4708e7b', email: 'jamesb@mail.com', fullname: 'James Brown', address: '12 Deer Ridge Drive', designation: 'Landscape Architects', gender: 'Male', contact: '21474836' },
  { userId: 4, username: 'bruce', password: 'cac29d7a34687eb14b37068ee4708e7b', email: 'bruce@mail.com', fullname: 'Bruce H. Klaus', address: '68 Lake Floyd Circle', designation: 'Manager', gender: 'Male', contact: '1458887788' },
];

const departments = [
  { originalId: 4, department_id: '1', department_name: 'INTERIOR DESIGN', status: 1, created_at: parseDate('2025-02-26 09:40:59') },
  { originalId: 5, department_id: '2', department_name: 'STRUCTURE DETAILING', status: 1, created_at: parseDate('2025-02-26 09:41:06') },
];

const shifts = [
  { originalId: 1, start_time: '09:00:00', end_time: '18:00:00', status: 1, created_at: parseDate('2023-09-29 00:18:50') },
  { originalId: 2, start_time: '13:00:00', end_time: '22:00:00', status: 1, created_at: parseDate('2023-09-29 00:19:14') },
];

const locations = [
  { originalId: 4, location: 'Work From Home', created_at: parseDate('2025-02-26 09:40:22') },
  { originalId: 5, location: 'Bhubaneswar', created_at: parseDate('2025-02-26 09:40:27') },
  { originalId: 6, location: 'Sundargarh', created_at: parseDate('2025-02-26 09:40:33') },
];

const employees = [
  { originalId: 1, first_name: 'abc', last_name: 'abc', username: 'abc', password: 'abc', email: 'sriyak1013@gmail.com', dob: parseSlashDate('26/02/2005'), gender: 'Male', employee_id: 'EMP-1', joining_date: parseSlashDate('19/02/2025'), phone: '12345', shift: '09:00:00-18:00:00', department: 'STRUCTURE DETAILING', role: 0, status: 'Active', created_at: parseDate('2025-02-26 10:04:33') },
  { originalId: 2, first_name: 'Sriya', last_name: 'Rao', username: 'admin@gmail.com', password: 'admin', email: 'sriyak1013@gmail.com', dob: parseSlashDate('03/02/2025'), gender: 'Female', employee_id: 'EMP-2', joining_date: parseSlashDate('26/02/2025'), phone: '9337911515', shift: '09:00:00-18:00:00', department: 'INTERIOR DESIGN', role: 0, status: 'Active', created_at: parseDate('2025-02-26 10:34:37') },
  { originalId: 4, first_name: 'Sirisha', last_name: 'Rao', username: 'sirisha', password: 'sirisha', email: 'abc@gmail.com', dob: parseSlashDate('05/02/2001'), gender: 'Female', employee_id: 'EMP-4', joining_date: parseSlashDate('20/02/2025'), phone: '1234567890', shift: '09:00:00-18:00:00', department: 'INTERIOR DESIGN', role: 0, status: 'Active', created_at: parseDate('2025-02-27 07:41:47') },
  { originalId: 5, first_name: 'prajukta', last_name: 'mahakud', username: 'prajukta', password: 'prajukta', email: 'example@gmail.com', dob: parseSlashDate('04/03/2025'), gender: 'Female', employee_id: 'EMP-5', joining_date: parseSlashDate('05/03/2025'), phone: '0700804908', shift: '09:00:00-18:00:00', department: 'INTERIOR DESIGN', role: 0, status: 'Active', created_at: parseDate('2025-03-04 12:15:34') },
];

const attendances = [
  { employeeId: 'EMP-2', department: 'INTERIOR DESIGN', shift: '09:00:00-18:00:00', location: 'Bhubaneswar', message: 'Hello', date: parseDate('2023-09-29'), check_in: parseDateTime('2023-09-29', '11:23:05'), in_status: 'Late', check_out: parseDateTime('2023-09-29', '11:23:39'), out_status: 'Early', created_at: parseDate('2025-02-26 10:20:28') },
  { employeeId: 'EMP-4', department: 'INTERIOR DESIGN', shift: '09:00:00-18:00:00', location: 'Bhubaneswar', message: 'started a work', date: parseDate('2025-02-28'), check_in: parseDateTime('2025-02-28', '14:29:11'), in_status: 'Late', check_out: parseDateTime('2025-02-28', '14:34:12'), out_status: 'Early', created_at: parseDate('2025-02-28 09:04:12') },
  { employeeId: 'EMP-2', department: 'INTERIOR DESIGN', shift: '09:00:00-18:00:00', location: 'Work From Home', message: 'i am starting work', date: parseDate('2025-02-28'), check_in: parseDateTime('2025-02-28', '14:48:53'), in_status: 'Late', check_out: parseDateTime('2025-02-28', '14:49:10'), out_status: 'Early', created_at: parseDate('2025-02-28 09:19:10') },
  { employeeId: 'EMP-4', department: 'INTERIOR DESIGN', shift: '09:00:00-18:00:00', location: 'Work From Home', message: 'i am starting work', date: parseDate('2025-03-03'), check_in: parseDateTime('2025-03-03', '12:27:30'), in_status: 'Late', check_out: parseDateTime('2025-03-03', '12:35:11'), out_status: 'Early', created_at: parseDate('2025-03-03 07:05:11') },
  { employeeId: 'EMP-1', department: 'STRUCTURE DETAILING', shift: '09:00:00-18:00:00', location: 'Work From Home', message: 'sd', date: parseDate('2025-03-04'), check_in: parseDateTime('2025-03-04', '17:39:43'), in_status: 'Late', check_out: parseDateTime('2025-03-04', '17:40:05'), out_status: 'Early', created_at: parseDate('2025-03-04 12:10:05') },
  { employeeId: 'EMP-5', department: 'INTERIOR DESIGN', shift: '09:00:00-18:00:00', location: 'Bhubaneswar', message: 'Example', date: parseDate('2025-03-04'), check_in: parseDateTime('2025-03-04', '17:47:47'), in_status: 'Late', check_out: parseDateTime('2025-03-04', '17:48:03'), out_status: 'Early', created_at: parseDate('2025-03-04 12:18:03') },
];

const todos = [
  { originalId: 20, task_status: 'In Progress', task_desc: 'Test Completed', user_id: 14 },
  { originalId: 21, task_status: 'Pending', task_desc: 'Mastering Crunches', user_id: 6 },
  { originalId: 22, task_status: 'In Progress', task_desc: 'Standing Workouts For Flat Abs', user_id: 6 },
  { originalId: 23, task_status: 'In Progress', task_desc: 'Triceps Buildup - 3 set', user_id: 14 },
  { originalId: 24, task_status: 'Pending', task_desc: 'Decline dumbbell bench press', user_id: 6 },
  { originalId: 27, task_status: 'Pending', task_desc: 'dddd', user_id: 0 },
  { originalId: 28, task_status: 'In Progress', task_desc: 'Test 1', user_id: 23 },
];

const createReferenceMap = (items, keyField) => {
  return items.reduce((acc, item) => {
    if (item[keyField]) acc[item[keyField]] = item;
    return acc;
  }, {});
};

const cleanupCollection = async (model) => {
  try {
    await model.collection.drop();
  } catch (err) {
    if (err.code !== 26) {
      throw err;
    }
  }
};

async function seed() {
  const summary = {
    announcements: 0,
    admins: 0,
    clients: 0,
    equipment: 0,
    invoices: 0,
    leads: 0,
    members: 0,
    projects: 0,
    quotations: 0,
    rates: 0,
    receipts: 0,
    reminders: 0,
    staffs: 0,
    departments: 0,
    employees: 0,
    locations: 0,
    shifts: 0,
    attendances: 0,
    todos: 0,
    skipped: [],
  };

  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/archify';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected for seeding');

    await Promise.all([
      cleanupCollection(Admin),
      cleanupCollection(Announcement),
      cleanupCollection(Attendance),
      cleanupCollection(Client),
      cleanupCollection(Equipment),
      cleanupCollection(Invoice),
      cleanupCollection(Lead),
      cleanupCollection(Member),
      cleanupCollection(Project),
      cleanupCollection(Quotation),
      cleanupCollection(Rate),
      cleanupCollection(Receipt),
      cleanupCollection(Reminder),
      cleanupCollection(Staff),
      cleanupCollection(Department),
      cleanupCollection(Employee),
      cleanupCollection(Location),
      cleanupCollection(Shift),
      cleanupCollection(Todo),
    ]);

    const departmentDocs = await Department.insertMany(
      departments.map((item) => ({
        originalId: item.originalId,
        name: normalizeString(item.department_name),
        description: item.status === 0 ? 'Inactive department' : undefined,
        createdAt: item.created_at || undefined,
      }))
    );
    const departmentMap = createReferenceMap(departmentDocs, 'name');
    summary.departments = departmentDocs.length;

    const shiftDocs = await Shift.insertMany(
      shifts.map((item) => ({
        shift: `${item.start_time}-${item.end_time}`,
        start_time: item.start_time,
        end_time: item.end_time,
        createdAt: item.created_at || undefined,
      }))
    );
    const shiftMap = createReferenceMap(shiftDocs, 'shift');
    summary.shifts = shiftDocs.length;

    const locationDocs = await Location.insertMany(
      locations.map((item) => ({
        location: normalizeString(item.location),
        created_at: item.created_at || undefined,
      }))
    );
    const locationMap = createReferenceMap(locationDocs, 'location');
    summary.locations = locationDocs.length;

    const staffDocs = await Promise.all(
      staffs.map(async (item) => {
        const hashed = await hashPassword(item.password);
        return { ...item, gender: normalizeGender(item.gender), password: hashed };
      })
    ).then((payload) => Staff.insertMany(payload));
    const staffMapById = staffDocs.reduce((acc, doc) => {
      if (doc.userId !== undefined) acc[doc.userId] = doc;
      return acc;
    }, {});
    summary.staffs = staffDocs.length;

    const employeeDocs = [];
    for (const item of employees) {
      const hashed = await hashPassword(item.password);
      const department = departmentMap[item.department];
      const shift = shiftMap[item.shift];
      const doc = {
        originalId: item.originalId,
        first_name: normalizeString(item.first_name),
        last_name: normalizeString(item.last_name),
        username: normalizeString(item.username),
        password: hashed,
        email: normalizeString(item.email),
        dob: item.dob,
        employee_id: normalizeString(item.employee_id),
        joining_date: item.joining_date,
        phone: normalizeString(item.phone),
        designation: normalizeString(item.role === 1 ? 'Admin' : 'Employee'),
        department: department ? department._id : undefined,
        shift: shift ? shift._id : undefined,
        gender: normalizeGender(item.gender),
        role: item.role,
        status: item.status === 1 || item.status === '1' ? 'Active' : 'Inactive',
        created_at: item.created_at || undefined,
      };
      employeeDocs.push(doc);
    }
    const employeeInsertDocs = await Employee.insertMany(employeeDocs);
    const employeeMapById = createReferenceMap(employeeInsertDocs, 'employee_id');
    summary.employees = employeeInsertDocs.length;

    const announcementDocs = await Announcement.insertMany(announcements);
    summary.announcements = announcementDocs.length;

    const clientDocs = await Client.insertMany(clients);
    summary.clients = clientDocs.length;

    const equipmentDocs = await Equipment.insertMany(equipment);
    summary.equipment = equipmentDocs.length;

    const invoiceDocs = await Invoice.insertMany(invoices);
    summary.invoices = invoiceDocs.length;

    const leadDocs = await Lead.insertMany(leads);
    summary.leads = leadDocs.length;

    const memberDocs = await Member.insertMany(members);
    summary.members = memberDocs.length;

    const projectDocs = await Project.insertMany(projectDetails);
    summary.projects = projectDocs.length;

    const quotationDocs = await Quotation.insertMany(quotations);
    summary.quotations = quotationDocs.length;

    const rateDocs = await Rate.insertMany(rates);
    summary.rates = rateDocs.length;

    const receiptDocs = await Receipt.insertMany(receipts);
    summary.receipts = receiptDocs.length;

    const reminderDocs = await Promise.all(
      reminders.map(async (item) => {
        const staff = staffMapById[item.userId];
        return {
          ...item,
          staff: staff ? staff._id : undefined,
          date: item.date,
        };
      })
    ).then((payload) => Reminder.insertMany(payload));
    summary.reminders = reminderDocs.length;

    const todoDocs = await Promise.all(
      todos.map(async (item) => {
        const staff = staffMapById[item.user_id];
        return {
          originalId: item.originalId,
          task_status: normalizeString(item.task_status),
          task_desc: normalizeString(item.task_desc),
          user_id: item.user_id,
          staff: staff ? staff._id : undefined,
        };
      })
    ).then((payload) => Todo.insertMany(payload));
    summary.todos = todoDocs.length;

    const attendanceDocs = await Promise.all(
      attendances.map(async (item) => {
        const employee = employeeMapById[item.employeeId];
        const department = departmentMap[item.department];
        const shift = shiftMap[item.shift];
        const location = locationMap[item.location];
        return {
          employeeId: normalizeString(item.employeeId),
          employee: employee ? employee._id : undefined,
          department: department ? department._id : undefined,
          shift: shift ? shift._id : undefined,
          location: location ? location._id : undefined,
          message: normalizeString(item.message),
          date: item.date,
          check_in: item.check_in,
          in_status: normalizeString(item.in_status),
          check_out: item.check_out,
          out_status: normalizeString(item.out_status),
          created_at: item.created_at,
        };
      })
    ).then((payload) => Attendance.insertMany(payload));
    summary.attendances = attendanceDocs.length;

    const adminDocs = await Promise.all(
      admins.map(async (item) => ({
        username: normalizeString(item.username),
        password: await hashPassword(item.password),
        name: normalizeString(item.name),
      }))
    ).then((payload) => Admin.insertMany(payload));
    summary.admins = adminDocs.length;

    console.log('\nSeed summary:');
    console.log(JSON.stringify(summary, null, 2));
    console.log('Seed completed successfully.');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
