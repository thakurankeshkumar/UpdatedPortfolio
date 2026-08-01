import Link from 'next/link';
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react';
import { Project } from '@/types';
import { SectionHeading } from '@/components/layout/section-heading';
import { Badge } from '@/components/ui/badge';
import { Reveal, Stagger, StaggerItem } from '@/animations/reveal';

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  const featured = projects.filter((p) => p.featured);
  const list = (featured.length ? featured : projects).slice(0, 5);
  const [hero, ...rest] = list;

  if (!hero) return null;

  return (
    <section className="py-24">
      <div className="container">
        <SectionHeading eyebrow="Work" title="Featured projects" description="A few things I've shipped recently." />

        <Reveal className="mb-6">
          <Link
            href={`/projects/${hero.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-dark to-[#1a2540] p-10 text-white shadow-lift lg:flex-row lg:items-center lg:gap-10"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/30 blur-[100px] transition-transform duration-500 group-hover:scale-125" />
            <div className="relative flex-1">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">{hero.category} · Featured</span>
              <h3 className="mt-4 font-heading text-3xl font-bold md:text-4xl">{hero.title}</h3>
              <p className="mt-3 max-w-lg text-white/60">{hero.summary}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {hero.techStack.slice(0, 5).map((t) => (
                  <span key={t} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">{t}</span>
                ))}
              </div>
              <div className="mt-7 flex items-center gap-4 text-sm font-medium">
                <span className="inline-flex items-center gap-1.5 text-primary">
                  View case study <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
                {hero.liveUrl && <span className="inline-flex items-center gap-1 text-white/40"><ExternalLink size={13} /> Live</span>}
                {hero.githubUrl && <span className="inline-flex items-center gap-1 text-white/40"><Github size={13} /> Source</span>}
              </div>
            </div>
            <div className="relative hidden shrink-0 lg:block">
              <div className="flex h-48 w-72 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] font-heading text-5xl font-bold text-white/10">
                {hero.title.slice(0, 2).toUpperCase()}
              </div>
            </div>
          </Link>
        </Reveal>

        {rest.length > 0 && (
          <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <StaggerItem key={p._id}>
                <Link
                  href={`/projects/${p.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-ink/60">{p.category}</span>
                    <ArrowUpRight size={16} className="text-ink/30 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-ink">{p.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-ink/60">{p.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.techStack.slice(0, 3).map((t) => <Badge key={t}>{t}</Badge>)}
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        )}

        <div className="mt-10 text-center">
          <Link href="/projects" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all">
            View all projects <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
