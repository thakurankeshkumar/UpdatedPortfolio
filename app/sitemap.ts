import type { MetadataRoute } from 'next';
import { SITE } from '@/constants';
import { getProjects } from '@/services/projects';
import { getBlogs } from '@/services/blogs';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['', '/about', '/projects', '/services', '/blog', '/content-creator', '/resume', '/contact', '/privacy', '/terms'].map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified: new Date(),
  }));

  const [projects, blogs] = await Promise.all([getProjects(), getBlogs()]);

  const projectRoutes = projects.map((p) => ({ url: `${SITE.url}/projects/${p.slug}`, lastModified: new Date(p.createdAt) }));
  const blogRoutes = blogs.map((b) => ({ url: `${SITE.url}/blog/${b.slug}`, lastModified: new Date(b.createdAt) }));

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
