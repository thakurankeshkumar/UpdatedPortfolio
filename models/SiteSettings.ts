import mongoose, { Schema } from 'mongoose';

const TimelineItemSchema = new Schema(
  { year: String, title: String, description: String, order: Number },
  { _id: true }
);

const ExperienceItemSchema = new Schema(
  { role: String, period: String, description: String, order: Number },
  { _id: true }
);

const EducationItemSchema = new Schema(
  { school: String, degree: String, period: String, order: Number },
  { _id: true }
);

const SocialLinkSchema = new Schema(
  { label: String, href: String, icon: String, order: Number },
  { _id: true }
);

const PlatformItemSchema = new Schema(
  { name: String, icon: String, handle: String, description: String, href: String, order: Number },
  { _id: true }
);

const VideoItemSchema = new Schema(
  { title: String, tag: String, thumbnail: String, href: String, order: Number },
  { _id: true }
);

const SiteSettingsSchema = new Schema(
  {
    // Identity
    siteName: { type: String, default: 'Ankesh Kumar' },
    logoText: { type: String, default: 'Ankesh' },
    tagline: { type: String, default: 'I build scalable web applications, modern APIs and digital experiences while documenting everything I learn.' },

    // Security
    secretAdminCode: { type: String, default: 'letmein' },

    // Home Hero
    heroBadge: { type: String, default: 'Available for freelance work' },
    heroHeadline: { type: String, default: 'Software Developer. Freelancer. Content Creator.' },
    heroSubheadline: { type: String, default: 'I build scalable web applications, modern APIs and digital experiences — while documenting everything I learn along the way.' },

    // About page
    aboutIntro: { type: [String], default: [
      'I\u2019m Ankesh — a 3rd-year B.Tech CSE student who somewhere between operating systems assignments and HDL presentations started shipping real full-stack applications.',
      'That habit turned into two goals: freelancing as a software developer, and building a public audience around how the work actually gets done.',
      'I work fastest in the Next.js / Node.js / MongoDB world, but I don\u2019t stay in one lane — I reach for whatever stack the problem actually needs.',
    ] },
    currentFocus: { type: String, default: 'Advanced backend development (Node.js, Express, MongoDB), DSA for internship prep, and shipping freelance projects alongside coursework.' },
    futureVision: { type: String, default: 'Building a small studio around freelance dev work and a SaaS product of my own — with content as the distribution channel, not an afterthought.' },
    timeline: { type: [TimelineItemSchema], default: [] },

    // Resume
    resumeDownloadUrl: { type: String, default: '' },
    resumeSummary: { type: String, default: 'Full-Stack Developer & Content Creator' },
    experience: { type: [ExperienceItemSchema], default: [] },
    education: { type: [EducationItemSchema], default: [] },
    resumeSkills: { type: [String], default: [] },

    // Content Creator page
    platforms: { type: [PlatformItemSchema], default: [] },
    videos: { type: [VideoItemSchema], default: [] },

    // Footer
    footerTagline: { type: String, default: '' },
    footerSocials: { type: [SocialLinkSchema], default: [] },
    footerCopyright: { type: String, default: '' },

    // Page headers (admin-editable copy for each page)
    aboutPageTitle: { type: String, default: 'From lecture halls to production deploys.' },
    projectsPageTitle: { type: String, default: 'Projects' },
    projectsPageSubtitle: { type: String, default: 'Real things I\u2019ve built — academic, freelance, and personal.' },
    servicesPageTitle: { type: String, default: 'What I can build for you' },
    servicesPageSubtitle: { type: String, default: 'Clear scope, clear timeline, clear price — no surprises halfway through.' },
    blogPageTitle: { type: String, default: 'Writing' },
    blogPageSubtitle: { type: String, default: 'Notes on building products, freelancing, and what I\u2019m learning.' },
    contentPageTitle: { type: String, default: 'I teach what I build' },
    contentPageSubtitle: { type: String, default: 'Short-form dev content and full build breakdowns, across every platform.' },

    // Dynamic project category filters (admin-managed)
    projectCategories: { type: [String], default: ['Web App', 'SaaS', 'API', 'Landing Page', 'Tool'] },
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
