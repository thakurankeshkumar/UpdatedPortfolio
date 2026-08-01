export const SITE = {
  name: 'Ankesh Kumar',
  title: 'Ankesh Kumar — Software Developer, Freelancer & Content Creator',
  description:
    'I build scalable web applications, modern APIs and digital experiences while documenting everything I learn.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ankeshbuilds.tech',
  email: 'hello@ankeshbuilds.tech',
};

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Services', href: '/services' },
  { label: 'Blog', href: '/blog' },
  { label: 'Content', href: '/content-creator' },
  { label: 'Resume', href: '/resume' },
  { label: 'Contact', href: '/contact' },
];

export const TECH_STACK = [
  'Next.js', 'TypeScript', 'React', 'Node.js', 'Express', 'MongoDB',
  'TailwindCSS', 'Framer Motion', 'JWT', 'REST APIs', 'Cloudinary', 'Git',
];

export const STATS = [
  { label: 'Projects Shipped', value: 20, suffix: '+' },
  { label: 'Technologies', value: 15, suffix: '+' },
  { label: 'Passion', value: 100, suffix: '%' },
];

export const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/thakurankeshkumar' },
  { label: 'LinkedIn', href: '#' },
  { label: 'YouTube', href: '#' },
  { label: 'Twitter', href: '#' },
  { label: 'Instagram', href: '#' },
];

export const DEV_PROCESS = [
  { step: '01', title: 'Discover', desc: 'Understand the goal, users, and constraints before writing a line of code.' },
  { step: '02', title: 'Design', desc: 'Wireframe the flow and the data model so the build doesn\u2019t get rewritten twice.' },
  { step: '03', title: 'Build', desc: 'Ship in small, testable increments with clean, typed, version-controlled code.' },
  { step: '04', title: 'Refine', desc: 'Performance, accessibility, and edge cases — polish that clients actually notice.' },
  { step: '05', title: 'Deploy & Support', desc: 'Ship to production and stay reachable after launch, not just before payment.' },
];

export const FAQ = [
  {
    q: 'Are you available for freelance projects right now?',
    a: 'Yes — I take on a limited number of freelance projects alongside my degree, so I can give each one real attention.',
  },
  {
    q: 'What kind of projects do you take on?',
    a: 'Full-stack web apps, SaaS MVPs, landing pages, REST APIs, and admin dashboards — mostly Next.js/MERN based.',
  },
  {
    q: 'How do we start working together?',
    a: 'Send a message through the contact form with a rough idea of scope and budget, and I\u2019ll reply with next steps within a day or two.',
  },
  {
    q: 'Do you sign NDAs / work under contract?',
    a: 'Yes, happy to work under an NDA or simple scope-of-work agreement for any freelance engagement.',
  },
];
