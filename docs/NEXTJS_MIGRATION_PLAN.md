# Next.js Migration Plan for Personal Blog

> **Current Stack**: React 19 + Vite (SPA) → **Target Stack**: Next.js 15 (App Router with SSG)

## Executive Summary

This document outlines a comprehensive migration strategy to convert your Vite-based React SPA into a Next.js application with full Static Site Generation (SSG), dramatically improving SEO, performance, and scalability.

---

## Why Migrate?

| Problem with Current SPA | Solution with Next.js |
|--------------------------|----------------------|
| JavaScript required before content renders | Static HTML pre-rendered at build time |
| Single `index.html` for all routes | Unique HTML per page with proper meta tags |
| Manual SEO workarounds (`react-helmet-async`) | Built-in `generateMetadata()` and `metadata` API |
| Client-side routing only | File-based routing with SSG/SSR options |
| Custom scripts for sitemap/RSS | Official integrations and build-time generation |
| No image optimization | Automatic `next/image` optimization |

---

## Current Architecture Overview

```
personal-blog/
├── src/
│   ├── App.tsx              # Main app with BrowserRouter
│   ├── main.tsx             # Client-side entry point
│   ├── config.ts            # Site configuration
│   ├── pages/               # 7 page components
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Archive.tsx
│   │   ├── Post.tsx
│   │   ├── Projects.tsx
│   │   ├── Experience.tsx
│   │   └── TagArchive.tsx
│   ├── components/
│   │   ├── SEO.tsx          # react-helmet-async wrapper
│   │   ├── StructuredData.tsx
│   │   ├── post/            # 17 post-related components
│   │   └── ui/              # 10 UI components
│   ├── features/
│   │   ├── system/          # Boot screen, alerts, screensaver
│   │   └── terminal/        # Commander, command line, games
│   ├── hooks/               # 5 custom hooks
│   └── utils/               # 3 utility files
├── content/posts/           # Markdown blog posts
├── scripts/                 # Build-time generation scripts
└── public/                  # Static assets
```

---

## Target Architecture (Next.js App Router)

```
personal-blog/
├── app/                     # Next.js App Router
│   ├── layout.tsx           # Root layout (replaces App.tsx shell)
│   ├── page.tsx             # Home page (/)
│   ├── about/page.tsx       # About page (/about)
│   ├── archive/page.tsx     # Archive page (/archive)
│   ├── projects/page.tsx    # Projects page (/projects)
│   ├── experience/page.tsx  # Experience page (/experience)
│   ├── post/[slug]/page.tsx # Dynamic blog post pages (/post/*)
│   ├── tags/[tag]/page.tsx  # Tag archive pages (/tags/*)
│   ├── rss.xml/route.ts     # RSS feed (Route Handler)
│   └── sitemap.ts           # Sitemap generation
├── components/              # Shared React components
│   ├── post/
│   ├── ui/
│   └── features/
├── lib/                     # Utilities and helpers
│   ├── posts.ts             # Post fetching logic
│   └── config.ts            # Site configuration
├── content/posts/           # Markdown blog posts (unchanged)
├── public/                  # Static assets (unchanged)
└── next.config.ts           # Next.js configuration
```

---

## Migration Phases

### Phase 1: Project Initialization

1. Create new Next.js project alongside existing code:
   ```bash
   npx create-next-app@latest personal-blog-next --typescript --tailwind=no --eslint --app --src-dir=no
   ```

2. Copy and adapt configuration:
   - `src/config.ts` → `lib/config.ts`
   - Create `next.config.ts` with image domains, redirects

3. Set up CSS:
   - Copy `src/index.css` → `app/globals.css`
   - Copy `src/App.css` → `app/app.css`

4. **Font Setup (Use `next/font` instead of `@fontsource`)**:

   Next.js has a built-in font optimizer that prevents layout shift (CLS) and automatically hosts font files. This is preferred over `@fontsource`.

   ```typescript
   // app/layout.tsx
   import { Inter } from 'next/font/google';

   const inter = Inter({
     subsets: ['latin'],
     display: 'swap',
     variable: '--font-inter',
   });

   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html lang="en" className={inter.className}>
         <body>{children}</body>
       </html>
     );
   }
   ```

   > [!TIP]
   > This eliminates the need for `@fontsource/inter` package and reduces bundle size while improving font loading performance.

---

### Phase 2: Content Layer Migration

#### Current: Build-time JSON generation
```typescript
// scripts/generate-posts.ts → reads .md → writes .json
```

