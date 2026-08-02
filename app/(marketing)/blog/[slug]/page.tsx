import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { getBlogBySlug } from '@/services/blogs';
import { markdownToHtml } from '@/lib/markdown';
import { ReadingProgress } from '@/components/layout/reading-progress';
import { Reveal } from '@/animations/reveal';
import { SITE } from '@/constants';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogBySlug(params.slug);
  if (!post) return { title: 'Post not found' };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${SITE.url}/blog/${post.slug}`,
      type: 'article',
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = await getBlogBySlug(params.slug);
  if (!post) notFound();

  const contentHtml = await markdownToHtml(post.content);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.createdAt,
    author: { '@type': 'Person', name: SITE.name },
  };

  return (
    <article>
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="border-b border-border bg-gradient-to-b from-primary/[0.06] to-transparent py-16">
        <div className="container max-w-2xl">
          <Reveal>
            <Link href="/blog" className="mb-8 inline-flex items-center gap-1 text-sm text-ink/50 hover:text-primary">
              <ArrowLeft size={14} /> All posts
            </Link>
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{post.category}</span>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-ink md:text-5xl">{post.title}</h1>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent font-heading text-sm font-semibold text-white">
                {SITE.name.charAt(0)}
              </div>
              <div className="text-sm">
                <div className="font-medium text-ink">{SITE.name}</div>
                <div className="flex items-center gap-3 text-xs text-ink/40">
                  <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {post.readingTime}</span>
                </div>
              </div>
            </div>
            {post.coverImage && (
              <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl border border-border bg-muted shadow-lift">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  priority
                  sizes="(min-width: 768px) 672px, 100vw"
                  className="object-cover"
                />
              </div>
            )}
          </Reveal>
        </div>
      </div>

      <div className="container max-w-2xl py-16">
        <Reveal className="prose-custom">
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </Reveal>

        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-8">
            {post.tags.map((t) => (
              <span key={t} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-ink/60">#{t}</span>
            ))}
          </div>
        )}

        <div className="mt-10 border-t border-border pt-8">
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all">
            <ArrowLeft size={15} /> Back to all posts
          </Link>
        </div>
      </div>
    </article>
  );
}
