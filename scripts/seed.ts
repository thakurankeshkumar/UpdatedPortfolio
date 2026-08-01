import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI as string;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL as string;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD as string;
const ADMIN_NAME = process.env.ADMIN_NAME || 'Ankesh Kumar';

if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Missing MONGODB_URI, ADMIN_EMAIL, or ADMIN_PASSWORD in .env.local');
  process.exit(1);
}

const AdminSchema = new mongoose.Schema({ email: String, passwordHash: String, name: String }, { timestamps: true });
const ProjectSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const BlogSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const ServiceSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const TestimonialSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const SiteSettingsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

const Admin = mongoose.model('Admin', AdminSchema);
const Project = mongoose.model('Project', ProjectSchema);
const Blog = mongoose.model('Blog', BlogSchema);
const Service = mongoose.model('Service', ServiceSchema);
const Testimonial = mongoose.model('Testimonial', TestimonialSchema);
const SiteSettings = mongoose.model('SiteSettings', SiteSettingsSchema);

const projects = [
  {
    title: 'Study Assistant', slug: 'study-assistant', summary: 'AI-powered PDF Q&A platform with grounded answers.',
    description: 'An AI-powered platform where you upload a PDF and ask it questions.\n\n## Stack\nBuilt with Next.js, MongoDB, JWT auth, and the Groq SDK for fast inference, with pdf-parse handling document ingestion.',
    category: 'SaaS', techStack: ['Next.js', 'MongoDB', 'Groq SDK', 'pdf-parse'], coverImage: '', gallery: [],
    challenges: 'Keeping answers grounded in the actual document instead of hallucinating.',
    solutions: 'Chunked the PDF and used retrieval-style prompting so the model only answers from retrieved context.',
    githubUrl: 'https://github.com/thakurankeshkumar', liveUrl: '', featured: true, order: 1,
  },
  {
    title: 'IPC Debugger', slug: 'ipc-debugger', summary: 'Interactive visualizer for inter-process communication and deadlocks.',
    description: 'Built for a systems course, this tool visualizes IPC mechanisms and deadlock detection on an interactive canvas.\n\n## Highlights\n- Step-through simulation\n- Chart.js timelines for resource allocation',
    category: 'Tool', techStack: ['Next.js', 'Canvas', 'Chart.js'], coverImage: '', gallery: [],
    challenges: 'Representing abstract OS concepts visually in a way that\u2019s actually intuitive.',
    solutions: 'Built a step-through simulation with Chart.js timelines instead of a static diagram.',
    githubUrl: 'https://github.com/thakurankeshkumar', liveUrl: 'https://ipcdebugger.vercel.app', featured: true, order: 2,
  },
  {
    title: 'Fake News Detector', slug: 'fake-news-detector', summary: 'ML classifier flagging misinformation with contextual explanations.',
    description: 'Combines a scikit-learn classifier with the Gemini API to not just flag content but explain why.',
    category: 'API', techStack: ['FastAPI', 'scikit-learn', 'Gemini API', 'Next.js'], coverImage: '', gallery: [],
    challenges: 'Avoiding false positives on legitimate but sensational headlines.',
    solutions: 'Combined the model\u2019s confidence score with an LLM-generated explanation for transparency.',
    githubUrl: 'https://github.com/thakurankeshkumar', liveUrl: '', featured: true, order: 3,
  },
  {
    title: 'Heritage of Bharat', slug: 'heritage-of-bharat', summary: 'Scrollytelling cultural site with an interactive India map explorer.',
    description: 'A scrollytelling site exploring Indian cultural heritage state by state, with GSAP-driven scroll animations.',
    category: 'Web App', techStack: ['GSAP', 'Next.js'], coverImage: '', gallery: [],
    challenges: 'Keeping scroll animations smooth across a content-heavy page.',
    solutions: 'Used GSAP ScrollTrigger with careful timeline batching per section.',
    githubUrl: 'https://github.com/thakurankeshkumar', liveUrl: '', featured: false, order: 4,
  },
  {
    title: 'AuthFlow', slug: 'authflow', summary: 'Reusable, secure authentication flow with JWT refresh tokens.',
    description: 'A drop-in auth module — signup, login, JWT refresh tokens — built to plug into any full-stack project fast.',
    category: 'API', techStack: ['Node.js', 'Express', 'JWT'], coverImage: '', gallery: [],
    challenges: 'Handling refresh token rotation securely without adding client complexity.',
    solutions: 'HttpOnly refresh cookie + short-lived access token pattern, abstracted behind a small SDK.',
    githubUrl: 'https://github.com/thakurankeshkumar', liveUrl: '', featured: false, order: 5,
  },
  {
    title: 'SafeMark', slug: 'safemark', summary: 'Secure marking and verification system exploring backend security patterns.',
    description: 'A project focused on secure marking and verification, exploring practical applications of backend security.',
    category: 'Tool', techStack: ['Node.js', 'MongoDB'], coverImage: '', gallery: [],
    challenges: 'Ensuring verification records can\u2019t be tampered with after the fact.',
    solutions: 'Hash-chained records so any tampering breaks the verification chain visibly.',
    githubUrl: 'https://github.com/thakurankeshkumar', liveUrl: '', featured: false, order: 6,
  },
];

