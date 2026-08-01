import mongoose, { Schema } from 'mongoose';

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    features: { type: [String], default: [] },
    timeline: { type: String, default: '1-2 weeks' },
    startingPrice: { type: String, default: '$299' },
    icon: { type: String, default: 'Code2' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);
