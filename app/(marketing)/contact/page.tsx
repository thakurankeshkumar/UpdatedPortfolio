'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Mail, MapPin, Clock, ArrowRight, Radio, Sparkles } from 'lucide-react';
import { Input, Textarea, Label } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { Reveal } from '@/animations/reveal';
import { SITE } from '@/constants';

const schema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Enter a valid email'),
  company: z.string().optional(),
  budget: z.string().optional(),
  projectType: z.string().optional(),
  message: z.string().min(10, 'Tell me a bit more about the project'),
});
type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const { show } = useToast();
  const router = useRouter();
  const [maintenance, setMaintenance] = useState<any>(null);
  const {
    register, handleSubmit, getValues,
    formState: { errors, isSubmitting }, reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    fetch('/api/maintenance-status', { cache: 'no-store' })
      .then((response) => response.json())
      .then(setMaintenance)
      .catch(() => setMaintenance({ maintenanceMode: false }));
  }, []);

  async function onSubmit(data: FormData) {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      show('Message sent! I\u2019ll get back to you within a day or two.');
      reset();
    } catch {
      show('Something went wrong sending your message. Try again?', 'error');
    }
  }

  // Hidden admin entry point: type the site's access code into the Name field,
  // leave everything else empty, and submit. Wrong code (or any other field filled)
  // just behaves like a normal contact form. The code itself is set in
  // /admin/dashboard/settings, not hardcoded here.
  async function handleFormSubmit(e: React.FormEvent) {
    const values = getValues();
    const onlyNameFilled =
      !!values.name?.trim() &&
      !values.email?.trim() &&
      !values.company?.trim() &&
      !values.budget?.trim() &&
      !values.projectType?.trim() &&
      !values.message?.trim();

    if (onlyNameFilled) {
      e.preventDefault();
      try {
        const res = await fetch('/api/auth/check-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: values.name.trim() }),
        });
        const data = await res.json();
        if (data.match) {
          router.push('/admin/login');
          return;
        }
      } catch {
        /* fall through to normal validation below */
      }
      // Wrong code: proceed exactly like a normal submit attempt (will show
      // the usual required-field errors since email/message are blank).
      handleSubmit(onSubmit)();
      return;
    }
    handleSubmit(onSubmit)(e);
  }

  if (maintenance === null) {
    return <div className="container py-20 text-center text-sm text-ink/50">Loading…</div>;
  }

  const maintenanceMode = maintenance.maintenanceMode === true;
  const accent = maintenance.accent === 'cyan'
    ? 'from-cyan-400 via-blue-500 to-indigo-600'
    : maintenance.accent === 'rose'
      ? 'from-rose-500 via-orange-400 to-amber-400'
      : 'from-violet-500 via-fuchsia-500 to-pink-500';
  const progress = Math.min(100, Math.max(0, Number(maintenance.progress) || 0));

  if (maintenanceMode) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#09090f] px-4 py-8 text-white sm:px-6">
        <div className={`absolute -left-28 top-[-10rem] h-80 w-80 rounded-full bg-gradient-to-br ${accent} opacity-25 blur-3xl`} />
        <div className={`absolute -bottom-28 -right-20 h-96 w-96 rounded-full bg-gradient-to-br ${accent} opacity-20 blur-3xl`} />
        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <section>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/70 backdrop-blur"><Radio size={13} className="animate-pulse text-emerald-300" /> System upgrade in progress</div>
            <div className={`mt-6 h-1.5 w-20 rounded-full bg-gradient-to-r ${accent}`} />
            <h1 className="mt-6 max-w-xl font-heading text-4xl font-bold leading-tight tracking-tight sm:text-6xl">{maintenance.title || 'We are building something sharper.'}</h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/60 sm:text-lg">{maintenance.message || 'We are making a few improvements and will be back shortly.'}</p>
            {maintenance.showProgress !== false ? (
              <div className="mt-9 max-w-md">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                  <span>Build status</span>
                  <span>{progress}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${accent} transition-all duration-700`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : null}
            {maintenance.expectedReturn && <p className="mt-5 flex items-center gap-2 text-sm font-medium text-white/70"><Sparkles size={15} className="text-white" /> {maintenance.expectedReturn}</p>}
          </section>

          <section className="rounded-3xl border border-white/15 bg-white/[0.08] p-5 shadow-2xl backdrop-blur-xl sm:p-7">
            <p className="text-sm font-semibold text-white">Send a message</p>
            <p className="mt-1 text-sm leading-relaxed text-white/45">Need to reach us? Your message will still get through.</p>
            <form onSubmit={handleFormSubmit} noValidate className="mt-6 space-y-4">
              <div><Label htmlFor="name" className="text-white/75">Name *</Label><Input id="name" {...register('name')} placeholder="Your name" className="mt-1 border-white/10 bg-white/5 text-white placeholder:text-white/25" />{errors.name && <p className="mt-1 text-xs text-rose-300">{errors.name.message}</p>}</div>
              <div><Label htmlFor="email" className="text-white/75">Email *</Label><Input id="email" {...register('email')} placeholder="you@email.com" className="mt-1 border-white/10 bg-white/5 text-white placeholder:text-white/25" />{errors.email && <p className="mt-1 text-xs text-rose-300">{errors.email.message}</p>}</div>
              <div><Label htmlFor="message" className="text-white/75">Message *</Label><Textarea id="message" {...register('message')} placeholder="How can we help?" className="mt-1 border-white/10 bg-white/5 text-white placeholder:text-white/25" />{errors.message && <p className="mt-1 text-xs text-rose-300">{errors.message.message}</p>}</div>
              <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className={`w-full bg-gradient-to-r ${accent} border-0 text-white hover:opacity-90`}>{isSubmitting ? 'Sending...' : <>Transmit message <ArrowRight size={16} /></>}</Button>
            </form>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20">
      <div className={`container grid gap-16 ${maintenanceMode ? 'max-w-2xl' : 'lg:grid-cols-[1fr_1.3fr]'}`}>
        <Reveal variant="slideLeft">
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            {maintenanceMode ? 'Maintenance' : 'Contact'}
          </span>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-ink md:text-5xl">
            {maintenanceMode ? 'We’ll be back soon.' : 'Let’s build something.'}
          </h1>
          <p className="mt-4 text-ink/60">
            {maintenanceMode
              ? 'The site is temporarily unavailable while it is being updated. You can still send a message below.'
              : 'Freelance projects, collabs, or just want to talk code — fill out the form and I’ll reply within a day or two.'}
          </p>

          {!maintenanceMode && <div className="mt-10 space-y-5">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-4 text-sm text-ink/70 shadow-soft">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary"><Mail size={16} /></span>
              {SITE.email}
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-4 text-sm text-ink/70 shadow-soft">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary"><MapPin size={16} /></span>
              Punjab, India (remote-friendly)
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-4 text-sm text-ink/70 shadow-soft">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary"><Clock size={16} /></span>
              Usually replies within 24-48 hours
            </div>
          </div>}
        </Reveal>

        <Reveal variant="slideRight">
          <form onSubmit={handleFormSubmit} noValidate className="rounded-2xl border border-border bg-white p-8 shadow-soft">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input id="name" {...register('name')} placeholder="Your name" />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" {...register('email')} placeholder="you@email.com" />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>
            </div>

            {!maintenanceMode && <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="company">Company (optional)</Label>
                <Input id="company" {...register('company')} placeholder="Your company" />
              </div>
              <div>
                <Label htmlFor="budget">Budget (optional)</Label>
                <select id="budget" {...register('budget')} className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/40">
                  <option value="">Select a range</option>
                  <option value="< $200">Under $200</option>
                  <option value="$200 - $500">$200 – $500</option>
                  <option value="$500 - $1500">$500 – $1,500</option>
                  <option value="$1500+">$1,500+</option>
                </select>
              </div>
            </div>}

            {!maintenanceMode && <div className="mt-5">
              <Label htmlFor="projectType">Project type (optional)</Label>
              <select id="projectType" {...register('projectType')} className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/40">
                <option value="">Select a type</option>
                <option value="Business Website">Business Website</option>
                <option value="Full-Stack App">Full-Stack App</option>
                <option value="API Development">API Development</option>
                <option value="Admin Dashboard">Admin Dashboard</option>
                <option value="Bug Fixing / Support">Bug Fixing / Support</option>
                <option value="Other">Other</option>
              </select>
            </div>}

            <div className="mt-5">
              <Label htmlFor="message">{maintenanceMode ? 'Message *' : 'Project details *'}</Label>
              <Textarea id="message" {...register('message')} placeholder={maintenanceMode ? 'How can I help?' : 'Tell me what you’re building...'} />
              {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
            </div>

            <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="mt-6 w-full">
              {isSubmitting ? 'Sending...' : <>{maintenanceMode ? 'Send message' : 'Send Message'} <ArrowRight size={16} /></>}
            </Button>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