#### Next.js: Direct Markdown reading with caching
```typescript
// lib/posts.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export function getAllPosts(): Post[] {
  const files = fs.readdirSync(postsDirectory)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'));
  
  return files.map(filename => {
    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug: filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, ''),
      title: data.title,
      date: data.date,
      content,
      ...data
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find(post => post.slug === slug);
}
```

> [!TIP]
> Next.js will cache these file reads at build time, generating static HTML for each post.

---

### Phase 3: Route Migration

#### Page Component Mapping

| Current (Vite) | Next.js (App Router) | Rendering |
|----------------|----------------------|-----------|
| `pages/Home.tsx` | `app/page.tsx` | SSG |
| `pages/About.tsx` | `app/about/page.tsx` | SSG |
| `pages/Archive.tsx` | `app/archive/page.tsx` | SSG |
| `pages/Post.tsx` | `app/post/[slug]/page.tsx` | SSG with `generateStaticParams` |
| `pages/Projects.tsx` | `app/projects/page.tsx` | SSG |
| `pages/Experience.tsx` | `app/experience/page.tsx` | SSG |
| `pages/TagArchive.tsx` | `app/tags/[tag]/page.tsx` | SSG with `generateStaticParams` |

#### Dynamic Route Example: Blog Post

```typescript
// app/post/[slug]/page.tsx
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PostContent from '@/components/post/PostContent';

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate static paths at build time
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

// Generate metadata per page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) return { title: 'Post Not Found' };
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: ['Lalit Madan'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) notFound();
  
  return <PostContent post={post} />;
}
```

---

### Phase 4: Component Migration

#### Components That Work As-Is (Copy Directly)
Most of your React components are client-side UI and can be copied with minimal changes:

- `components/ui/*` → Add `'use client'` directive
- `components/post/*` → Add `'use client'` where needed
- `features/terminal/*` → Add `'use client'` (interactive)
- `features/system/*` → Add `'use client'` (interactive)

#### Components That Need Refactoring

| Component | Current | Next.js Approach |
|-----------|---------|------------------|
| `SEO.tsx` | `react-helmet-async` | Remove entirely, use `generateMetadata()` |
| `StructuredData.tsx` | Helmet injection | Use Next.js `<script>` in layout or page |
| `usePosts.ts` | Client-side fetch | Server-side `getAllPosts()` |

#### Server vs Client Components

```
┌─────────────────────────────────────────────────┐
│ Server Components (Default)                      │
│ - Layout, Page components                        │
│ - Data fetching (posts, metadata)               │
│ - Static content                                 │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│ Client Components ('use client')                 │
│ - Commander modal (keyboard events)             │
│ - CommandLine (input handling)                  │
│ - BootScreen (animations)                       │
│ - Screensaver (idle detection)                  │
│ - SnakeGame (game logic)                        │
│ - AudioPlayer (media controls)                  │
│ - Theme toggle (localStorage)                   │
│ - Sound hooks (audio playback)                  │
└─────────────────────────────────────────────────┘
```

#### Navigation Hooks Refactoring (Crucial)

Your `CommandLine` and `Commander` components currently use `useNavigate` from `react-router-dom`. Next.js uses a different API:

| react-router-dom | next/navigation | Notes |
|------------------|-----------------|-------|
| `useNavigate()` | `useRouter()` | Import from `next/navigation` |
| `navigate('/path')` | `router.push('/path')` | Same behavior |
| `useLocation()` | `usePathname()` | For active tab highlighting |
| `useParams()` | `useParams()` | Same name, different import |

**Before (react-router-dom):**
```typescript
import { useNavigate, useLocation } from 'react-router-dom';

function CommandLine() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleCommand = (path: string) => {
    navigate(path);
  };
  
  const isActive = location.pathname === '/about';
}
```

**After (next/navigation):**
```typescript
'use client';
import { useRouter, usePathname } from 'next/navigation';

function CommandLine() {
  const router = useRouter();
  const pathname = usePathname();
  
  const handleCommand = (path: string) => {
    router.push(path);
  };
  
  const isActive = pathname === '/about';
}
```

> [!IMPORTANT]
> Search through all files for `useNavigate`, `useLocation`, and `useParams` imports from `react-router-dom` and update them to use `next/navigation`.

#### Markdown Images

Your current Markdown uses standard images (`![alt](/path.png)`).

