import Link from 'next/link';
import * as Icons from 'lucide-react';
import { ArrowRight, Check, ArrowUpRight } from 'lucide-react';
import { Service } from '@/types';
import { SectionHeading } from '@/components/layout/section-heading';
import { Stagger, StaggerItem } from '@/animations/reveal';

export function ServicesPreview({ services }: { services: Service[] }) {
  return (
    <section className="py-24">
      <div className="container">
        <SectionHeading
          eyebrow="Services"
          title="What I can build for you"
          description="From a landing page to a full SaaS backend — production-ready, not a prototype."
        />
        <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((s) => {
            const Icon = (Icons as any)[s.icon] || Icons.Code2;
            return (
              <StaggerItem key={s._id}>
                <Link
                  href="/services"
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white p-7 shadow-soft transition-all hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-lift"
                >
                  <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-primary to-accent transition-transform duration-300 group-hover:scale-x-100" />

                  <div className="mb-5 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary transition-colors group-hover:from-primary group-hover:to-accent group-hover:text-white">
                      <Icon size={20} />
                    </div>
                    <ArrowUpRight size={18} className="text-ink/20 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                  </div>

                  <h3 className="font-heading text-lg font-semibold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm text-ink/60">{s.description}</p>

                  {s.features?.length > 0 && (
                    <ul className="mt-4 space-y-1.5">
                      {s.features.slice(0, 2).map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-ink/50">
                          <Check size={12} className="shrink-0 text-success" /> {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-auto flex items-center justify-between pt-6">
                    <span className="text-sm font-semibold text-primary">From {s.startingPrice}</span>
                    <span className="text-xs text-ink/40">{s.timeline}</span>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
        <div className="mt-10 text-center">
          <Link href="/services" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all">
            View all services <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
