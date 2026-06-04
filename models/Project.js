const mongoose = require('mongoose');

const projectSectionSchema = new mongoose.Schema({
  status:    { type: String, trim: true },
  architect: { type: String, trim: true },
}, { _id: false });

const projectSchema = new mongoose.Schema({
  originalId:                       { type: Number, index: true },
  date:                             { type: Date },
  clientName:                       { type: String, trim: true },
  contactNumber:                    { type: String, trim: true },
  address:                          { type: String },
  projectLocation:                  { type: String },
  projectType:                      { type: String },
  twoDPlan:                         { type: projectSectionSchema },
  twoDPlanArchitect:                { type: String, trim: true },
  threeDElevation:                  { type: projectSectionSchema },
  threeDElevationArchitect:         { type: String, trim: true },
  interiorDesign:                   { type: projectSectionSchema },
  interiorDesignArchitect:          { type: String, trim: true },
  planApproved:                     { type: projectSectionSchema },
  planApprovedArchitect:            { type: String, trim: true },
  structureDetailing:               { type: projectSectionSchema },
  structureDetailingArchitect:      { type: String, trim: true },
  threeDElevationDetailing:         { type: projectSectionSchema },
  threeDElevationDetailingArchitect:{ type: String, trim: true },
  landscapeDesigning:               { type: projectSectionSchema },
  landscapeDesigningArchitect:      { type: String, trim: true },
  constructionDrawing:              { type: projectSectionSchema },
  constructionDrawingArchitect:     { type: String, trim: true },
  overallStatus:                    { type: String, trim: true },
  notes:                            { type: String, trim: true },
  projectHandOver:                  { type: String, trim: true },
  projectHandOverDate:              { type: Date },
  paymentStatus:                    { type: String, trim: true },
}, { timestamps: true });

projectSchema.index({ clientName: 1 });

module.exports = mongoose.model('Project', projectSchema);
