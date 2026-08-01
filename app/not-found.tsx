import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <span className="font-heading text-8xl font-bold text-primary/20">404</span>
      <h1 className="mt-4 font-heading text-2xl font-bold text-ink">This page doesn&apos;t exist.</h1>
      <p className="mt-2 max-w-sm text-ink/60">
        The page you&apos;re looking for might have been moved or never existed. Let&apos;s get you back on track.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-dark px-6 py-3 text-sm font-medium text-white hover:bg-primary"
      >
        <ArrowLeft size={16} /> Back to home
      </Link>
    </div>
  );
}
