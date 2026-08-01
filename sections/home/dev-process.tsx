import { SectionHeading } from '@/components/layout/section-heading';
import { Reveal } from '@/animations/reveal';
import { DEV_PROCESS } from '@/constants';

export function DevProcess() {
  return (
    <section className="relative overflow-hidden bg-dark py-24 text-white">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      <div className="container relative">
        <SectionHeading
          eyebrow="Process"
          title="How I work"
          description="A simple, repeatable process that keeps projects on time and on scope."
          className="[&_h2]:text-white [&_p]:text-white/60"
        />

        <div className="relative grid gap-8 md:grid-cols-5">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent md:block" />
          {DEV_PROCESS.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.1} className="relative flex flex-col items-start">
              <div className="relative z-10 mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-dark font-code text-sm text-primary">
                {step.step}
              </div>
              <h3 className="mb-2 font-heading font-semibold">{step.title}</h3>
              <p className="text-sm text-white/50">{step.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
