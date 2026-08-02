import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, Clock } from 'lucide-react';
import { BlogPost } from '@/types';
import { SectionHeading } from '@/components/layout/section-heading';
import { Stagger, StaggerItem } from '@/animations/reveal';

export function LatestBlogs({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="bg-white py-24">
      <div className="container">
        <SectionHeading eyebrow="Blog" title="Latest writing" />
        <Stagger className="grid gap-6 md:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <StaggerItem key={post._id}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-soft transition-all hover:-translate-y-1.5 hover:shadow-lift"
              >
                <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                  {post.coverImage ? (
                    <Image src={post.coverImage} alt={post.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <span className="font-heading text-3xl font-bold text-ink/10">{post.category?.slice(0, 2).toUpperCase()}</span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">{post.category}</span>
                  <h3 className="mt-3 font-heading text-lg font-semibold text-ink transition-colors group-hover:text-primary">{post.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-ink/60 line-clamp-2">{post.excerpt}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-ink/40">
                    <span className="flex items-center gap-1"><Clock size={12} /> {post.readingTime}</span>
                    <ArrowUpRight size={15} className="text-ink/30 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
        <div className="mt-10 text-center">
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all">
            Read all posts <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
