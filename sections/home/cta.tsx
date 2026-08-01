'use client';
import Link from 'next/link';
import { ArrowRight, Plus, Minus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/animations/reveal';
import { SectionHeading } from '@/components/layout/section-heading';
import { FAQ } from '@/constants';
import * as React from 'react';

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Reveal delay={index * 0.05} className="overflow-hidden rounded-2xl border border-border bg-white">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-4 p-5 text-left">
        <span className="flex items-start gap-3">
          <span className="font-code text-xs text-primary/50">{String(index + 1).padStart(2, '0')}</span>
          <span className="font-medium text-ink">{q}</span>
        </span>
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${open ? 'bg-primary text-white' : 'bg-muted text-ink/50'}`}>
          {open ? <Minus size={14} /> : <Plus size={14} />}
        </span>
      </button>
      {open && <p className="px-5 pb-5 pl-12 text-sm text-ink/60">{a}</p>}
    </Reveal>
  );
}

export function CTA() {
  return (
    <>
      <section className="py-20">
        <div className="container max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Common questions" center />
          <div className="space-y-3">
            {FAQ.map((f, i) => <FaqItem key={f.q} index={i} {...f} />)}
          </div>
        </div>
      </section>

      <section className="pb-8 pt-4">
        <div className="container">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-dark px-8 py-20 text-center text-white md:px-16">
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 blur-[110px]" />
              <div className="relative">
                <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-white/60">
                  <Sparkles size={13} className="text-accent" /> Currently taking new projects
                </span>
                <h2 className="font-heading text-3xl font-bold md:text-5xl">Got a project in mind?</h2>
                <p className="mx-auto mt-4 max-w-md text-white/60">
                  Let&apos;s talk about what you&apos;re building — I usually reply within a day or two.
                </p>
                <Button asChild variant="primary" size="lg" magnetic className="mt-8">
                  <Link href="/contact">Start a project <ArrowRight size={16} /></Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
