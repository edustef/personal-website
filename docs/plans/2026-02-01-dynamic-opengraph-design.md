# Dynamic OpenGraph Images Design

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add dynamic OpenGraph images to blog listing, blog posts, start-your-project, and privacy-policy pages using a shared generator with the site's dark gradient background and Cardo font.

**Architecture:** Shared OG image generator utility with per-route `opengraph-image.tsx` files following Next.js App Router conventions.

**Tech Stack:** Next.js `next/og` ImageResponse API, Google Fonts (Cardo), base64-encoded background image

---

## Visual Design

**Dimensions:** 1200×630 pixels (standard OG size)

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                   [dark gradient bg]                        │
│                                                             │
│                                                             │
│                     Page/Post Title                         │  ← Cardo Bold, white, centered
│                      (max 2 lines)                          │     ~60px font size
│                                                             │
│                                                             │
│                     eduardbme.com                           │  ← Cardo Regular, muted gray
│                                                             │     ~24px font size
└─────────────────────────────────────────────────────────────┘
```

**Colors:**
- Title: `#ffffff` (white)
- Site name: `#a1a1aa` (zinc-400, muted)
- Background: `opengraph-bg.png` (dark gradient with subtle glow)

---

## Task 1: Create Shared OG Image Generator

**Files:**
- Create: `frontend/lib/og-image.tsx`

**Step 1: Create the shared generator**

```tsx
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_SIZE = {
  width: 1200,
  height: 630,
};

export const OG_CONTENT_TYPE = "image/png";

async function loadAssets() {
  // Load background image as base64
  const bgImageData = await readFile(
    join(process.cwd(), "assets/images/opengraph-bg.png")
  );
  const bgImageSrc = `data:image/png;base64,${bgImageData.toString("base64")}`;

  // Load Cardo font from Google Fonts
  const cardoBold = await fetch(
    "https://fonts.gstatic.com/s/cardo/v19/wlpygwjKBV1pqhND-aQR82JHaTBX.ttf"
  ).then((res) => res.arrayBuffer());

  const cardoRegular = await fetch(
    "https://fonts.gstatic.com/s/cardo/v19/wlp_gwjKBV1pqiv_1oAZ2H5O.ttf"
  ).then((res) => res.arrayBuffer());

  return { bgImageSrc, cardoBold, cardoRegular };
}

export async function generateOgImage(title: string, siteName = "eduardbme.com") {
  const { bgImageSrc, cardoBold, cardoRegular } = await loadAssets();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Background Image */}
        <img
          src={bgImageSrc}
          alt=""
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Content Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 80px",
            textAlign: "center",
            position: "relative",
            height: "100%",
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: 60,
              fontFamily: "Cardo",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.2,
              maxWidth: "1000px",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {title}
          </div>

          {/* Site Name */}
          <div
            style={{
              position: "absolute",
              bottom: 60,
              fontSize: 24,
              fontFamily: "Cardo",
              fontWeight: 400,
              color: "#a1a1aa",
            }}
          >
            {siteName}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        {
          name: "Cardo",
          data: cardoBold,
          style: "normal",
          weight: 700,
        },
        {
          name: "Cardo",
          data: cardoRegular,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
```

**Step 2: Commit**

```bash
git add frontend/lib/og-image.tsx
git commit -m "feat(og): add shared OpenGraph image generator"
```

---

## Task 2: Add OG Image for Blog Listing

**Files:**
- Create: `frontend/app/[locale]/(website)/blog/opengraph-image.tsx`

**Step 1: Create the OG image route**

```tsx
import { generateOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og-image";

export const alt = "Blog";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Localized titles
  const titles: Record<string, string> = {
    en: "Blog",
    es: "Blog",
    ro: "Blog",
  };

  const title = titles[locale] || titles.en;

  return generateOgImage(title);
}
```

**Step 2: Commit**

```bash
git add frontend/app/[locale]/(website)/blog/opengraph-image.tsx
git commit -m "feat(og): add dynamic OG image for blog listing"
```

---

## Task 3: Add OG Image for Blog Posts

**Files:**
- Create: `frontend/app/[locale]/(website)/blog/[slug]/opengraph-image.tsx`

**Step 1: Create the OG image route**

```tsx
import { getBlogPost } from "@/lib/blog";
import { generateOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og-image";

export const alt = "Blog Post";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getBlogPost(slug, locale);

  const title = post?.title || "Blog Post";

  return generateOgImage(title);
}
```

**Step 2: Commit**

```bash
git add frontend/app/[locale]/(website)/blog/[slug]/opengraph-image.tsx
git commit -m "feat(og): add dynamic OG image for blog posts"
```

---

## Task 4: Add OG Image for Start Your Project

**Files:**
- Create: `frontend/app/[locale]/(website)/start-your-project/opengraph-image.tsx`

**Step 1: Create the OG image route**

```tsx
import { generateOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og-image";

export const alt = "Start Your Project";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Localized titles
  const titles: Record<string, string> = {
    en: "Start Your Project",
    es: "Inicia Tu Proyecto",
    ro: "Începe Proiectul Tău",
  };

  const title = titles[locale] || titles.en;

  return generateOgImage(title);
}
```

**Step 2: Commit**

```bash
git add frontend/app/[locale]/(website)/start-your-project/opengraph-image.tsx
git commit -m "feat(og): add dynamic OG image for start-your-project"
```

---

## Task 5: Add OG Image for Privacy Policy

**Files:**
- Create: `frontend/app/[locale]/(website)/privacy-policy/opengraph-image.tsx`

**Step 1: Create the OG image route**

```tsx
import { generateOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og-image";

export const alt = "Privacy Policy";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Localized titles
  const titles: Record<string, string> = {
    en: "Privacy Policy",
    es: "Política de Privacidad",
    ro: "Politica de Confidențialitate",
  };

  const title = titles[locale] || titles.en;

  return generateOgImage(title);
}
```

**Step 2: Commit**

```bash
git add frontend/app/[locale]/(website)/privacy-policy/opengraph-image.tsx
git commit -m "feat(og): add dynamic OG image for privacy-policy"
```

---

## Task 6: Test and Verify

**Step 1: Run the development server**

```bash
cd frontend && npm run dev
```

**Step 2: Test OG images directly**

Visit these URLs in your browser to see the generated images:
- `http://localhost:3000/en/blog/opengraph-image`
- `http://localhost:3000/en/blog/[any-existing-slug]/opengraph-image`
- `http://localhost:3000/en/start-your-project/opengraph-image`
- `http://localhost:3000/en/privacy-policy/opengraph-image`

**Step 3: Verify meta tags**

Use browser DevTools to check that `<meta property="og:image">` tags are generated correctly on each page.

**Step 4: Test with social media debuggers**

- Facebook: https://developers.facebook.com/tools/debug/
- Twitter: https://cards-dev.twitter.com/validator
- LinkedIn: https://www.linkedin.com/post-inspector/

---

## Summary

This plan creates:
- 1 shared generator (`lib/og-image.tsx`)
- 4 OG image routes for blog, blog posts, start-your-project, and privacy-policy
- Localized titles for all 3 languages (en, es, ro)
- Consistent dark gradient background with Cardo font

Total tasks: 6
