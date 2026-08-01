import type { Metadata } from 'next';
import { SITE } from '@/constants';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <div className="py-20">
      <div className="container prose-custom max-w-2xl">
        <h1 className="font-heading text-4xl font-bold text-ink">Privacy Policy</h1>
        <p className="mt-4 text-sm text-ink/40">Last updated: {new Date().toLocaleDateString()}</p>

        <h2>What I collect</h2>
        <p>
          When you use the contact form or subscribe to updates, I collect your name, email, and any
          details you choose to share about your project. This is stored securely in a MongoDB database
          and is never sold or shared with third parties.
        </p>

        <h2>How it&apos;s used</h2>
        <p>
          Contact form submissions are used solely to respond to your inquiry. Newsletter emails are used
          only to send occasional project and content updates — you can unsubscribe at any time by
          emailing {SITE.email}.
        </p>

        <h2>Cookies</h2>
        <p>
          This site uses a single, necessary cookie for admin authentication. No third-party tracking or
          advertising cookies are used.
        </p>

        <h2>Contact</h2>
        <p>Questions about this policy? Reach out at {SITE.email}.</p>
      </div>
    </div>
  );
}
