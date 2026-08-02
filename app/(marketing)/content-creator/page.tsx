import type { Metadata } from 'next';
import Image from 'next/image';
import * as Icons from 'lucide-react';
import { Play } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '@/animations/reveal';
import { SectionHeading } from '@/components/layout/section-heading';
import { getSiteSettings } from '@/services/settings';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Content Creator',
  description: 'Dev-focused videos, shorts, and build breakdowns from Ankesh Kumar.',
};

export default async function ContentCreatorPage() {
  const settings = await getSiteSettings();
  const platforms = [...(settings.platforms || [])].sort((a, b) => a.order - b.order);
  const videos = [...(settings.videos || [])].sort((a, b) => a.order - b.order);

  return (
    <div className="py-20">
      <div className="container">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-accent/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
            Content Creator
          </span>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-ink md:text-5xl">{settings.contentPageTitle}</h1>
          <p className="mt-4 text-ink/60">{settings.contentPageSubtitle}</p>
        </Reveal>

        {platforms.length > 0 && (
          <Stagger className="mb-20 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {platforms.map((p) => {
              const Icon = (Icons as any)[p.icon] || Icons.Globe;
              return (
                <StaggerItem key={p._id || p.name}>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group block h-full rounded-2xl border border-border bg-white p-7 text-center shadow-soft transition-all hover:-translate-y-1.5 hover:shadow-lift hover:border-accent/30"
                  >
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary transition-colors group-hover:from-primary group-hover:to-accent group-hover:text-white">
                      <Icon size={24} />
                    </div>
                    <h3 className="font-heading font-semibold text-ink">{p.name}</h3>
                    <p className="mt-1 text-sm text-ink/50">{p.handle}</p>
                    <p className="mt-3 text-xs text-ink/40">{p.description}</p>
                  </a>
                </StaggerItem>
              );
            })}
          </Stagger>
        )}

        {videos.length > 0 && (
          <>
            <SectionHeading eyebrow="Latest" title="Videos & Shorts" />
            <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {videos.map((v) => (
                <StaggerItem key={v._id || v.title}>
                  <a
                    href={v.href || '#'}
                    target={v.href && v.href !== '#' ? '_blank' : undefined}
                    rel="noreferrer"
                    className="group relative flex aspect-[9/13] flex-col justify-between overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-accent/10 p-5 transition-transform hover:-translate-y-1"
                  >
                    {v.thumbnail && (
                      <Image
                        src={v.thumbnail}
                        alt={v.title}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent" />
                    <span className="relative w-fit rounded-full bg-white px-3 py-1 text-xs font-medium text-ink/60 shadow-soft">{v.tag}</span>
                    <div className="relative">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-soft transition-transform group-hover:scale-110">
                        <Play size={16} fill="currentColor" />
                      </div>
                      <p className={v.thumbnail ? 'text-sm font-medium text-white' : 'text-sm font-medium text-ink'}>{v.title}</p>
                    </div>
                  </a>
                </StaggerItem>
              ))}
            </Stagger>
          </>
        )}
      </div>
    </div>
  );
}
