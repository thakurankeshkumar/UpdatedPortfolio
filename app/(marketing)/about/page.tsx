import type { Metadata } from 'next';
import { Reveal } from '@/animations/reveal';
import { SectionHeading } from '@/components/layout/section-heading';
import { getSiteSettings } from '@/services/settings';
import { Target, Rocket } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About',
  description: 'The story behind Ankesh Kumar — B.Tech CSE student, freelance developer, and content creator.',
};

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const timeline = [...(settings.timeline || [])].sort((a, b) => a.order - b.order);

  return (
    <div className="pb-24">
      <section className="py-20">
        <div className="container max-w-3xl">
          <Reveal>
            <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              About
            </span>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-ink md:text-5xl">
              {settings.aboutPageTitle}
            </h1>
          </Reveal>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink/70">
            {(settings.aboutIntro || []).map((p, i) => (
              <Reveal key={i} delay={0.05 * i}><p>{p}</p></Reveal>
            ))}
          </div>
        </div>
      </section>

      {timeline.length > 0 && (
        <section className="bg-white py-20">
          <div className="container max-w-3xl">
            <SectionHeading eyebrow="Journey" title="Timeline" center={false} />
            <div className="relative">
              <div className="absolute bottom-0 left-[15px] top-0 w-px bg-gradient-to-b from-primary via-accent to-transparent md:left-1/2 md:-translate-x-1/2" />
              <div className="space-y-10">
                {timeline.map((t, i) => (
                  <Reveal
                    key={t._id || i}
                    delay={i * 0.08}
                    variant={i % 2 === 0 ? 'slideRight' : 'slideLeft'}
                    className={`relative flex md:items-center ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    <div className="absolute left-0 top-1 z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-primary to-accent shadow-card md:left-1/2 md:-translate-x-1/2">
                      <span className="h-2 w-2 rounded-full bg-white" />
                    </div>
                    <div className={`ml-12 flex-1 md:ml-0 ${i % 2 === 0 ? 'md:pr-14 md:text-right' : 'md:pl-14'}`}>
                      <span className="font-code text-xs text-primary">{t.year}</span>
                      <h3 className="mt-1 font-heading font-semibold text-ink">{t.title}</h3>
                      <p className="mt-1 text-sm text-ink/60">{t.description}</p>
                    </div>
                    <div className="hidden flex-1 md:block" />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-20">
        <div className="container grid max-w-3xl gap-6 md:grid-cols-2">
          <Reveal className="rounded-2xl border border-border bg-white p-8 shadow-soft">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Target size={20} /></div>
            <h3 className="font-heading text-lg font-semibold text-ink">Current Focus</h3>
            <p className="mt-3 text-sm text-ink/60">{settings.currentFocus}</p>
          </Reveal>
          <Reveal delay={0.1} className="rounded-2xl border border-border bg-white p-8 shadow-soft">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent"><Rocket size={20} /></div>
            <h3 className="font-heading text-lg font-semibold text-ink">Future Vision</h3>
            <p className="mt-3 text-sm text-ink/60">{settings.futureVision}</p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
