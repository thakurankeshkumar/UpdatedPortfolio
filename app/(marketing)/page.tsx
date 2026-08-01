import { Hero } from '@/sections/home/hero';
import { TechMarquee } from '@/sections/home/tech-marquee';
import { ServicesPreview } from '@/sections/home/services-preview';
import { Skills } from '@/sections/home/skills';
import { FeaturedProjects } from '@/sections/home/featured-projects';
import { DevProcess } from '@/sections/home/dev-process';
import { Testimonials } from '@/sections/home/testimonials';
import { ContentCreatorPreview } from '@/sections/home/content-creator-preview';
import { LatestBlogs } from '@/sections/home/latest-blogs';
import { CTA } from '@/sections/home/cta';
import { getProjects } from '@/services/projects';
import { getServices } from '@/services/services';
import { getTestimonials } from '@/services/testimonials';
import { getBlogs } from '@/services/blogs';
import { getSiteSettings } from '@/services/settings';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [projects, services, testimonials, blogs, settings] = await Promise.all([
    getProjects(),
    getServices(),
    getTestimonials(),
    getBlogs(),
    getSiteSettings(),
  ]);

  return (
    <>
      <Hero badge={settings.heroBadge} headline={settings.heroHeadline} subheadline={settings.heroSubheadline} />
      <TechMarquee />
      <ServicesPreview services={services} />
      <Skills />
      <FeaturedProjects projects={projects} />
      <DevProcess />
      <Testimonials testimonials={testimonials} />
      <ContentCreatorPreview platforms={settings.platforms} videos={settings.videos} />
      <LatestBlogs posts={blogs} />
      <CTA />
    </>
  );
}
