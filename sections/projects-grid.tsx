'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react';
import { Project } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Stagger, StaggerItem, Reveal } from '@/animations/reveal';
import { cn } from '@/lib/utils';

const GRADIENTS = [
  'from-primary/15 to-accent/10', 'from-accent/15 to-primary/10',
  'from-success/15 to-primary/10', 'from-primary/15 to-success/10',
];

export function ProjectsGrid({ projects, categories }: { projects: Project[]; categories: string[] }) {
  const [active, setActive] = useState('All');
  const all = ['All', ...categories];
  const filtered = active === 'All' ? projects : projects.filter((p) => p.category === active);

  return (
    <div>
      <Reveal className="mb-12 flex flex-wrap justify-center gap-2">
        {all.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
              active === c ? 'border-primary bg-primary text-white' : 'border-border text-ink/60 hover:border-primary/50'
            )}
          >
            {c}
          </button>
        ))}
      </Reveal>

      <Stagger className="grid gap-6 md:grid-cols-2">
        {filtered.map((p, i) => (
          <StaggerItem key={p._id}>
            <Link
              href={`/projects/${p.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-soft transition-all hover:-translate-y-1.5 hover:shadow-lift"
            >
              <div className={cn('flex h-28 items-center justify-between bg-gradient-to-br px-6', GRADIENTS[i % GRADIENTS.length])}>
                <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-ink/70 backdrop-blur">{p.category}</span>
                <ArrowUpRight size={20} className="text-ink/30 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
              </div>
              <div className="flex flex-1 flex-col p-7">
                <h3 className="font-heading text-xl font-semibold text-ink">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm text-ink/60">{p.summary}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.techStack.slice(0, 4).map((t) => <Badge key={t}>{t}</Badge>)}
                </div>
                <div className="mt-5 flex items-center gap-4 border-t border-border pt-4 text-xs font-medium text-ink/40">
                  {p.liveUrl && <span className="inline-flex items-center gap-1"><ExternalLink size={12} /> Live demo</span>}
                  {p.githubUrl && <span className="inline-flex items-center gap-1"><Github size={12} /> Source</span>}
                </div>
              </div>
            </Link>
          </StaggerItem>
        ))}
        {!filtered.length && <p className="text-ink/50">No projects in this category yet.</p>}
      </Stagger>
    </div>
  );
}
