import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Github, ExternalLink, ArrowLeft } from 'lucide-react';
import { getProjectBySlug } from '@/services/projects';
import { markdownToHtml } from '@/lib/markdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/animations/reveal';
import { SITE } from '@/constants';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: 'Project not found' };
  return {
    title: project.title,
    description: project.summary,
    openGraph: { title: project.title, description: project.summary, url: `${SITE.url}/projects/${project.slug}` },
  };
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const descriptionHtml = await markdownToHtml(project.description);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary,
    author: { '@type': 'Person', name: SITE.name },
  };

  return (
    <article className="py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container max-w-3xl">
        <Reveal>
          <Link href="/projects" className="mb-8 inline-flex items-center gap-1 text-sm text-ink/50 hover:text-primary">
            <ArrowLeft size={14} /> All projects
          </Link>
          <span className="mb-3 inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-ink/60">{project.category}</span>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-ink md:text-5xl">{project.title}</h1>
          <p className="mt-4 text-lg text-ink/60">{project.summary}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.techStack.map((t) => <Badge key={t}>{t}</Badge>)}
          </div>

          <div className="mt-8 flex gap-3">
            {project.liveUrl && (
              <Button asChild variant="primary">
                <a href={project.liveUrl} target="_blank" rel="noreferrer">Live Demo <ExternalLink size={14} /></a>
              </Button>
            )}
            {project.githubUrl && (
              <Button asChild variant="outline">
                <a href={project.githubUrl} target="_blank" rel="noreferrer">GitHub <Github size={14} /></a>
              </Button>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="prose-custom mt-14 border-t border-border pt-10" >
          <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
        </Reveal>

        {(project.challenges || project.solutions) && (
          <Reveal delay={0.15} className="mt-10 grid gap-6 md:grid-cols-2">
            {project.challenges && (
              <div className="rounded-2xl border border-border p-6">
                <h3 className="font-heading font-semibold text-ink">Challenge</h3>
                <p className="mt-2 text-sm text-ink/60">{project.challenges}</p>
              </div>
            )}
            {project.solutions && (
              <div className="rounded-2xl border border-border p-6">
                <h3 className="font-heading font-semibold text-ink">Solution</h3>
                <p className="mt-2 text-sm text-ink/60">{project.solutions}</p>
              </div>
            )}
          </Reveal>
        )}
      </div>
    </article>
  );
}
