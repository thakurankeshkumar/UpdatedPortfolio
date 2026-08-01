import type { Metadata } from 'next';
import { getProjects } from '@/services/projects';
import { getSiteSettings } from '@/services/settings';
import { ProjectsGrid } from '@/sections/projects-grid';
import { Reveal } from '@/animations/reveal';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'A collection of full-stack apps, AI tools, and academic projects built by Ankesh Kumar.',
};

export default async function ProjectsPage() {
  const [projects, settings] = await Promise.all([getProjects(), getSiteSettings()]);
  const categories = settings.projectCategories?.length ? settings.projectCategories : ['Web App', 'SaaS', 'API', 'Landing Page', 'Tool'];

  return (
    <div className="py-20">
      <div className="container">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            Work
          </span>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-ink md:text-5xl">{settings.projectsPageTitle}</h1>
          <p className="mt-4 text-ink/60">{settings.projectsPageSubtitle}</p>
        </Reveal>
        <ProjectsGrid projects={projects} categories={categories} />
      </div>
    </div>
  );
}