const services = [
  { title: 'Business Website', description: 'A fast, modern website that represents your business professionally and converts visitors.', features: ['Responsive design', 'SEO-ready', 'CMS-editable content', 'Contact form + email'], timeline: '1-2 weeks', startingPrice: '$249', icon: 'Globe', order: 1 },
  { title: 'MERN Full-Stack App', description: 'End-to-end web applications with a real database, auth, and admin panel.', features: ['Next.js + Node.js', 'MongoDB + Mongoose', 'JWT authentication', 'Admin dashboard'], timeline: '2-4 weeks', startingPrice: '$599', icon: 'Layers', order: 2 },
  { title: 'REST API Development', description: 'Clean, documented, secure APIs your team or app can build on.', features: ['REST or GraphQL', 'Auth & rate limiting', 'API documentation', 'Postman collection'], timeline: '1-3 weeks', startingPrice: '$399', icon: 'Server', order: 3 },
  { title: 'Admin Dashboard', description: 'A CRUD dashboard so your team can manage content without touching code.', features: ['Role-based access', 'Data tables + filters', 'Charts & analytics', 'Media management'], timeline: '2-3 weeks', startingPrice: '$449', icon: 'LayoutDashboard', order: 4 },
  { title: 'Website Optimization', description: 'Speed, SEO, and Lighthouse score improvements for an existing site.', features: ['Core Web Vitals audit', 'Image & code optimization', 'SEO metadata pass', 'Before/after report'], timeline: '3-7 days', startingPrice: '$149', icon: 'Gauge', order: 5 },
  { title: 'Bug Fixing & Support', description: 'Fast, focused fixes for a codebase that\u2019s giving you trouble.', features: ['Same-week turnaround', 'Root-cause write-up', 'Regression testing', 'Optional ongoing retainer'], timeline: '1-5 days', startingPrice: '$99', icon: 'Wrench', order: 6 },
];

const blogs = [
  {
    title: 'Why I\u2019m Building in Public', slug: 'building-in-public', excerpt: 'Documenting projects publicly changed how I learn and how I build.',
    content: '## Why build in public?\n\nSharing progress, not just finished work, is what actually compounds — feedback loops, accountability, and a portfolio that grows in real time.\n\n## What changed\n\nOnce I started writing about what I was building, I noticed I understood my own projects better. Explaining a decision out loud (or in text) exposes the gaps in it immediately.',
    coverImage: '', category: 'Career', tags: ['career', 'content'], readingTime: '3 min read', published: true,
  },
  {
    title: 'MongoDB vs SQL: How I Actually Choose', slug: 'mongodb-vs-sql', excerpt: 'A practical framework for picking a database, not a religious war.',
    content: '## It depends on the shape of your data\n\nIf your data is deeply relational with lots of joins, SQL wins. If it\u2019s document-shaped and evolves quickly, MongoDB gets out of your way faster.\n\n## My rule of thumb\n\nFor early-stage MVPs where the schema is still moving, I default to MongoDB. Once the data model stabilizes and reporting matters more, I\u2019ll reach for Postgres.',
    coverImage: '', category: 'Engineering', tags: ['databases', 'mongodb', 'backend'], readingTime: '4 min read', published: true,
  },
];

