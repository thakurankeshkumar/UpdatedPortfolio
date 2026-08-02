'use client';
import { useEffect, useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { Input, Textarea, Label } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { RepeaterList } from '@/components/admin/repeater-list';
import { TagListEditor } from '@/components/admin/tag-list-editor';
import { cn } from '@/lib/utils';
import { AdminHeader } from '@/components/admin/admin-ui';

const TABS = ['Identity & Security', 'Home', 'About', 'Resume', 'Content Creator', 'Footer', 'Page Copy'] as const;

export default function SettingsPage() {
  const { show } = useToast();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<(typeof TABS)[number]>('Identity & Security');

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' }).then((r) => r.json()).then((data) => { setSettings(data); setLoading(false); });
  }, []);

  function set(key: string, value: any) {
    setSettings((s: any) => ({ ...s, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error();
      show('Settings saved — your live site is updated.');
    } catch {
      show('Failed to save settings.', 'error');
    } finally {
      setSaving(false);
    }
  }

  if (loading || !settings) {
    return <p className="text-sm text-ink/40">Loading settings...</p>;
  }

  return (
    <div>
      <AdminHeader
        title="Site Settings"
        description="Control the live site identity, copy, resume, content creator links, footer, and page-level labels."
        action={
          <Button variant="primary" onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
            {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Changes</>}
          </Button>
        }
      />

      <div className="sticky top-16 z-10 mt-6 border-b border-border bg-muted/95 pb-4 pt-2 backdrop-blur md:top-0">
        <div className="flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
              tab === t ? 'bg-primary text-white' : 'bg-white text-ink/60 hover:text-primary'
            )}
          >
            {t}
          </button>
        ))}
        </div>
      </div>

      {tab === 'Identity & Security' && (
        <div className="mt-8 max-w-xl space-y-5 rounded-3xl border border-border bg-white p-5 shadow-soft md:p-6">
          <div><Label>Site Name</Label><Input value={settings.siteName} onChange={(e) => set('siteName', e.target.value)} /></div>
          <div><Label>Navbar Logo Text</Label><Input value={settings.logoText} onChange={(e) => set('logoText', e.target.value)} /></div>
          <div><Label>Tagline (used in footer/meta by default)</Label><Textarea value={settings.tagline} onChange={(e) => set('tagline', e.target.value)} /></div>
          <div className="rounded-xl border border-primary/20 bg-primary/[0.03] p-5">
            <Label>Secret Admin Access Code</Label>
            <p className="mb-2 text-xs text-ink/50">
              Typed into the Contact page&apos;s Name field (with every other field left empty) to jump to this
              login page. Change it any time — it takes effect immediately.
            </p>
            <Input value={settings.secretAdminCode} onChange={(e) => set('secretAdminCode', e.target.value)} />
          </div>
        </div>
      )}

      {tab === 'Home' && (
        <div className="mt-8 max-w-xl space-y-5 rounded-3xl border border-border bg-white p-5 shadow-soft md:p-6">
          <div><Label>Hero badge text</Label><Input value={settings.heroBadge} onChange={(e) => set('heroBadge', e.target.value)} /></div>
          <div>
            <Label>Hero headline</Label>
            <p className="mb-1 text-xs text-ink/40">Split into 3 lines using &quot;. &quot; — the middle line is highlighted.</p>
            <Textarea value={settings.heroHeadline} onChange={(e) => set('heroHeadline', e.target.value)} />
          </div>
          <div><Label>Hero subheadline</Label><Textarea value={settings.heroSubheadline} onChange={(e) => set('heroSubheadline', e.target.value)} /></div>
        </div>
      )}

      {tab === 'About' && (
        <div className="mt-8 max-w-2xl space-y-8 rounded-3xl border border-border bg-white p-5 shadow-soft md:p-6">
          <div><Label>About page title</Label><Input value={settings.aboutPageTitle} onChange={(e) => set('aboutPageTitle', e.target.value)} /></div>

          <div>
            <Label>Intro paragraphs</Label>
            <div className="space-y-3">
              {(settings.aboutIntro || []).map((p: string, i: number) => (
                <div key={i} className="flex gap-2">
                  <Textarea
                    value={p}
                    onChange={(e) => {
                      const next = [...settings.aboutIntro];
                      next[i] = e.target.value;
                      set('aboutIntro', next);
                    }}
                  />
                  <button type="button" onClick={() => set('aboutIntro', settings.aboutIntro.filter((_: string, idx: number) => idx !== i))} className="text-ink/30 hover:text-red-500">✕</button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => set('aboutIntro', [...(settings.aboutIntro || []), ''])}>Add paragraph</Button>
            </div>
          </div>

          <div><Label>Current Focus</Label><Textarea value={settings.currentFocus} onChange={(e) => set('currentFocus', e.target.value)} /></div>
          <div><Label>Future Vision</Label><Textarea value={settings.futureVision} onChange={(e) => set('futureVision', e.target.value)} /></div>

          <div>
            <Label>Timeline</Label>
            <RepeaterList
              items={settings.timeline || []}
              onChange={(items) => set('timeline', items)}
              itemLabel="Milestone"
              newItem={{ year: '', title: '', description: '', order: 0 }}
              fields={[
                { key: 'year', label: 'Year / Label', placeholder: '2025' },
                { key: 'title', label: 'Title', placeholder: 'Started freelancing' },
                { key: 'description', label: 'Description', type: 'textarea' },
              ]}
            />
          </div>
        </div>
      )}

      {tab === 'Resume' && (
        <div className="mt-8 max-w-2xl space-y-8 rounded-3xl border border-border bg-white p-5 shadow-soft md:p-6">
          <div><Label>Resume summary tagline</Label><Input value={settings.resumeSummary} onChange={(e) => set('resumeSummary', e.target.value)} /></div>

          <div>
            <Label>Resume file (upload a PDF, or paste a URL)</Label>
            <div className="flex gap-3">
              <Input
                value={settings.resumeDownloadUrl}
                placeholder="https://res.cloudinary.com/.../resume.pdf"
                onChange={(e) => set('resumeDownloadUrl', e.target.value)}
              />
            </div>
            <p className="mt-1 text-xs text-ink/40">
              Upload your PDF anywhere (Cloudinary, Google Drive with public link, etc.) and paste the direct URL here.
              The Resume page&apos;s download button uses this link.
            </p>
          </div>

          <div>
            <Label>Skills</Label>
            <TagListEditor items={settings.resumeSkills || []} onChange={(items) => set('resumeSkills', items)} placeholder="e.g. TypeScript" />
          </div>

          <div>
            <Label>Experience</Label>
            <RepeaterList
              items={settings.experience || []}
              onChange={(items) => set('experience', items)}
              itemLabel="Role"
              newItem={{ role: '', period: '', description: '', order: 0 }}
              fields={[
                { key: 'role', label: 'Role', placeholder: 'Freelance Developer' },
                { key: 'period', label: 'Period', placeholder: '2025 — Present' },
                { key: 'description', label: 'Description', type: 'textarea' },
              ]}
            />
          </div>

          <div>
            <Label>Education</Label>
            <RepeaterList
              items={settings.education || []}
              onChange={(items) => set('education', items)}
              itemLabel="School"
              newItem={{ school: '', degree: '', period: '', order: 0 }}
              fields={[
                { key: 'school', label: 'School', placeholder: 'Lovely Professional University' },
                { key: 'degree', label: 'Degree', placeholder: 'B.Tech CSE' },
                { key: 'period', label: 'Period', placeholder: '2023 — 2027' },
              ]}
            />
          </div>
        </div>
      )}

      {tab === 'Content Creator' && (
        <div className="mt-8 max-w-2xl space-y-8 rounded-3xl border border-border bg-white p-5 shadow-soft md:p-6">
          <div>
            <Label>Platforms</Label>
            <p className="mb-2 text-xs text-ink/40">Icon names come from lucide-react (e.g. Youtube, Instagram, Linkedin, Twitter).</p>
            <RepeaterList
              items={settings.platforms || []}
              onChange={(items) => set('platforms', items)}
              itemLabel="Platform"
              newItem={{ name: '', icon: 'Globe', handle: '', description: '', href: '', order: 0 }}
              fields={[
                { key: 'name', label: 'Platform name' },
                { key: 'icon', label: 'Icon name (lucide-react)' },
                { key: 'handle', label: 'Handle' },
                { key: 'description', label: 'Description' },
                { key: 'href', label: 'Link URL' },
              ]}
            />
          </div>
          <div>
            <Label>Videos / Shorts</Label>
            <RepeaterList
              items={settings.videos || []}
              onChange={(items) => set('videos', items)}
              itemLabel="Video"
              newItem={{ title: '', tag: '', thumbnail: '', href: '', order: 0 }}
              fields={[
                { key: 'title', label: 'Title' },
                { key: 'tag', label: 'Tag', placeholder: 'Tutorial' },
                { key: 'thumbnail', label: 'Thumbnail', type: 'image' },
                { key: 'href', label: 'Link URL' },
              ]}
            />
          </div>
        </div>
      )}

      {tab === 'Footer' && (
        <div className="mt-8 max-w-2xl space-y-8 rounded-3xl border border-border bg-white p-5 shadow-soft md:p-6">
          <div><Label>Footer tagline (falls back to site tagline if blank)</Label><Textarea value={settings.footerTagline} onChange={(e) => set('footerTagline', e.target.value)} /></div>
          <div><Label>Copyright line (falls back to auto-generated if blank)</Label><Input value={settings.footerCopyright} onChange={(e) => set('footerCopyright', e.target.value)} /></div>
          <div>
            <Label>Social links</Label>
            <p className="mb-2 text-xs text-ink/40">Icon names come from lucide-react (e.g. Github, Linkedin, Youtube, Twitter, Instagram).</p>
            <RepeaterList
              items={settings.footerSocials || []}
              onChange={(items) => set('footerSocials', items)}
              itemLabel="Social link"
              newItem={{ label: '', href: '', icon: 'Globe', order: 0 }}
              fields={[
                { key: 'label', label: 'Label' },
                { key: 'href', label: 'URL' },
                { key: 'icon', label: 'Icon name' },
              ]}
            />
          </div>
        </div>
      )}

      {tab === 'Page Copy' && (
        <div className="mt-8 max-w-xl space-y-5 rounded-3xl border border-border bg-white p-5 shadow-soft md:p-6">
          <div><Label>Projects page title</Label><Input value={settings.projectsPageTitle} onChange={(e) => set('projectsPageTitle', e.target.value)} /></div>
          <div><Label>Projects page subtitle</Label><Textarea value={settings.projectsPageSubtitle} onChange={(e) => set('projectsPageSubtitle', e.target.value)} /></div>
          <div>
            <Label>Project category filters</Label>
            <TagListEditor items={settings.projectCategories || []} onChange={(items) => set('projectCategories', items)} placeholder="e.g. SaaS" />
          </div>
          <div><Label>Services page title</Label><Input value={settings.servicesPageTitle} onChange={(e) => set('servicesPageTitle', e.target.value)} /></div>
          <div><Label>Services page subtitle</Label><Textarea value={settings.servicesPageSubtitle} onChange={(e) => set('servicesPageSubtitle', e.target.value)} /></div>
          <div><Label>Blog page title</Label><Input value={settings.blogPageTitle} onChange={(e) => set('blogPageTitle', e.target.value)} /></div>
          <div><Label>Blog page subtitle</Label><Textarea value={settings.blogPageSubtitle} onChange={(e) => set('blogPageSubtitle', e.target.value)} /></div>
          <div><Label>Content Creator page title</Label><Input value={settings.contentPageTitle} onChange={(e) => set('contentPageTitle', e.target.value)} /></div>
          <div><Label>Content Creator page subtitle</Label><Textarea value={settings.contentPageSubtitle} onChange={(e) => set('contentPageSubtitle', e.target.value)} /></div>
        </div>
      )}
    </div>
  );
}
