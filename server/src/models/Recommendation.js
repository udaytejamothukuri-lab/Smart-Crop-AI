import mongoose from 'mongoose';

const RecommendedCropSchema = new mongoose.Schema({
  cropId: { type: String, required: true },
  cropName: { type: String, required: true },
  botanicalName: { type: String },
  category: { type: String },
  rank: { type: Number, required: true },
  suitabilityCategory: { 
    type: String, 
    enum: ['High compatibility', 'Moderate compatibility', 'Low compatibility', 'Insufficient information'],
    required: true 
  },
  score: { type: Number, default: null },
  coveragePercentage: { type: Number, default: 0 },
  matchingFactors: [{ type: String }],
  unmetFactors: [{ type: String }],
  missingFactors: [{ type: String }],
  explanation: { type: String, required: true },
  limitations: [{ type: String }],
  growingPeriodDays: { type: String },
  source: { type: String }
}, { _id: false });

const RecommendationSchema = new mongoose.Schema({
  inputProfile: {
    soilType: { type: String, default: null },
    season: { type: String, default: null },
    temperature: { type: Number, default: null },
    rainfall: { type: Number, default: null },
    ph: { type: Number, default: null },
    humidity: { type: Number, default: null },
    nitrogen: { type: Number, default: null },
    phosphorus: { type: Number, default: null },
    potassium: { type: Number, default: null }
  },
  missingInputs: [{ type: String }],
  recommendations: [RecommendedCropSchema],
  topCrop: {
    cropName: { type: String },
    suitabilityCategory: { type: String },
    score: { type: Number, default: null }
  },
  methodVersion: { type: String, required: true },
  datasetVersion: { type: String, required: true },
  advisory: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: true }
});

export const Recommendation = mongoose.models.Recommendation || mongoose.model('Recommendation', RecommendationSchema);
