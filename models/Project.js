const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  status:    { type: String, enum: ['Pending', 'In Progress', 'Completed', 'N/A'], default: 'Pending' },
  architect: { type: String },
});

const projectSchema = new mongoose.Schema({
  date:             { type: Date, required: true },
  clientName:       { type: String, required: true },
  contactNumber:    { type: String, required: true },
  address:          { type: String },
  projectLocation:  { type: String },
  projectType:      { type: String },
  // Tasks with status + assigned architect
  twoDPlan:                   { type: taskSchema },
  threeDElevation:            { type: taskSchema },
  interiorDesign:             { type: taskSchema },
  planApproved:               { type: taskSchema },
  structureDetailing:         { type: taskSchema },
  threeDElevationDetailing:   { type: taskSchema },
  landscapeDesigning:         { type: taskSchema },
  constructionDrawing:        { type: taskSchema },
  notes:            { type: String },
  overallStatus:    { type: String, enum: ['Active', 'On Hold', 'Completed'], default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
