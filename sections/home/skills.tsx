'use client';
import { useState } from 'react';
import * as Icons from 'lucide-react';
import { SectionHeading } from '@/components/layout/section-heading';
import { Reveal } from '@/animations/reveal';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const SKILL_GROUPS = [
  { group: 'Frontend', icon: 'MonitorSmartphone', color: 'from-primary to-blue-400', skills: ['Next.js', 'React', 'TypeScript', 'TailwindCSS', 'Framer Motion'] },
  { group: 'Backend', icon: 'ServerCog', color: 'from-accent to-purple-400', skills: ['Node.js', 'Express', 'REST APIs', 'JWT Auth'] },
  { group: 'Database & Cloud', icon: 'Database', color: 'from-emerald-500 to-success', skills: ['MongoDB', 'Mongoose', 'Cloudinary', 'Vercel'] },
  { group: 'Core CS & Tools', icon: 'Terminal', color: 'from-orange-500 to-amber-400', skills: ['DSA', 'Operating Systems', 'Git/GitHub', 'Postman'] },
];

function Orbit({ group, icon, color, skills, active, onClick }: any) {
  const Icon = (Icons as any)[icon] || Icons.Code2;
  const n = skills.length;

  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative flex aspect-square w-full flex-col items-center justify-center rounded-3xl border p-6 transition-all',
        active ? 'border-primary/40 bg-primary/[0.03] shadow-lift' : 'border-border bg-white hover:border-primary/20'
      )}
    >
      <div className="relative flex h-[75%] w-[75%] items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-dashed border-border" />
        <motion.div
          animate={{ rotate: active ? 360 : 0 }}
          transition={{ duration: 30, repeat: active ? Infinity : 0, ease: 'linear' }}
          className="absolute inset-0"
        >
          {skills.map((s: string, i: number) => {
            const angle = (360 / n) * i - 90;
            const rad = (angle * Math.PI) / 180;
            const radius = 48;
            const x = 50 + radius * Math.cos(rad);
            const y = 50 + radius * Math.sin(rad);
            return (
              <motion.div
                key={s}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                style={{ left: `${x}%`, top: `${y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
              >
                <motion.div
                  animate={{ rotate: active ? -360 : 0 }}
                  transition={{ duration: 30, repeat: active ? Infinity : 0, ease: 'linear' }}
                  className={cn(
                    'whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-semibold shadow-soft',
                    active ? 'border-primary/30 bg-white text-ink' : 'border-border bg-muted text-ink/60'
                  )}
                >
                  {s}
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className={cn('flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-card', color)}>
          <Icon size={22} />
        </div>
      </div>
      <span className="mt-4 font-heading text-sm font-semibold text-ink">{group}</span>
      <span className="text-[11px] text-ink/40">{n} skills</span>
    </button>
  );
}

export function Skills() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-white py-24">
      <div className="container">
        <SectionHeading eyebrow="Skills" title="The stack behind the work" description="Click a category to bring its skills into orbit." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SKILL_GROUPS.map((g, i) => (
            <Reveal key={g.group} delay={i * 0.08} variant="scale">
              <Orbit {...g} active={active === i} onClick={() => setActive(i)} />
            </Reveal>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-border bg-muted/50 p-5"
          >
            <span className="mr-2 text-xs font-semibold uppercase tracking-widest text-ink/40">{SKILL_GROUPS[active].group}:</span>
            {SKILL_GROUPS[active].skills.map((s) => (
              <span key={s} className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-ink shadow-soft">{s}</span>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
