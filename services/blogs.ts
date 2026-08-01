import { connectDB } from '@/lib/mongodb';
import BlogModel from '@/models/Blog';
import { BlogPost } from '@/types';
import { fallbackBlogs } from '@/lib/fallbackData';

export async function getBlogs(): Promise<BlogPost[]> {
  try {
    await connectDB();
    const docs = await BlogModel.find({ published: true }).sort({ createdAt: -1 }).lean();
    if (!docs.length) return fallbackBlogs;
    return JSON.parse(JSON.stringify(docs));
  } catch {
    return fallbackBlogs;
  }
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    await connectDB();
    const doc = await BlogModel.findOne({ slug, published: true }).lean();
    if (doc) return JSON.parse(JSON.stringify(doc));
  } catch {
    /* fall through */
  }
  return fallbackBlogs.find((b) => b.slug === slug) || null;
}
