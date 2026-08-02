import Link from 'next/link';
import Image from 'next/image';
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
            className="group relative flex min-h-[360px] flex-col justify-end overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-dark to-[#1a2540] p-8 text-white shadow-lift md:p-10"
          >
            {hero.coverImage && (
              <Image
                src={hero.coverImage}
                alt={hero.title}
                fill
                sizes="(min-width: 1024px) 1100px, 100vw"
                className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-dark/95 via-dark/70 to-dark/20" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-dark/95 to-transparent" />
            <div className="relative max-w-2xl">
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
            {!hero.coverImage && (
              <div className="absolute right-10 top-1/2 hidden -translate-y-1/2 lg:block">
                <div className="flex h-48 w-72 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] font-heading text-5xl font-bold text-white/10">
                {hero.title.slice(0, 2).toUpperCase()}
                </div>
              </div>
            )}
          </Link>
        </Reveal>

        {rest.length > 0 && (
          <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <StaggerItem key={p._id}>
                <Link
                  href={`/projects/${p.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
                >
                  <div className="relative h-32 bg-gradient-to-br from-primary/10 to-accent/10">
                    {p.coverImage ? (
                      <Image src={p.coverImage} alt={p.title} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <span className="flex h-full items-center justify-center font-heading text-3xl font-bold text-ink/10">{p.title.slice(0, 2).toUpperCase()}</span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                    <ArrowUpRight size={16} className="absolute right-4 top-4 text-white/80 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="mb-3 w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium text-ink/60">{p.category}</span>
                    <h3 className="font-heading font-semibold text-ink">{p.title}</h3>
                    <p className="mt-2 line-clamp-2 flex-1 text-sm text-ink/60">{p.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.techStack.slice(0, 3).map((t) => <Badge key={t}>{t}</Badge>)}
                    </div>
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
