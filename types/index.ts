export interface Project {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  description: string; // markdown
  category: string;
  techStack: string[];
  coverImage: string;
  gallery: string[];
  challenges: string;
  solutions: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  order: number;
  createdAt: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // markdown
  coverImage: string;
  category: string;
  tags: string[];
  readingTime: string;
  published: boolean;
  createdAt: string;
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  features: string[];
  timeline: string;
  startingPrice: string;
  icon: string;
  order: number;
}

export interface Testimonial {
  _id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  rating: number;
  order: number;
}

export interface Message {
  _id: string;
  name: string;
  email: string;
  company?: string;
  budget?: string;
  projectType?: string;
  message: string;
  read: boolean;
  createdAt: string;
}
