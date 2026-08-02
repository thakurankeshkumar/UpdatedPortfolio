'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Clock, ArrowUpRight } from 'lucide-react';
import { BlogPost } from '@/types';
import { Stagger, StaggerItem, Reveal } from '@/animations/reveal';
import { Input } from '@/components/ui/input';

export function BlogList({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState('');
  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div>
      <Reveal className="mx-auto mb-12 max-w-md">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" />
          <Input placeholder="Search posts or tags..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10" />
        </div>
      </Reveal>

      <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <StaggerItem key={post._id}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-soft transition-all hover:-translate-y-1.5 hover:shadow-lift"
            >
              <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <span className="font-heading text-3xl font-bold text-ink/10">{post.category?.slice(0, 2).toUpperCase()}</span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">{post.category}</span>
                <h3 className="mt-3 font-heading text-lg font-semibold text-ink group-hover:text-primary">{post.title}</h3>
                <p className="mt-2 flex-1 text-sm text-ink/60 line-clamp-3">{post.excerpt}</p>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-ink/40">
                  <span className="flex items-center gap-1"><Clock size={12} /> {post.readingTime}</span>
                  <ArrowUpRight size={15} className="transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                </div>
              </div>
            </Link>
          </StaggerItem>
        ))}
        {!filtered.length && <p className="text-ink/50">No posts match your search.</p>}
      </Stagger>
    </div>
  );
}
