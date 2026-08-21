# Ankesh Kumar — Personal Brand Website

A premium, full-stack personal brand site: Next.js 14 (App Router) + TypeScript + TailwindCSS +
Framer Motion on the frontend, MongoDB + Mongoose on the backend, with a real admin dashboard,
Cloudinary image storage, and email notifications on contact form submissions.

Design language: Apple / Stripe / Linear inspired — minimal, whitespace-heavy, soft shadows,
subtle motion. Primary `#2563EB`, Accent `#7C3AED`, on a light `#FAFAFA` background with a `#0F172A`
dark section for the process/CTA blocks.

---

## What's included

- **13 pages**, every one reading live from MongoDB with graceful fallback content, and most now
  driven by the **Site Settings** system (see below) so copy, timeline, resume, and content-creator
  data are all admin-editable — not hardcoded
- **Site Settings admin page** (`/admin/dashboard/settings`): controls the navbar logo, footer
  (tagline/socials/copyright), home hero copy, About page story + timeline, Resume (summary,
  download link, experience, education, skills), Content Creator platforms/videos, and page
  titles/subtitles for Projects/Services/Blog/Content Creator — plus the secret admin access code
- **Hidden admin entry point**: on the Contact page, type your access code into the **Name** field,
  leave every other field empty, and submit — it redirects straight to `/admin/login`. Any other
  input (wrong code, or other fields filled) behaves like a completely normal contact submission.
  The code lives in Site Settings, not in the code, so you can change it anytime.
- **Dynamic project categories**: the filter chips on `/projects` come from Site Settings → Page
  Copy, not a hardcoded list — add or rename categories there and the filter updates immediately.
- Improved admin dashboard with dedicated sections for projects, blog, services, testimonials,
  messages, media, and page-level Site Settings
- Full CRUD dashboard for Projects, Blog posts, Services, Testimonials, plus a Messages inbox
- Real auth: bcrypt + JWT + edge middleware protecting the dashboard, private read APIs, and every
  write API route
- Cloudinary media library: upload images, reuse existing assets from admin fields, copy URLs, and
  permanently delete unused Cloudinary files instead of only hiding them from the frontend
- Safer uploads with image-type validation, 5MB limits, controlled Cloudinary folders, and real
  Cloudinary cleanup when project/blog/testimonial records are deleted
- Security hardening: same-origin checks for protected mutations, security headers, whitelisted
  settings writes, public contact/newsletter rate limits, and stricter input length validation
- Nodemailer email notification the moment someone submits the contact form
- SEO: per-page metadata, OpenGraph, Twitter cards, JSON-LD, dynamic `sitemap.xml` + `robots.txt`
- Framer Motion throughout: scroll reveals, staggered grids, animated counters, magnetic buttons,
  an interactive orbit-style skills visualization, alternating-side About timeline
- Reading-progress bar on blog posts, back-to-top button
- Every page reads live from MongoDB and **gracefully falls back to sample content** if the
  database isn't connected yet — the site never shows a blank or broken page

**Note:** dark mode and the ⌘K command palette were removed by request — kept the site simpler
and more reliable rather than shipping a half-working dark theme.

---

## 1. Set up MongoDB Atlas (free, ~5 minutes)

1. https://www.mongodb.com/cloud/atlas/register → sign up free.
2. **Build a Database** → **M0 Free** tier → any region → **Create**.
3. **Security → Database Access** → **Add New Database User** → set a username/password.
4. **Security → Network Access** → **Add IP Address** → **Allow Access from Anywhere** (fine for a
   personal project).
