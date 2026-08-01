import { connectDB } from '@/lib/mongodb';
import ServiceModel from '@/models/Service';
import { Service } from '@/types';
import { fallbackServices } from '@/lib/fallbackData';

export async function getServices(): Promise<Service[]> {
  try {
    await connectDB();
    const docs = await ServiceModel.find().sort({ order: 1 }).lean();
    if (!docs.length) return fallbackServices;
    return JSON.parse(JSON.stringify(docs));
  } catch {
    return fallbackServices;
  }
}
