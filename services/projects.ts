import { connectDB } from '@/lib/mongodb';
import ProjectModel from '@/models/Project';
import { Project } from '@/types';
import { fallbackProjects } from '@/lib/fallbackData';

export async function getProjects(): Promise<Project[]> {
  try {
    await connectDB();
    const docs = await ProjectModel.find().sort({ order: 1, createdAt: -1 }).lean();
    if (!docs.length) return fallbackProjects;
    return JSON.parse(JSON.stringify(docs));
  } catch {
    return fallbackProjects;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    await connectDB();
    const doc = await ProjectModel.findOne({ slug }).lean();
    if (doc) return JSON.parse(JSON.stringify(doc));
  } catch {
    /* fall through to fallback */
  }
  return fallbackProjects.find((p) => p.slug === slug) || null;
}