5. **Database → Connect → Drivers** → copy the connection string, e.g.
   `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   — add a database name before the `?`, e.g. `.../ankesh-brand?retryWrites=...`

## 2. Set up Cloudinary (free, for images)

1. https://cloudinary.com/users/register/free → sign up free.
2. On your Dashboard, copy **Cloud Name**, **API Key**, and **API Secret**.

## 3. Set up email notifications (optional but recommended)

Using Gmail is easiest:
1. Turn on 2-Step Verification on your Google account.
2. Create an **App Password**: https://myaccount.google.com/apppasswords
3. Use that 16-character password as `SMTP_PASS` below (not your normal Gmail password).

If you skip this step, the contact form still works and still saves to MongoDB — it just won't
send you an email notification.

## 4. Configure environment variables

Copy `.env.example` to `.env.local` and fill in everything:

```
MONGODB_URI=...
JWT_SECRET=...          # generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ADMIN_EMAIL=...
ADMIN_PASSWORD=...
ADMIN_NAME=Ankesh Kumar
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=you@gmail.com
SMTP_PASS=your-16-char-app-password
CONTACT_RECEIVER_EMAIL=you@gmail.com
NEXT_PUBLIC_SITE_URL=https://ankeshbuilds.tech
```

## 5. Install, seed, and run locally

```bash
npm install
npm run seed     # creates your admin account + starter projects/services/blog posts
npm run dev
```

- **http://localhost:3000** → your live site (reading real data from MongoDB)
- **http://localhost:3000/admin/login** → sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- From `/admin/dashboard` you can add/edit/delete everything — changes appear on the live site
  immediately, no redeploy needed
- Use `/admin/dashboard/media` to manage Cloudinary storage. You can reuse uploaded images from
  image fields by clicking **Choose Existing**, and delete unused assets from Cloudinary when they
  are no longer needed.

`npm run seed` won't duplicate your admin account on re-run, but it **will reset** projects,
services, and blog posts back to the starter set — don't re-run it once you've customized content
unless you want to start over. Testimonials are left empty on purpose; add your first real one
from the dashboard. Site Settings are only created once (re-running seed won't overwrite your
edits there) — go to `/admin/dashboard/settings` right after your first seed to personalize the
hero copy, about story, timeline, resume, and the secret admin access code.

Add your actual resume as a PDF — upload it anywhere you can get a direct link (Cloudinary,
Google Drive with public sharing, etc.) and paste that URL into **Site Settings → Resume →
Resume file** in the admin dashboard. The Resume page's download button uses that link
automatically. There's a leftover note file at `public/ADD_YOUR_RESUME_HERE.txt` you can delete
once this is set up.

## 6. Deploy (Vercel, free)

1. Push this project to a GitHub repo.
2. https://vercel.com → **New Project** → import the repo.
3. Add all the environment variables from `.env.local` in **Settings → Environment Variables**.
4. Deploy.
5. Point `ankeshbuilds.tech` at it: **Settings → Domains** → add the domain → update DNS at your
   registrar as Vercel instructs.
6. Run `npm run seed` once locally (pointed at the same `MONGODB_URI` used in Vercel) to create
   your admin account and starter content in the production database.

---

## Project structure

```
app/
  layout.tsx                    → root layout: fonts, theme, toast provider, JSON-LD
  (marketing)/                  → route group: all public pages share Header/Footer/CommandPalette
    page.tsx                    → Home
    about/, projects/, projects/[slug]/, services/, blog/, blog/[slug]/,
    content-creator/, resume/, contact/, privacy/, terms/
  admin/
    login/page.tsx
    dashboard/layout.tsx        → sidebar nav + logout
    dashboard/page.tsx          → overview / live stats
    dashboard/{projects,blogs,services,testimonials,messages,media}/page.tsx
  api/
    auth/{login,logout,me}/     → session management
    {projects,blogs,services,testimonials}/route.ts + [id]/route.ts  → CRUD (GET public, writes protected)
    messages/route.ts + [id]/   → inbox (fully protected — private data)
    contact/route.ts            → public: saves message + sends email
    newsletter/route.ts         → public: subscribe
    upload/route.ts             → protected: Cloudinary upload
    media/route.ts              → protected: Cloudinary library listing + permanent asset deletion
  sitemap.ts, robots.ts, not-found.tsx

models/        → Mongoose schemas
services/      → server-side data-fetching functions (DB + fallback pattern)
sections/      → page-specific composed sections (home sections, projects grid, blog list)
components/
  ui/          → Button, Card, Badge, Input/Textarea, Toast (shadcn-style primitives)
  layout/      → Header, Footer, CommandPalette, scroll widgets, section heading
  admin/       → ImageUploadField, ImageListUploadField, MediaLibrary, admin layout helpers
animations/    → Reveal, Stagger, Counter (Framer Motion wrappers)
hooks/         → useCrud (generic admin CRUD hook)
lib/           → mongodb.ts, auth.ts, cloudinary.ts, mail.ts, markdown.ts, crud.ts, fallbackData.ts
constants/     → nav links, tech stack, stats, FAQ, dev process
types/         → shared TypeScript interfaces
scripts/seed.ts
```

## Extending it further

Everything follows the same shape, so adding a new content type (e.g. a "Case Studies" or
"Newsletter Archive" collection) is: a Mongoose model in `models/`, a service function in
`services/`, an API route pair via `lib/crud.ts`'s factory functions, a dashboard page copying
the pattern in `app/admin/dashboard/testimonials/page.tsx`, and a public page/section to display it.

**Ideas to extend next:** a dedicated newsletter-management UI beyond the capture endpoint, media
usage tracking before deleting shared images, and a Lighthouse-driven performance pass once real
images/content are in place — image sizes, lazy-loading thresholds, and bundle splitting are easiest
to tune against real content rather than placeholders.
