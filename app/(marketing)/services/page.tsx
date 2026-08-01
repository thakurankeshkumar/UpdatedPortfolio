import type { Metadata } from 'next';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { Check, ArrowRight } from 'lucide-react';
import { getServices } from '@/services/services';
import { getSiteSettings } from '@/services/settings';
import { Reveal, Stagger, StaggerItem } from '@/animations/reveal';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Freelance development services — full-stack apps, APIs, admin dashboards, and website optimization.',
};

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getServices(), getSiteSettings()]);

  return (
    <div className="py-20">
      <div className="container">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            Services
          </span>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-ink md:text-5xl">{settings.servicesPageTitle}</h1>
          <p className="mt-4 text-ink/60">{settings.servicesPageSubtitle}</p>
        </Reveal>

        <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = (Icons as any)[s.icon] || Icons.Code2;
            return (
              <StaggerItem key={s._id}>
                <div className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white p-7 shadow-soft transition-all hover:-translate-y-1.5 hover:shadow-lift ${i === 0 ? 'border-primary/30 ring-1 ring-primary/10' : 'border-border'}`}>
                  {i === 0 && (
                    <span className="absolute right-5 top-5 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">Popular</span>
                  )}
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm text-ink/60">{s.description}</p>
                  <ul className="mt-5 space-y-2">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-ink/70">
                        <Check size={15} className="mt-0.5 shrink-0 text-success" /> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                    <div>
                      <div className="text-xs text-ink/40">Starting at</div>
                      <div className="font-heading font-semibold text-ink">{s.startingPrice}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-ink/40">Timeline</div>
                      <div className="text-sm font-medium text-ink/70">{s.timeline}</div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal className="mt-16 text-center">
          <Button asChild variant="primary" size="lg" magnetic>
            <Link href="/contact">Discuss your project <ArrowRight size={16} /></Link>
          </Button>
        </Reveal>
      </div>
    </div>
  );
}