- **For initial migration**: Standard `<img>` tags work fine with `react-markdown`. No changes needed.
- **For future optimization**: Create a custom renderer to swap `<img>` for `next/image`:

```typescript
// Optional: components/MarkdownImage.tsx (for future optimization)
import Image from 'next/image';

export function MarkdownImage({ src, alt }: { src?: string; alt?: string }) {
  if (!src) return null;
  
  // For external images or if width/height unknown, use standard img
  if (src.startsWith('http')) {
    return <img src={src} alt={alt || ''} />;
  }
  
  // For local images with known dimensions
  return (
    <Image
      src={src}
      alt={alt || ''}
      width={800}
      height={400}
      style={{ width: '100%', height: 'auto' }}
    />
  );
}
```

> [!NOTE]
> For the initial migration, **skip this optimization** and use standard `<img>` tags. You can add `next/image` later for performance gains.

---

### Phase 5: SEO Migration

#### Current Approach (Delete These)
```typescript
// ❌ Remove: src/components/SEO.tsx
// ❌ Remove: react-helmet-async from package.json
// ❌ Remove: Vite injectMetaTags plugin
```

#### Next.js Approach

**Root Layout Metadata:**
```typescript
// app/layout.tsx
import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/config';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.author}`,
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords.split(', '),
  authors: [{ name: SITE_CONFIG.author }],
  creator: SITE_CONFIG.author,
  openGraph: {
    type: 'website',
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.title,
    images: [{ url: SITE_CONFIG.defaultImage }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: SITE_CONFIG.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

**Sitemap Generation:**
```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { SITE_CONFIG } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  
  const blogEntries = posts.map(post => ({
    url: `${SITE_CONFIG.url}/post/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    { url: SITE_CONFIG.url, lastModified: new Date(), priority: 1.0 },
    { url: `${SITE_CONFIG.url}/about`, priority: 0.9 },
    { url: `${SITE_CONFIG.url}/projects`, priority: 0.9 },
    { url: `${SITE_CONFIG.url}/archive`, priority: 0.7 },
    ...blogEntries,
  ];
}
```

**RSS Feed:**
```typescript
// app/rss.xml/route.ts
import { getAllPosts } from '@/lib/posts';
import { SITE_CONFIG } from '@/lib/config';

export async function GET() {
  const posts = getAllPosts();
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_CONFIG.title}</title>
    <link>${SITE_CONFIG.url}</link>
    <description>${SITE_CONFIG.description}</description>
    <atom:link href="${SITE_CONFIG.url}/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts.map(post => `
    <item>
      <title>${post.title}</title>
      <link>${SITE_CONFIG.url}/post/${post.slug}</link>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${post.excerpt}</description>
    </item>`).join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
```

---

### Phase 6: Feature Migration

#### Interactive Features (Client Components)

Your unique terminal-style features require client-side JavaScript:

```typescript
// components/features/ClientShell.tsx
'use client';

import { useState, useEffect } from 'react';
import Commander from './terminal/Commander';
import CommandLine from './terminal/CommandLine';
import BootScreen from './system/BootScreen';
import SystemAlert from './system/SystemAlert';
import Screensaver from './system/Screensaver';
import StatusBar from '../ui/StatusBar';
import useSound from '@/hooks/useSound';
import useKonamiCode from '@/hooks/useKonamiCode';
import { useTheme } from '@/hooks/useTheme';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [booted, setBooted] = useState(false);
  const [commanderOpen, setCommanderOpen] = useState(false);
  
  // ... rest of your App.tsx logic
  
  useEffect(() => {
    // Check sessionStorage for boot state
    setBooted(!!sessionStorage.getItem('hasBooted'));
  }, []);

  if (!booted) {
    return <BootScreen onComplete={() => {
      setBooted(true);
      sessionStorage.setItem('hasBooted', 'true');
    }} />;
  }

  return (
    <div className="app tui-window fade-in">
      <SystemAlert />
      <Screensaver />
      <Commander isOpen={commanderOpen} onClose={() => setCommanderOpen(false)} />
      <StatusBar />
      <main className="content-area">{children}</main>
      <CommandLine />
    </div>
  );
}
```

