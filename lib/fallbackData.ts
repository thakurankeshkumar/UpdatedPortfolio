import { Project, BlogPost, Service, Testimonial } from '@/types';

export const fallbackProjects: Project[] = [
  {
    _id: 'f1', title: 'Study Assistant', slug: 'study-assistant',
    summary: 'AI-powered PDF Q&A platform with grounded answers.',
    description: 'An AI-powered platform where you upload a PDF and ask it questions, built with Next.js, MongoDB, JWT auth, and the Groq SDK for fast inference.',
    category: 'SaaS', techStack: ['Next.js', 'MongoDB', 'Groq SDK', 'pdf-parse'],
    coverImage: '', gallery: [], challenges: 'Keeping answers grounded in the actual document instead of hallucinating.',
    solutions: 'Chunked the PDF and used retrieval-style prompting so the model only answers from retrieved context.',
    githubUrl: 'https://github.com/thakurankeshkumar', liveUrl: '', featured: true, order: 1, createdAt: new Date().toISOString(),
  },
  {
    _id: 'f2', title: 'IPC Debugger', slug: 'ipc-debugger',
    summary: 'Interactive visualizer for inter-process communication and deadlocks.',
    description: 'Built for a systems course, this tool visualizes IPC mechanisms and deadlock detection on an interactive canvas.',
    category: 'Tool', techStack: ['Next.js', 'Canvas', 'Chart.js'],
    coverImage: '', gallery: [], challenges: 'Representing abstract OS concepts visually in a way that\u2019s actually intuitive.',
    solutions: 'Built a step-through simulation with Chart.js timelines instead of a static diagram.',
    githubUrl: 'https://github.com/thakurankeshkumar', liveUrl: 'https://ipcdebugger.vercel.app', featured: true, order: 2, createdAt: new Date().toISOString(),
  },
  {
    _id: 'f3', title: 'Fake News Detector', slug: 'fake-news-detector',
    summary: 'ML classifier flagging misinformation with contextual explanations.',
    description: 'Combines a scikit-learn classifier with the Gemini API to not just flag content but explain why.',
    category: 'API', techStack: ['FastAPI', 'scikit-learn', 'Gemini API', 'Next.js'],
    coverImage: '', gallery: [], challenges: 'Avoiding false positives on legitimate but sensational headlines.',
    solutions: 'Combined the model\u2019s confidence score with an LLM-generated explanation for transparency.',
    githubUrl: 'https://github.com/thakurankeshkumar', liveUrl: '', featured: false, order: 3, createdAt: new Date().toISOString(),
  },
];

export const fallbackServices: Service[] = [
  { _id: 's1', title: 'Business Website', description: 'A fast, modern website that represents your business professionally and converts visitors.', features: ['Responsive design', 'SEO-ready', 'CMS-editable content', 'Contact form + email'], timeline: '1-2 weeks', startingPrice: '$249', icon: 'Globe', order: 1 },
  { _id: 's2', title: 'MERN Full-Stack App', description: 'End-to-end web applications with a real database, auth, and admin panel.', features: ['Next.js + Node.js', 'MongoDB + Mongoose', 'JWT authentication', 'Admin dashboard'], timeline: '2-4 weeks', startingPrice: '$599', icon: 'Layers', order: 2 },
  { _id: 's3', title: 'REST API Development', description: 'Clean, documented, secure APIs your team or app can build on.', features: ['REST or GraphQL', 'Auth & rate limiting', 'API documentation', 'Postman collection'], timeline: '1-3 weeks', startingPrice: '$399', icon: 'Server', order: 3 },
  { _id: 's4', title: 'Admin Dashboard', description: 'A CRUD dashboard so your team can manage content without touching code.', features: ['Role-based access', 'Data tables + filters', 'Charts & analytics', 'Media management'], timeline: '2-3 weeks', startingPrice: '$449', icon: 'LayoutDashboard', order: 4 },
  { _id: 's5', title: 'Website Optimization', description: 'Speed, SEO, and Lighthouse score improvements for an existing site.', features: ['Core Web Vitals audit', 'Image & code optimization', 'SEO metadata pass', 'Before/after report'], timeline: '3-7 days', startingPrice: '$149', icon: 'Gauge', order: 5 },
  { _id: 's6', title: 'Bug Fixing & Support', description: 'Fast, focused fixes for a codebase that\u2019s giving you trouble.', features: ['Same-week turnaround', 'Root-cause write-up', 'Regression testing', 'Optional ongoing retainer'], timeline: '1-5 days', startingPrice: '$99', icon: 'Wrench', order: 6 },
];

export const fallbackTestimonials: Testimonial[] = [
  { _id: 't1', name: 'Placeholder Client', role: 'Founder', company: 'Add your first testimonial in /admin/dashboard', avatar: '', quote: 'This section pulls live from your database — add real client feedback here once you have it.', rating: 5, order: 1 },
];

export const fallbackBlogs: BlogPost[] = [
  {
    _id: 'b1', title: 'Why I\u2019m Building in Public', slug: 'building-in-public',
    excerpt: 'Documenting projects publicly changed how I learn and how I build.',
    content: '## Why build in public?\n\nSharing progress, not just finished work, is what actually compounds — feedback loops, accountability, and a portfolio that grows in real time.',
    coverImage: '', category: 'Career', tags: ['career', 'content'], readingTime: '3 min read', published: true, createdAt: new Date().toISOString(),
  },
];
