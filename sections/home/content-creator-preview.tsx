import Link from 'next/link';
import Image from 'next/image';
import * as Icons from 'lucide-react';
import { ArrowRight, Play } from 'lucide-react';
import { Reveal } from '@/animations/reveal';
import { VideoItem, PlatformItem } from '@/types/settings';

export function ContentCreatorPreview({ platforms, videos }: { platforms?: PlatformItem[]; videos?: VideoItem[] }) {
  const shorts = (videos?.length ? videos : [
    { title: 'Short #1', tag: 'Tutorial' }, { title: 'Short #2', tag: 'Short' },
    { title: 'Short #3', tag: 'Explainer' }, { title: 'Short #4', tag: 'Story' },
  ]).slice(0, 4);
  const socials = platforms?.length ? platforms : [
    { name: 'YouTube', icon: 'Youtube', href: '#' }, { name: 'Instagram', icon: 'Instagram', href: '#' }, { name: 'LinkedIn', icon: 'Linkedin', href: '#' },
  ];

  return (
    <section className="overflow-hidden py-24">
      <div className="container grid items-center gap-14 lg:grid-cols-2">
        <Reveal variant="slideLeft">
          <span className="mb-3 inline-block rounded-full bg-accent/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
            Content Creator
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-ink md:text-4xl">
            I also teach what I build
          </h2>
          <p className="mt-4 max-w-md text-ink/60">
            Short-form dev content, build breakdowns, and lessons from turning coursework into shipped
            products — for developers who want to learn by watching something get built.
          </p>
          <div className="mt-7 flex gap-3">
            {socials.map((s: any) => {
              const Icon = (Icons as any)[s.icon] || Icons.Globe;
              return (
                <a key={s.name} href={s.href} target="_blank" rel="noreferrer" className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border text-ink/60 transition-colors hover:border-accent hover:bg-accent hover:text-white">
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
          <Link href="/content-creator" className="mt-7 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all">
            See the content hub <ArrowRight size={16} />
          </Link>
        </Reveal>

        <Reveal variant="slideRight" className="grid grid-cols-2 gap-4">
          {shorts.map((v: any, i: number) => (
            <div
              key={v.title}
              className={`group relative aspect-[9/13] overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/15 via-accent/10 to-transparent p-4 transition-transform hover:-translate-y-1 ${i % 2 === 1 ? 'mt-6' : ''}`}
            >
              {v.thumbnail && (
                <Image
                  src={v.thumbnail}
                  alt={v.title}
                  fill
                  sizes="(min-width: 1024px) 260px, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-dark/75 via-transparent to-transparent" />
              <span className="relative inline-block rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-ink/60 shadow-soft">{v.tag}</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-primary shadow-lift transition-transform group-hover:scale-110">
                  <Play size={18} fill="currentColor" />
                </div>
              </div>
              <span className={`absolute bottom-4 left-4 right-4 line-clamp-2 text-xs font-medium ${v.thumbnail ? 'text-white' : 'text-ink/70'}`}>{v.title}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
