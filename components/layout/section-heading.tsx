import { Reveal } from '@/animations/reveal';
import { cn } from '@/lib/utils';

export function SectionHeading({
  eyebrow,
  title,
  description,
  center = true,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={cn('mb-14', center && 'text-center', className)}>
      {eyebrow && (
        <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
          {eyebrow}
        </span>
      )}
      <h2 className="font-heading text-3xl font-bold tracking-tight text-ink md:text-4xl">{title}</h2>
      {description && <p className={cn('mt-4 text-ink/60', center && 'mx-auto max-w-xl')}>{description}</p>}
    </Reveal>
  );
}
