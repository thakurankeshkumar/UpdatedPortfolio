export interface TimelineItem { _id?: string; year: string; title: string; description: string; order: number }
export interface ExperienceItem { _id?: string; role: string; period: string; description: string; order: number }
export interface EducationItem { _id?: string; school: string; degree: string; period: string; order: number }
export interface SocialLink { _id?: string; label: string; href: string; icon: string; order: number }
export interface PlatformItem { _id?: string; name: string; icon: string; handle: string; description: string; href: string; order: number }
export interface VideoItem { _id?: string; title: string; tag: string; thumbnail: string; href: string; order: number }

export interface SiteSettings {
  siteName: string;
  logoText: string;
  tagline: string;
  secretAdminCode: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  maintenanceTitle: string;
  maintenanceExpectedReturn: string;
  maintenanceProgress: number;
  maintenanceShowProgress: boolean;
  maintenanceAccent: 'violet' | 'cyan' | 'rose';
  heroBadge: string;
  heroHeadline: string;
  heroSubheadline: string;
  aboutIntro: string[];
  currentFocus: string;
  futureVision: string;
  timeline: TimelineItem[];
  resumeDownloadUrl: string;
  resumeSummary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  resumeSkills: string[];
  platforms: PlatformItem[];
  videos: VideoItem[];
  footerTagline: string;
  footerSocials: SocialLink[];
  footerCopyright: string;
  aboutPageTitle: string;
  projectsPageTitle: string;
  projectsPageSubtitle: string;
  servicesPageTitle: string;
  servicesPageSubtitle: string;
  blogPageTitle: string;
  blogPageSubtitle: string;
  contentPageTitle: string;
  contentPageSubtitle: string;
  projectCategories: string[];
}
