'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Counter } from '@/animations/counter';
import { STATS } from '@/constants';

const CODE_LINES = [
  { t: 'const', c: 'text-accent' },
  { t: ' developer ', c: 'text-ink' },
  { t: '=', c: 'text-ink/50' },
  { t: ' {', c: 'text-ink/50' },
];

export function Hero({ badge, headline, subheadline }: { badge?: string; headline?: string; subheadline?: string }) {
  const [line1, line2, line3] = (headline || 'Software Developer. Freelancer. Content Creator.').split('. ');

  return (
    <section className="relative overflow-hidden pb-20 pt-16 md:pt-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[110px]" />
        <div className="absolute right-[-5%] top-40 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[100px]" />
      </div>

      <div className="container grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-sm text-ink/60 shadow-soft"
          >
            <span className="h-2 w-2 rounded-full bg-success" /> {badge || 'Available for freelance work'}
          </motion.div>

          <h1 className="font-heading text-5xl font-bold leading-[1.08] tracking-tight text-ink md:text-6xl">
            {[line1, line2, line3].filter(Boolean).map((line, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                className={i === 1 ? 'block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent' : 'block'}
              >
                {line}.
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 max-w-lg text-lg text-ink/60"
          >
            {subheadline || 'I build scalable web applications, modern APIs and digital experiences — while documenting everything I learn along the way.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Button asChild variant="primary" size="lg" magnetic>
              <Link href="/contact">Hire Me <ArrowRight size={16} /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" magnetic>
              <Link href="/projects">View Projects</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-14 flex max-w-md gap-10"
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-heading text-3xl font-bold text-ink">
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-1 text-xs text-ink/50">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative hidden lg:block"
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl" />
          <div className="relative rounded-2xl border border-border bg-white shadow-lift">
            <div className="flex items-center gap-1.5 border-b border-border px-5 py-3.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-3 font-code text-xs text-ink/40">profile.ts</span>
            </div>
            <div className="space-y-2.5 p-6 font-code text-sm">
              <div><span className="text-accent">const</span> <span className="text-ink">developer</span> <span className="text-ink/40">=</span> <span className="text-ink/40">{'{'}</span></div>
              <div className="pl-4"><span className="text-primary">name</span><span className="text-ink/40">:</span> <span className="text-success">&apos;Ankesh Kumar&apos;</span>,</div>
              <div className="pl-4"><span className="text-primary">stack</span><span className="text-ink/40">:</span> <span className="text-ink/40">[</span><span className="text-success">&apos;Next.js&apos;</span>, <span className="text-success">&apos;Node&apos;</span>, <span className="text-success">&apos;MongoDB&apos;</span><span className="text-ink/40">]</span>,</div>
              <div className="pl-4"><span className="text-primary">status</span><span className="text-ink/40">:</span> <span className="text-success">&apos;shipping&apos;</span>,</div>
              <div className="pl-4"><span className="text-primary">available</span><span className="text-ink/40">:</span> <span className="text-accent">true</span>,</div>
              <div><span className="text-ink/40">{'}'}</span></div>
            </div>
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-6 -top-6 flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 shadow-card"
          >
            <Sparkles size={14} className="text-accent" />
            <span className="text-xs font-medium text-ink">AI-powered tools</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
