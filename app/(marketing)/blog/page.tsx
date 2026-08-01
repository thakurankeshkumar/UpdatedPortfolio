import type { Metadata } from 'next';
import { getBlogs } from '@/services/blogs';
import { getSiteSettings } from '@/services/settings';
import { BlogList } from '@/sections/blog-list';
import { Reveal } from '@/animations/reveal';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Writing on full-stack development, freelancing, and building in public.',
};

export default async function BlogPage() {
  const [posts, settings] = await Promise.all([getBlogs(), getSiteSettings()]);

  return (
    <div className="py-20">
      <div className="container">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            Blog
          </span>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-ink md:text-5xl">{settings.blogPageTitle}</h1>
          <p className="mt-4 text-ink/60">{settings.blogPageSubtitle}</p>
        </Reveal>
        <BlogList posts={posts} />
      </div>
    </div>
  );
}
