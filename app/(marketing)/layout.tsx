import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BackToTop } from '@/components/layout/scroll-widgets';
import { getSiteSettings } from '@/services/settings';

export const dynamic = 'force-dynamic';

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <>
      <Header logoText={settings.logoText} />
      <main className="pt-20">{children}</main>
      <Footer settings={settings} />
      <BackToTop />
    </>
  );
}