**Root Layout Integration:**
```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';
import ClientShell from '@/components/features/ClientShell';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <ClientShell>{children}</ClientShell>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

### Phase 7: Hooks Migration

| Hook | Current | Migration Notes |
|------|---------|-----------------|
| `useTheme.ts` | localStorage access | Wrap in `useEffect`, add SSR safety |
| `useSound.ts` | Audio API | Already client-only, add `'use client'` |
| `usePosts.ts` | Fetch from `/public/posts/` | **Delete** - use server-side `getAllPosts()` |
| `useKonamiCode.ts` | Keyboard events | Already client-only, add `'use client'` |
| `useCounter.ts` | Animation hook | Already client-only, add `'use client'` |

---

### Phase 8: Configuration & Deployment

**next.config.ts:**
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Static export for Vercel static hosting
  images: {
    unoptimized: true, // For static export, or remove if using Vercel hosting
  },
  trailingSlash: false,
  async redirects() {
    return [
      // Add any legacy URL redirects here
    ];
  },
};

export default nextConfig;
```

> [!IMPORTANT]
> If you keep Vercel hosting, you can remove `output: 'export'` to get automatic image optimization and ISR capabilities.

**Environment Variables:**
```bash
# .env.local (if needed)
NEXT_PUBLIC_SITE_URL=https://lalitmadan.com
```

---

## Dependency Changes

### Remove
```json
{
  "react-helmet-async": "remove",
  "@vitejs/plugin-react": "remove",
  "vite": "remove"
}
```

### Keep
```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "framer-motion": "^12.23.26",
  "lucide-react": "^0.561.0",
  "react-markdown": "^10.1.0",
  "rehype-highlight": "^7.0.2",
  "remark-gfm": "^4.0.1",
  "@vercel/analytics": "keep",
  "@vercel/speed-insights": "keep",
  "gray-matter": "keep (move to dependencies)"
}
```

### Add
```json
{
  "next": "^15.x.x"
}
```

---

## File Deletion Checklist

After successful migration, remove:

- [ ] `vite.config.ts`
- [ ] `scripts/generate-posts.ts` (replaced by server-side reading)
- [ ] `scripts/generate-sitemap.ts` (replaced by `app/sitemap.ts`)
- [ ] `scripts/generate-rss.ts` (replaced by `app/rss.xml/route.ts`)
- [ ] `src/main.tsx`
- [ ] `src/App.tsx` (logic moved to `layout.tsx` + `ClientShell`)
- [ ] `src/components/SEO.tsx`
- [ ] `src/hooks/usePosts.ts`
- [ ] `vercel.json` (rewrites no longer needed)
- [ ] `index.html`

---

## Migration Timeline

| Phase | Estimated Time | Priority |
|-------|----------------|----------|
| Phase 1: Initialization | 1-2 hours | 🔴 Critical |
| Phase 2: Content Layer | 2-3 hours | 🔴 Critical |
| Phase 3: Route Migration | 4-6 hours | 🔴 Critical |
| Phase 4: Component Migration | 3-4 hours | 🟡 High |
| Phase 5: SEO Migration | 2-3 hours | 🔴 Critical |
| Phase 6: Feature Migration | 3-4 hours | 🟡 High |
| Phase 7: Hooks Migration | 1-2 hours | 🟢 Medium |
| Phase 8: Config & Deploy | 1-2 hours | 🔴 Critical |

**Total Estimated Time: 17-26 hours**

---

## Verification Plan

### Build Verification
```bash
# Build the static site
npm run build

# Preview the production build locally
npm run start
```

### SEO Verification
1. Check each page's HTML source for proper `<title>`, `<meta>` tags
2. Verify `sitemap.xml` is accessible at `/sitemap.xml`
3. Verify `rss.xml` is accessible at `/rss.xml`
4. Test with [Google Rich Results Test](https://search.google.com/test/rich-results)
5. Test with [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Functional Verification
1. All routes render correctly
2. Boot screen animation works
3. Commander modal opens with Shift+M
4. Theme switching persists
5. Konami code easter egg works
6. Blog post navigation works
7. Tag filtering works

### Performance Verification
```bash
# Analyze bundle size
npx @next/bundle-analyzer
```

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Interactive features break | Proper `'use client'` boundaries, thorough testing |
| SEO regression | Compare before/after Lighthouse scores |
| Build failures | Incremental migration, keep Vite build as fallback |
| Vercel deployment issues | Test with `vercel dev` before production deploy |

---

## Post-Migration Benefits

- ✅ **SEO**: Every page has unique, crawlable HTML
- ✅ **Performance**: Static HTML served instantly
- ✅ **Scalability**: Easy to add ISR if content grows
- ✅ **DX**: No more custom scripts for sitemap/RSS
- ✅ **Future-proof**: Next.js has strong ecosystem and support
