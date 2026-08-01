import type { Metadata } from 'next';
import { Download, Briefcase, GraduationCap, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal, Stagger, StaggerItem } from '@/animations/reveal';
import { getSiteSettings } from '@/services/settings';
import { SITE } from '@/constants';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Education, skills, and experience — Ankesh Kumar.',
};

export default async function ResumePage() {
  const settings = await getSiteSettings();
  const experience = [...(settings.experience || [])].sort((a, b) => a.order - b.order);
  const education = [...(settings.education || [])].sort((a, b) => a.order - b.order);
  const hasDownload = !!settings.resumeDownloadUrl;

  return (
    <div className="py-20">
      <div className="container grid gap-12 lg:grid-cols-[320px_1fr]">
        <Reveal variant="slideLeft">
          <div className="sticky top-28 rounded-3xl border border-border bg-white p-8 shadow-soft">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent font-heading text-2xl font-bold text-white">
              {settings.siteName?.charAt(0) || 'A'}
            </div>
            <h1 className="mt-5 font-heading text-2xl font-bold text-ink">{settings.siteName}</h1>
            <p className="mt-1 text-sm text-ink/60">{settings.resumeSummary}</p>

            {hasDownload ? (
              <Button asChild variant="primary" className="mt-6 w-full">
                <a href={settings.resumeDownloadUrl} download target="_blank" rel="noreferrer">Download CV <Download size={16} /></a>
              </Button>
            ) : (
              <Button asChild variant="outline" className="mt-6 w-full">
                <a href={`mailto:${SITE.email}`}>Request CV <Mail size={16} /></a>
              </Button>
            )}

            {settings.resumeSkills?.length > 0 && (
              <div className="mt-8 border-t border-border pt-6">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink/40">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {settings.resumeSkills.map((s) => (
                    <span key={s} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-ink/70">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Reveal>

        <div>
          {experience.length > 0 && (
            <Reveal className="mb-12">
              <div className="mb-6 flex items-center gap-2">
                <Briefcase size={18} className="text-primary" />
                <h2 className="font-heading text-xl font-semibold text-ink">Experience</h2>
              </div>
              <Stagger className="relative space-y-6 border-l border-border pl-8">
                {experience.map((e) => (
                  <StaggerItem key={e._id} className="relative">
                    <span className="absolute -left-[calc(2rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/10" />
                    <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-heading font-semibold text-ink">{e.role}</h3>
                        <span className="text-xs text-ink/40">{e.period}</span>
                      </div>
                      <p className="mt-2 text-sm text-ink/60">{e.description}</p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </Reveal>
          )}

          {education.length > 0 && (
            <Reveal>
              <div className="mb-6 flex items-center gap-2">
                <GraduationCap size={18} className="text-accent" />
                <h2 className="font-heading text-xl font-semibold text-ink">Education</h2>
              </div>
              <div className="space-y-4">
                {education.map((ed) => (
                  <div key={ed._id} className="rounded-2xl border border-border bg-white p-6 shadow-soft">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-heading font-semibold text-ink">{ed.school}</h3>
                      <span className="text-xs text-ink/40">{ed.period}</span>
                    </div>
                    <p className="mt-2 text-sm text-ink/60">{ed.degree}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
}