const defaultSettings = {
  siteName: 'Ankesh Kumar', logoText: 'Ankesh',
  tagline: 'I build scalable web applications, modern APIs and digital experiences while documenting everything I learn.',
  secretAdminCode: 'letmein',
  heroBadge: 'Available for freelance work',
  heroHeadline: 'Software Developer. Freelancer. Content Creator.',
  heroSubheadline: 'I build scalable web applications, modern APIs and digital experiences — while documenting everything I learn along the way.',
  aboutIntro: [
    'I\u2019m Ankesh — a 3rd-year B.Tech CSE student who somewhere between operating systems assignments and HDL presentations started shipping real full-stack applications.',
    'That habit turned into two goals: freelancing as a software developer, and building a public audience around how the work actually gets done.',
    'I work fastest in the Next.js / Node.js / MongoDB world, but I don\u2019t stay in one lane — I reach for whatever stack the problem actually needs.',
  ],
  currentFocus: 'Advanced backend development (Node.js, Express, MongoDB), DSA for internship prep, and shipping freelance projects alongside coursework.',
  futureVision: 'Building a small studio around freelance dev work and a SaaS product of my own — with content as the distribution channel, not an afterthought.',
  timeline: [
    { year: '2023', title: 'Started B.Tech CSE', description: 'Began at Lovely Professional University, batch of 2028 — and started writing real code outside of coursework.', order: 1 },
    { year: '2024', title: 'First shipped projects', description: 'Built academic projects that ended up looking and working like production software.', order: 2 },
    { year: '2025', title: 'Went full-stack + AI', description: 'Started integrating LLM APIs into real products.', order: 3 },
    { year: 'Now', title: 'Freelancing + content', description: 'Taking on freelance projects while building a public audience around how the work gets done.', order: 4 },
  ],
  resumeDownloadUrl: '', resumeSummary: 'Full-Stack Developer & Content Creator',
  experience: [
    { role: 'Freelance Full-Stack Developer', period: '2025 — Present', description: 'Building full-stack apps and AI-powered tools for clients using Next.js, Node.js, and MongoDB.', order: 1 },
    { role: 'Independent Projects', period: '2023 — Present', description: 'Shipped 6+ projects spanning AI, systems visualization, and cultural storytelling websites.', order: 2 },
  ],
  education: [{ school: 'Lovely Professional University', degree: 'B.Tech, Computer Science & Engineering', period: '2023 — 2027 (Batch 2028)', order: 1 }],
  resumeSkills: ['Next.js', 'TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'TailwindCSS', 'REST APIs', 'JWT', 'Git', 'DSA', 'Operating Systems'],
  platforms: [
    { name: 'YouTube', icon: 'Youtube', handle: '@ankeshbuilds', description: 'Full build breakdowns & tutorials', href: '#', order: 1 },
    { name: 'Instagram', icon: 'Instagram', handle: '@ankeshbuilds', description: 'Quick dev tips & reels', href: '#', order: 2 },
    { name: 'LinkedIn', icon: 'Linkedin', handle: 'Ankesh Kumar', description: 'Career + freelancing notes', href: '#', order: 3 },
    { name: 'Twitter / X', icon: 'Twitter', handle: '@ankeshbuilds', description: 'Build-in-public updates', href: '#', order: 4 },
  ],
  videos: [
    { title: 'Building an AI PDF Q&A app in Next.js', tag: 'Tutorial', thumbnail: '', href: '#', order: 1 },
    { title: 'JS Tip: Optional Chaining in 20 seconds', tag: 'Short', thumbnail: '', href: '#', order: 2 },
    { title: 'MongoDB vs SQL — how to actually choose', tag: 'Explainer', thumbnail: '', href: '#', order: 3 },
    { title: 'From student project to real product', tag: 'Story', thumbnail: '', href: '#', order: 4 },
  ],
  footerTagline: '',
  footerSocials: [
    { label: 'GitHub', href: 'https://github.com/thakurankeshkumar', icon: 'Github', order: 1 },
    { label: 'LinkedIn', href: '#', icon: 'Linkedin', order: 2 },
    { label: 'YouTube', href: '#', icon: 'Youtube', order: 3 },
    { label: 'Twitter', href: '#', icon: 'Twitter', order: 4 },
  ],
  footerCopyright: '',
};

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await Admin.create({ email: ADMIN_EMAIL.toLowerCase(), passwordHash, name: ADMIN_NAME });
    console.log(`Created admin account: ${ADMIN_EMAIL}`);
  } else {
    console.log('Admin account already exists, skipping.');
  }

  await Project.deleteMany({});
  await Project.insertMany(projects);
  console.log(`Seeded ${projects.length} projects`);

  await Service.deleteMany({});
  await Service.insertMany(services);
  console.log(`Seeded ${services.length} services`);

  await Blog.deleteMany({});
  await Blog.insertMany(blogs);
  console.log(`Seeded ${blogs.length} blog posts`);

  await Testimonial.deleteMany({});
  console.log('Testimonials left empty — add your first real client testimonial from /admin/dashboard.');

  const existingSettings = await SiteSettings.findOne();
  if (!existingSettings) {
    await SiteSettings.create(defaultSettings);
    console.log('Created default site settings (edit anytime from /admin/dashboard/settings)');
  } else {
    console.log('Site settings already exist, leaving your edits untouched.');
  }

  await mongoose.disconnect();
  console.log('\nDone! Run "npm run dev" and visit /admin/login to sign in.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
