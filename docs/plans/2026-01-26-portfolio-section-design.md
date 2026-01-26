# Portfolio Section Design

## Overview

Add a portfolio section to the personal website showcasing 3 projects with homepage cards and detailed MDX case study pages. Supports all 3 languages (en, es, ro).

### Projects

1. **Citadella** — Restaurant landing page ([live](https://citadella-heritage-design.vercel.app/))
2. **Barbershop** — Appointment booking demo ([live](https://barbershop-booking-demo.vercel.app/))
3. **OmniShoppingApp** — E-commerce app (coming soon)

### Assets Available

- Static images: `frontend/assets/projects/{barbershop,citadella}/`
- Videos in Cloudflare R2 bucket `personal-website`:
  - `barbershop-desktop-video.mp4`, `barbershop-mobile-video.mp4`
  - `citadella-desktop-video.mp4`, `citadella-mobile-video.mp4`

---

## Data Structure

### Project Data Model

```typescript
type ProjectStatus = 'live' | 'coming-soon';

type Project = {
  id: string;              // Cross-locale identifier (e.g., 'citadella')
  slug: string;            // URL-friendly name per locale
  title: string;
  description: string;     // Short tagline for homepage card
  category: string;        // Type label (e.g., "Restaurant Landing Page")
  status: ProjectStatus;
  liveUrl?: string;        // Optional for coming soon
  coverImage: string;      // Static image path for fallback
  desktopVideo: string;    // R2 URL
  mobileVideo: string;     // R2 URL
  techStack: string[];
  date: string;
  featured?: boolean;
};
```

### Content File Structure

```
content/
  portfolio/
    en/
      citadella.mdx
      barbershop.mdx
      omnishoppingapp.mdx
    es/
      citadella.mdx
      barbershop.mdx
      omnishoppingapp.mdx
    ro/
      citadella.mdx
      barbershop.mdx
      omnishoppingapp.mdx
```

### MDX Frontmatter

```yaml
---
id: citadella
title: "Citadella Heritage Restaurant"
description: "Elegant dining experience meets modern web design"
category: "Restaurant Landing Page"
status: live
liveUrl: "https://citadella-heritage-design.vercel.app/"
coverImage: "/assets/projects/citadella/citadella-desktop.png"
desktopVideo: "https://pub-[bucket-id].r2.dev/citadella-desktop-video.mp4"
mobileVideo: "https://pub-[bucket-id].r2.dev/citadella-mobile-video.mp4"
techStack: ["Next.js", "Tailwind CSS", "Framer Motion"]
date: "2025-12-01"
---
```

---

## Homepage Portfolio Section

### Position

After `ServicesSection`, before `ToolsSection` in the homepage.

### Component: `PortfolioSection`

Location: `frontend/components/sections/portfolio-section.tsx`

### Desktop Layout (md+)

- 2-column grid
- Static cover image shown initially
- Video autoplays when card enters viewport
- Title and category overlaid at bottom with gradient backdrop
- "Coming Soon" badge in top-right for unreleased projects

### Mobile Layout

- Single column, full-width cards
- Mobile video variant used (smaller file size)
- Same autoplay-on-intersection behavior

### Card Interactions

- Hover: Subtle scale transform (1.02)
- Click: Navigates to `/portfolio/[slug]`
- Coming soon projects: Navigate to teaser page (no live link button)

---

## Video Component

### Component: `ProjectVideo`

Location: `frontend/components/project-video.tsx`

Client component with Safari-compliant autoplay.

### HTML Attributes

```tsx
<video
  muted                    // Required for autoplay
  loop                     // Continuous playback
  playsInline             // Prevents fullscreen on iOS Safari
  autoPlay                // Fallback attribute
  preload="metadata"      // Load dimensions without full video
  poster={coverImage}     // Fallback image
>
  <source src={videoUrl} type="video/mp4" />
</video>
```

### Behavior

- Intersection Observer triggers `play()` when entering viewport
- `pause()` when exiting viewport (save resources)
- Responsive source swap: desktop video on `md+`, mobile video below
- Cover image shown as poster until video loads

---

## Project Detail Pages

### Route

`/[locale]/portfolio/[slug]/page.tsx`

### Page Structure

1. **Hero Section**
   - Full-width video player (responsive desktop/mobile variant)
   - Same autoplay/muted/loop/playsInline behavior
   - Project title and category
   - "View Live Site" button (hidden for coming soon)

2. **MDX Content** — Case study body:
   - Overview / Introduction
   - The Challenge
   - The Solution
   - Key Features (with screenshots)
   - Tech Stack (visual badges)
   - Results & Outcomes
   - Screenshots gallery

3. **Navigation Footer**
   - Previous/Next Project links
   - Back to Portfolio link
   - Contact CTA

### Custom MDX Components

Extend existing `mdxComponents`:

- `<TechStack>` — Renders technology badges
- `<Screenshot>` — Optimized image with lightbox
- `<VideoEmbed>` — Inline videos within content
- `<FeatureList>` — Styled feature cards

---

## Library Helper

### File: `lib/portfolio.ts`

Mirrors `lib/blog.ts` pattern.

```typescript
// Get all projects for a locale
export async function getPortfolioProjects(locale: string): Promise<Project[]>

// Get single project by slug and locale
export async function getPortfolioProject(slug: string, locale: string): Promise<Project | null>

// Get all slugs for static generation
export async function getAllProjectSlugs(): Promise<{ slug: string; locale: string }[]>

// Get project translations for language switcher
export async function getProjectTranslations(slug: string, locale: string): Promise<{ locale: string; slug: string }[]>
```

---

## Translations

### New Namespace: `portfolio`

Add to `messages/{en,es,ro}.json`:

```json
{
  "portfolio": {
    "label": "Portfolio",
    "headline": "Featured Work",
    "subtitle": "Real projects, real results. See how I help businesses succeed online.",
    "viewProject": "View Project",
    "viewLive": "View Live Site",
    "comingSoon": "Coming Soon",
    "techStack": "Tech Stack",
    "backToPortfolio": "Back to Portfolio",
    "nextProject": "Next Project",
    "previousProject": "Previous Project",
    "challenge": "The Challenge",
    "solution": "The Solution",
    "features": "Key Features",
    "results": "Results"
  }
}
```

---

## Generated Content

### Citadella (Restaurant Landing Page)

**Theme**: Heritage restaurant in historic location, elegant design meeting modern functionality.

**Content Sections**:
- Challenge: Convey 30+ years of culinary tradition through digital presence
- Solution: Atmospheric imagery, smooth animations, reservation integration
- Features: Multilingual menu, reservation system, gallery, responsive design
- Tech: Next.js, Tailwind CSS, Framer Motion

### Barbershop (Appointment Booking Demo)

**Theme**: Modern barbershop with streamlined booking experience.

**Content Sections**:
- Challenge: Reduce phone bookings, provide 24/7 appointment access
- Solution: Intuitive step-by-step booking flow, real-time availability
- Features: Service selection, barber preference, time slots, SMS confirmations
- Tech: Next.js, Tailwind CSS, Calendar integration

### OmniShoppingApp (Coming Soon)

**Theme**: Next-generation e-commerce experience.

**Content Sections**:
- Vision: Unified shopping experience across brands
- Planned Features: Smart search, personalized recommendations, seamless checkout
- Tech Stack: Next.js, React Native, Headless commerce
- Status: In active development

---

## File Changes Summary

### New Files

- `frontend/components/sections/portfolio-section.tsx`
- `frontend/components/project-video.tsx`
- `frontend/components/project-card.tsx`
- `frontend/lib/portfolio.ts`
- `frontend/app/[locale]/(website)/portfolio/page.tsx` (optional listing page)
- `frontend/app/[locale]/(website)/portfolio/[slug]/page.tsx`
- `frontend/content/portfolio/{en,es,ro}/*.mdx` (9 files)

### Modified Files

- `frontend/app/[locale]/(website)/page.tsx` — Add PortfolioSection
- `frontend/messages/en.json` — Add portfolio namespace
- `frontend/messages/es.json` — Add portfolio namespace
- `frontend/messages/ro.json` — Add portfolio namespace

---

## Implementation Order

1. Create `lib/portfolio.ts` helper
2. Create `ProjectVideo` component
3. Create `ProjectCard` component
4. Create `PortfolioSection` component
5. Add section to homepage
6. Create portfolio detail page route
7. Add MDX components for case studies
8. Create all MDX content files (9 files)
9. Add translation keys to all locales
10. Test responsive behavior and video autoplay
