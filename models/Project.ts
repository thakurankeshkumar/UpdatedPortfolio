import mongoose, { Schema } from 'mongoose';

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: 'Web App' },
    techStack: { type: [String], default: [] },
    coverImage: { type: String, default: '' },
    gallery: { type: [String], default: [] },
    challenges: { type: String, default: '' },
    solutions: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
