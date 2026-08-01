import type { Metadata } from 'next';
import { SITE } from '@/constants';

export const metadata: Metadata = { title: 'Terms of Service' };

export default function TermsPage() {
  return (
    <div className="py-20">
      <div className="container prose-custom max-w-2xl">
        <h1 className="font-heading text-4xl font-bold text-ink">Terms of Service</h1>
        <p className="mt-4 text-sm text-ink/40">Last updated: {new Date().toLocaleDateString()}</p>

        <h2>Freelance engagements</h2>
        <p>
          Any freelance project discussed through this site is scoped and agreed upon separately via a
          written proposal or contract before work begins. Nothing on this site constitutes a binding
          offer of services.
        </p>

        <h2>Content ownership</h2>
        <p>
          All project write-ups, blog posts, and case studies on this site are original work and may not
          be reproduced without permission.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          This website and its content are provided as-is. While every effort is made to keep information
          accurate and up to date, no guarantee is made regarding completeness or accuracy.
        </p>

        <h2>Contact</h2>
        <p>Questions about these terms? Reach out at {SITE.email}.</p>
      </div>
    </div>
  );
}
