import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/services/settings';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json(
    {
      maintenanceMode: settings.maintenanceMode,
      title: settings.maintenanceTitle,
      message: settings.maintenanceMessage,
      expectedReturn: settings.maintenanceExpectedReturn,
      progress: settings.maintenanceProgress,
      showProgress: settings.maintenanceShowProgress,
      accent: settings.maintenanceAccent,
      contactFormEnabled: settings.contactFormEnabled,
    },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  );
}
