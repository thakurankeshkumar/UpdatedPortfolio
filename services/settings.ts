import { connectDB } from '@/lib/mongodb';
import SiteSettingsModel from '@/models/SiteSettings';
import { SiteSettings } from '@/types/settings';
import { fallbackSettings } from '@/lib/fallbackSettings';

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    await connectDB();
    let doc = await SiteSettingsModel.findOne().lean();
    if (!doc) {
      const created = await SiteSettingsModel.create({});
      doc = created.toObject();
    }
    return JSON.parse(JSON.stringify(doc));
  } catch {
    return fallbackSettings;
  }
}
