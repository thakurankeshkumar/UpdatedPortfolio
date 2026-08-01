import { TECH_STACK } from '@/constants';

export function TechMarquee() {
  const items = [...TECH_STACK, ...TECH_STACK];
  return (
    <section className="border-y border-border bg-white py-8">
      <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-ink/40">
        Technologies I build with
      </p>
      <div className="overflow-hidden">
        <div className="flex w-max animate-marquee gap-12">
          {items.map((tech, i) => (
            <span key={i} className="whitespace-nowrap font-heading text-lg font-medium text-ink/30">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
