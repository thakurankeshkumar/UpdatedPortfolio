import Image from 'next/image';
import { Star, Quote } from 'lucide-react';
import { Testimonial } from '@/types';
import { SectionHeading } from '@/components/layout/section-heading';
import { Stagger, StaggerItem } from '@/animations/reveal';

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="bg-white py-24">
      <div className="container">
        <SectionHeading eyebrow="Testimonials" title="What clients say" />
        <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <StaggerItem key={t._id}>
              <div
                className={`group relative flex h-full flex-col rounded-3xl border border-border bg-white p-7 shadow-soft transition-all hover:-translate-y-1.5 hover:shadow-lift hover:rotate-0 ${i % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}
              >
                <Quote size={32} className="mb-3 text-primary/15" fill="currentColor" />
                <p className="flex-1 text-[15px] leading-relaxed text-ink/70">&ldquo;{t.quote}&rdquo;</p>

                <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-accent font-heading text-sm font-semibold text-white">
                      {t.avatar ? (
                        <Image src={t.avatar} alt={t.name} fill sizes="44px" className="object-cover" />
                      ) : (
                        t.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-ink">{t.name}</div>
                      <div className="text-xs text-ink/50">{t.role}{t.company ? ` · ${t.company}` : ''}</div>
                    </div>
                  </div>
                  <div className="flex gap-0.5 text-primary">
                    {Array.from({ length: t.rating }).map((_, idx) => <Star key={idx} size={12} fill="currentColor" />)}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
