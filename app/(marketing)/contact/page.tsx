'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Mail, MapPin, Clock, ArrowRight } from 'lucide-react';
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
  const {
    register, handleSubmit, getValues,
    formState: { errors, isSubmitting }, reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

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

  return (
    <div className="py-20">
      <div className="container grid gap-16 lg:grid-cols-[1fr_1.3fr]">
        <Reveal variant="slideLeft">
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            Contact
          </span>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-ink md:text-5xl">Let&apos;s build something.</h1>
          <p className="mt-4 text-ink/60">
            Freelance projects, collabs, or just want to talk code — fill out the form and I&apos;ll reply
            within a day or two.
          </p>

          <div className="mt-10 space-y-5">
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
          </div>
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

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
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
            </div>

            <div className="mt-5">
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
            </div>

            <div className="mt-5">
              <Label htmlFor="message">Project details *</Label>
              <Textarea id="message" {...register('message')} placeholder="Tell me what you're building..." />
              {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
            </div>

            <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="mt-6 w-full">
              {isSubmitting ? 'Sending...' : <>Send Message <ArrowRight size={16} /></>}
            </Button>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
