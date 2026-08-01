import { connectDB } from '@/lib/mongodb';
import TestimonialModel from '@/models/Testimonial';
import { Testimonial } from '@/types';
import { fallbackTestimonials } from '@/lib/fallbackData';

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    await connectDB();
    const docs = await TestimonialModel.find().sort({ order: 1 }).lean();
    if (!docs.length) return fallbackTestimonials;
    return JSON.parse(JSON.stringify(docs));
  } catch {
    return fallbackTestimonials;
  }
}
