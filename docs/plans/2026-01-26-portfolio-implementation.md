# Portfolio Section Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a portfolio section to the homepage with video cards and detailed MDX case study pages for 3 projects in 3 languages.

**Architecture:** MDX-based content mirroring the existing blog pattern. Homepage section displays project cards with autoplay videos on viewport intersection. Individual project pages render MDX case studies with custom components.

**Tech Stack:** Next.js 15, MDX (next-mdx-remote/rsc), Framer Motion, Tailwind CSS, next-intl, Cloudflare R2 for videos

---

## Task 1: Create Portfolio Library Helper

**Files:**
- Create: `frontend/lib/portfolio.ts`

**Step 1: Create the portfolio helper**

```typescript
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const PORTFOLIO_DIR = path.join(process.cwd(), "content/portfolio");

export type ProjectStatus = "live" | "coming-soon";

export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  status: ProjectStatus;
  liveUrl?: string;
  coverImage: string;
  desktopVideo: string;
  mobileVideo: string;
  techStack: string[];
  date: string;
  content: string;
  locale: string;
};

export async function getPortfolioProjects(locale: string): Promise<Project[]> {
  const localeDir = path.join(PORTFOLIO_DIR, locale);

  if (!fs.existsSync(localeDir)) {
    return [];
  }

  const files = fs.readdirSync(localeDir);

  const projects = files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const filePath = path.join(localeDir, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContent);

      return {
        id: data.id || file.replace(".mdx", ""),
        slug: file.replace(".mdx", ""),
        title: data.title,
        description: data.description,
        category: data.category,
        status: data.status || "live",
        liveUrl: data.liveUrl,
        coverImage: data.coverImage,
        desktopVideo: data.desktopVideo,
        mobileVideo: data.mobileVideo,
        techStack: data.techStack || [],
        date: data.date,
        content,
        locale,
      } as Project;
    });

  return projects.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPortfolioProject(
  slug: string,
  locale: string
): Promise<Project | null> {
  const filePath = path.join(PORTFOLIO_DIR, locale, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);

  return {
    id: data.id || slug,
    slug,
    title: data.title,
    description: data.description,
    category: data.category,
    status: data.status || "live",
    liveUrl: data.liveUrl,
    coverImage: data.coverImage,
    desktopVideo: data.desktopVideo,
    mobileVideo: data.mobileVideo,
    techStack: data.techStack || [],
    date: data.date,
    content,
    locale,
  };
}

export async function getAllProjectSlugs(): Promise<
  { slug: string; locale: string }[]
> {
  const locales = ["en", "es", "ro"];
  const slugs: { slug: string; locale: string }[] = [];

  for (const locale of locales) {
    const projects = await getPortfolioProjects(locale);
    for (const project of projects) {
      slugs.push({ slug: project.slug, locale });
    }
  }

  return slugs;
}

export async function getProjectTranslations(
  slug: string,
  locale: string
): Promise<{ locale: string; slug: string }[]> {
  const locales = ["en", "es", "ro"];
  const translations: { locale: string; slug: string }[] = [];

  for (const loc of locales) {
    const project = await getPortfolioProject(slug, loc);
    if (project) {
      translations.push({ locale: loc, slug: project.slug });
    }
  }

  return translations;
}
```

**Step 2: Commit**

```bash
git add frontend/lib/portfolio.ts
git commit -m "feat(portfolio): add portfolio library helper"
```

---

## Task 2: Create ProjectVideo Component

**Files:**
- Create: `frontend/components/project-video.tsx`

**Step 1: Create the video component with Safari-compliant autoplay**

```tsx
"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

type ProjectVideoProps = {
  desktopVideo: string;
  mobileVideo: string;
  coverImage: string;
  title: string;
  className?: string;
};

export function ProjectVideo({
  desktopVideo,
  mobileVideo,
  coverImage,
  title,
  className,
}: ProjectVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [isLoaded, setIsLoaded] = useState(false);

  const videoSrc = isMobile ? mobileVideo : desktopVideo;

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;

    if (!video || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Autoplay failed, likely due to browser policy
            });
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      {/* Fallback image shown until video loads */}
      {!isLoaded && (
        <img
          src={coverImage}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        poster={coverImage}
        onLoadedData={() => setIsLoaded(true)}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add frontend/components/project-video.tsx
git commit -m "feat(portfolio): add ProjectVideo component with autoplay"
```

---

## Task 3: Create ProjectCard Component

**Files:**
- Create: `frontend/components/project-card.tsx`

**Step 1: Create the card component**

```tsx
"use client";

import { ProjectVideo } from "@/components/project-video";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/portfolio";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";

type ProjectCardProps = {
  project: Project;
  index: number;
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const t = useTranslations("portfolio");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        href={`/portfolio/${project.slug}`}
        className="group block relative rounded-2xl overflow-hidden bg-muted/50 border border-muted"
      >
        {/* Video/Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <ProjectVideo
            desktopVideo={project.desktopVideo}
            mobileVideo={project.mobileVideo}
            coverImage={project.coverImage}
            title={project.title}
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.02]"
          />

          {/* Coming Soon Badge */}
          {project.status === "coming-soon" && (
            <div className="absolute top-4 right-4 z-10">
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                {t("comingSoon")}
              </Badge>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p className="text-sm font-medium text-primary mb-2">
              {project.category}
            </p>
            <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
              {project.title}
            </h3>
            <p className="text-muted-foreground text-sm md:text-base line-clamp-2">
              {project.description}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
```

**Step 2: Commit**

```bash
git add frontend/components/project-card.tsx
git commit -m "feat(portfolio): add ProjectCard component"
```

---

## Task 4: Create PortfolioSection Component

**Files:**
- Create: `frontend/components/sections/portfolio-section.tsx`

**Step 1: Create the section component**

```tsx
import { AnimatedContainer } from "@/components/ui/animated-container";
import { ProjectCard } from "@/components/project-card";
import { getPortfolioProjects } from "@/lib/portfolio";
import { getLocale, getTranslations } from "next-intl/server";

export default async function PortfolioSection() {
  const locale = await getLocale();
  const projects = await getPortfolioProjects(locale);
  const t = await getTranslations({ locale, namespace: "portfolio" });

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section id="portfolio" className="scroll-mt-12 py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <AnimatedContainer
          trigger="scroll"
          fadeDirection="up"
          className="mb-12 md:mb-16 text-center"
        >
          <p className="text-primary mb-3 text-sm font-medium uppercase tracking-wider">
            {t("label")}
          </p>
          <h2 className="text-foreground mb-4 text-3xl tracking-tight md:text-4xl text-balance">
            <a href="#portfolio" className="hover:text-primary transition-colors">
              {t("headline")}
            </a>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg text-pretty">
            {t("subtitle")}
          </p>
        </AnimatedContainer>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add frontend/components/sections/portfolio-section.tsx
git commit -m "feat(portfolio): add PortfolioSection component"
```

---

## Task 5: Add PortfolioSection to Homepage

**Files:**
- Modify: `frontend/app/[locale]/(website)/page.tsx`

**Step 1: Import and add PortfolioSection after ServicesSection**

Add import at top:
```tsx
import PortfolioSection from "@/components/sections/portfolio-section";
```

Add component after `<ServicesSection />`:
```tsx
<ServicesSection />

<PortfolioSection />

<ToolsSection />
```

**Step 2: Commit**

```bash
git add frontend/app/[locale]/(website)/page.tsx
git commit -m "feat(portfolio): add PortfolioSection to homepage"
```

---

## Task 6: Add Translation Keys

**Files:**
- Modify: `frontend/messages/en.json`
- Modify: `frontend/messages/es.json`
- Modify: `frontend/messages/ro.json`

**Step 1: Add English translations**

Add to `frontend/messages/en.json` (after "blog" section):

```json
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
```

**Step 2: Add Spanish translations**

Add to `frontend/messages/es.json`:

```json
"portfolio": {
  "label": "Portafolio",
  "headline": "Trabajos Destacados",
  "subtitle": "Proyectos reales, resultados reales. Descubre cómo ayudo a las empresas a tener éxito en línea.",
  "viewProject": "Ver Proyecto",
  "viewLive": "Ver Sitio en Vivo",
  "comingSoon": "Próximamente",
  "techStack": "Tecnologías",
  "backToPortfolio": "Volver al Portafolio",
  "nextProject": "Siguiente Proyecto",
  "previousProject": "Proyecto Anterior",
  "challenge": "El Desafío",
  "solution": "La Solución",
  "features": "Características Principales",
  "results": "Resultados"
}
```

**Step 3: Add Romanian translations**

Add to `frontend/messages/ro.json`:

```json
"portfolio": {
  "label": "Portofoliu",
  "headline": "Lucrări Recente",
  "subtitle": "Proiecte reale, rezultate reale. Vezi cum ajut afacerile să reușească online.",
  "viewProject": "Vezi Proiectul",
  "viewLive": "Vezi Site-ul Live",
  "comingSoon": "În Curând",
  "techStack": "Tehnologii",
  "backToPortfolio": "Înapoi la Portofoliu",
  "nextProject": "Proiectul Următor",
  "previousProject": "Proiectul Anterior",
  "challenge": "Provocarea",
  "solution": "Soluția",
  "features": "Caracteristici Cheie",
  "results": "Rezultate"
}
```

**Step 4: Commit**

```bash
git add frontend/messages/en.json frontend/messages/es.json frontend/messages/ro.json
git commit -m "feat(portfolio): add translation keys for all locales"
```

---

## Task 7: Create Portfolio Detail Page Route

**Files:**
- Create: `frontend/app/[locale]/(website)/portfolio/[slug]/page.tsx`

**Step 1: Create the page component**

```tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { ProjectVideo } from "@/components/project-video";
import {
  getAllProjectSlugs,
  getPortfolioProject,
  getPortfolioProjects,
} from "@/lib/portfolio";
import { getCanonicalUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ExternalLinkIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import NextLink from "next/link";
import { notFound } from "next/navigation";

const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 {...props} className={cn("scroll-mt-8", props.className)} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 {...props} className={cn("scroll-mt-8", props.className)} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 {...props} className={cn("scroll-mt-8", props.className)} />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 {...props} className={cn("scroll-mt-8", props.className)} />
  ),
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = await getPortfolioProject(slug, locale);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.description,
    alternates: {
      canonical: getCanonicalUrl(locale, `/portfolio/${slug}`),
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((item) => ({
    locale: item.locale,
    slug: item.slug,
  }));
}

export default async function PortfolioProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = await getPortfolioProject(slug, locale);

  if (!project) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "portfolio" });
  const allProjects = await getPortfolioProjects(locale);

  // Find prev/next projects
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4">
        {/* Back Button */}
        <Link
          variant="outline"
          href="/#portfolio"
          className="inline-flex items-center font-medium mb-8"
        >
          <ChevronLeftIcon className="size-4" />
          {t("backToPortfolio")}
        </Link>

        {/* Hero Video */}
        <div className="relative rounded-2xl overflow-hidden mb-8">
          <div className="aspect-video">
            <ProjectVideo
              desktopVideo={project.desktopVideo}
              mobileVideo={project.mobileVideo}
              coverImage={project.coverImage}
              title={project.title}
              className="absolute inset-0"
            />
          </div>
          {project.status === "coming-soon" && (
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                {t("comingSoon")}
              </Badge>
            </div>
          )}
        </div>

        {/* Header */}
        <header className="mb-12">
          <p className="text-sm font-medium text-primary mb-2">
            {project.category}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            {project.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>

          {/* Live Link */}
          {project.status === "live" && project.liveUrl && (
            <Button asChild>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("viewLive")}
                <ExternalLinkIcon className="ml-2 size-4" />
              </a>
            </Button>
          )}
        </header>

        {/* MDX Content */}
        <div className="prose dark:prose-invert prose-lg max-w-none">
          <MDXRemote source={project.content} components={mdxComponents} />
        </div>

        {/* Navigation */}
        <div className="mt-16 pt-8 border-t flex justify-between">
          {prevProject ? (
            <NextLink
              href={`/portfolio/${prevProject.slug}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-sm">{t("previousProject")}</span>
              <p className="font-medium">{prevProject.title}</p>
            </NextLink>
          ) : (
            <div />
          )}
          {nextProject ? (
            <NextLink
              href={`/portfolio/${nextProject.slug}`}
              className="text-right text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-sm">{t("nextProject")}</span>
              <p className="font-medium">{nextProject.title}</p>
            </NextLink>
          ) : (
            <div />
          )}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Create directory and commit**

```bash
mkdir -p frontend/app/[locale]/(website)/portfolio/[slug]
git add frontend/app/[locale]/(website)/portfolio/[slug]/page.tsx
git commit -m "feat(portfolio): add portfolio detail page route"
```

---

## Task 8: Create MDX Content - English

**Files:**
- Create: `frontend/content/portfolio/en/citadella.mdx`
- Create: `frontend/content/portfolio/en/barbershop.mdx`
- Create: `frontend/content/portfolio/en/omnishoppingapp.mdx`

**Step 1: Create content directory**

```bash
mkdir -p frontend/content/portfolio/en
mkdir -p frontend/content/portfolio/es
mkdir -p frontend/content/portfolio/ro
```

**Step 2: Create Citadella English content**

File: `frontend/content/portfolio/en/citadella.mdx`

```mdx
---
id: citadella
title: "Citadella Heritage Restaurant"
description: "A sophisticated landing page that captures 30 years of culinary tradition through elegant design and seamless user experience."
category: "Restaurant Landing Page"
status: live
liveUrl: "https://citadella-heritage-design.vercel.app/"
coverImage: "/assets/projects/citadella/citadella-desktop.png"
desktopVideo: "https://pub-c7fe284218cc4c33a0bad228e34cbbed.r2.dev/citadella-desktop-video.mp4"
mobileVideo: "https://pub-c7fe284218cc4c33a0bad228e34cbbed.r2.dev/citadella-mobile-video.mp4"
techStack: ["Next.js", "Tailwind CSS", "Framer Motion", "TypeScript"]
date: "2025-11-15"
---

## The Challenge

Citadella is a heritage restaurant with over three decades of culinary excellence. Their existing web presence didn't reflect the sophistication of their dining experience. They needed a digital platform that would:

- Convey the restaurant's rich history and atmosphere
- Enable easy table reservations
- Showcase their seasonal menu with mouth-watering visuals
- Work flawlessly on mobile devices for on-the-go customers

## The Solution

I designed and built a landing page that treats every visitor like a guest walking through the restaurant's doors. The design uses warm, atmospheric colors and subtle animations that mirror the candlelit ambiance of the physical space.

The page architecture prioritizes the customer journey: from the hero section that immediately sets the mood, through the menu highlights, to a frictionless reservation flow that takes just seconds to complete.

## Key Features

**Atmospheric Design System**
Created a custom design system with carefully selected typography, a warm color palette derived from the restaurant's interior, and micro-animations that add sophistication without overwhelming the content.

**Smart Reservation Integration**
Integrated a reservation system that shows real-time availability. Guests can book a table in under 30 seconds, with automatic confirmation emails.

**Menu Showcase**
Built a visual menu browser that highlights seasonal specialties with high-quality imagery. The menu is easy to update through a headless CMS, allowing the restaurant to make changes without developer involvement.

**Mobile-First Experience**
Designed mobile-first to ensure the 60%+ of visitors on phones get an equally impressive experience. Touch-friendly navigation, optimized images, and fast load times make mobile browsing seamless.

## Results

The new website has transformed how Citadella connects with their guests:

- **40% increase** in online reservations within the first month
- **Sub-2-second** load times on mobile devices
- **Professional presentation** that matches their in-restaurant experience
- **Easy content management** for menu updates and special events
```

**Step 3: Create Barbershop English content**

File: `frontend/content/portfolio/en/barbershop.mdx`

```mdx
---
id: barbershop
title: "Barbershop Booking System"
description: "A modern appointment booking demo showcasing seamless scheduling with real-time availability and mobile-first design."
category: "Appointment Booking Demo"
status: live
liveUrl: "https://barbershop-booking-demo.vercel.app/"
coverImage: "/assets/projects/barbershop/barbershop-desktop.png"
desktopVideo: "https://pub-c7fe284218cc4c33a0bad228e34cbbed.r2.dev/barbershop-desktop-video.mp4"
mobileVideo: "https://pub-c7fe284218cc4c33a0bad228e34cbbed.r2.dev/barbershop-mobile-video.mp4"
techStack: ["Next.js", "Tailwind CSS", "React Hook Form", "TypeScript"]
date: "2025-10-20"
---

## The Challenge

Traditional barbershops often rely on phone calls and walk-ins for appointments, leading to:

- Missed calls during busy hours
- Double-bookings and scheduling conflicts
- No 24/7 booking availability
- Time wasted on administrative tasks instead of cutting hair

This demo showcases how a modern booking system can solve these pain points while providing an exceptional user experience.

## The Solution

I built a complete appointment booking flow that guides customers from service selection to confirmed booking in under a minute. The system is designed to feel intuitive—even for customers who've never booked online before.

The interface adapts to mobile devices where most bookings happen, with large touch targets and a streamlined step-by-step flow that eliminates confusion.

## Key Features

**Step-by-Step Booking Flow**
A guided booking process that breaks down the appointment into simple steps: choose your service, pick your barber, select a time slot, and confirm. Progress indicators show exactly where customers are in the process.

**Service Selection with Pricing**
Clear presentation of all services with descriptions, duration, and pricing. Customers know exactly what they're booking and what to expect.

**Barber Preference**
Customers can choose their preferred barber or select "any available" for the quickest appointment. Each barber profile shows their specialties and availability.

**Smart Time Slot Selection**
Calendar integration shows only available time slots, preventing double-bookings. The system accounts for service duration to ensure proper scheduling.

**Mobile-Optimized Interface**
Designed primarily for mobile users, with responsive layouts that work equally well on desktop. Touch-friendly buttons and swipe gestures make mobile booking effortless.

## Results

This demo demonstrates the potential impact of modern booking systems:

- **24/7 booking availability** eliminates missed opportunities
- **Zero double-bookings** through real-time availability checks
- **Under 60 seconds** average booking completion time
- **Professional appearance** that builds trust with new customers
```

**Step 4: Create OmniShoppingApp English content**

File: `frontend/content/portfolio/en/omnishoppingapp.mdx`

```mdx
---
id: omnishoppingapp
title: "OmniShoppingApp"
description: "A next-generation e-commerce platform unifying the shopping experience across multiple brands and channels."
category: "E-commerce Platform"
status: coming-soon
liveUrl: "https://omnishoppingapp.com/"
coverImage: "/assets/projects/citadella/citadella-desktop.png"
desktopVideo: "https://pub-c7fe284218cc4c33a0bad228e34cbbed.r2.dev/citadella-desktop-video.mp4"
mobileVideo: "https://pub-c7fe284218cc4c33a0bad228e34cbbed.r2.dev/citadella-mobile-video.mp4"
techStack: ["Next.js", "React Native", "Node.js", "PostgreSQL", "Stripe"]
date: "2026-03-01"
---

## The Vision

OmniShoppingApp is being built to solve a common frustration: shopping across multiple brands means juggling multiple apps, accounts, and checkout processes. We're creating a unified platform that brings everything together.

Imagine browsing products from your favorite brands, adding items to a single cart, and checking out once—regardless of how many different stores your items come from.

## Planned Features

**Unified Shopping Cart**
One cart for all brands. Add items from multiple stores and complete a single checkout. The system handles order routing and fulfillment behind the scenes.

**Smart Search & Discovery**
AI-powered search that understands natural language queries. Looking for "comfortable running shoes under $100"? The search understands intent, not just keywords.

**Personalized Recommendations**
Machine learning algorithms that learn your preferences over time. Get recommendations that actually match your style, size, and budget—without feeling creepy.

**Seamless Checkout**
Save your payment methods and shipping addresses once. Apple Pay and Google Pay integration for one-tap purchases on mobile.

**Real-Time Order Tracking**
Track all your orders from all brands in one place. Push notifications keep you updated on shipping status without checking multiple apps.

## Technical Architecture

**Frontend**
- Next.js for the web application with server-side rendering
- React Native for iOS and Android apps sharing 80% of code
- Tailwind CSS for consistent styling across platforms

**Backend**
- Node.js API with GraphQL for efficient data fetching
- PostgreSQL for reliable data storage
- Redis for caching and real-time features

**Integrations**
- Stripe Connect for multi-vendor payments
- Headless commerce APIs for brand catalog sync
- Shipping carrier APIs for real-time tracking

## Current Status

OmniShoppingApp is currently in active development. We're building the core infrastructure and onboarding initial brand partners. Expected launch: Q2 2026.

Want to be notified when we launch? Visit [omnishoppingapp.com](https://omnishoppingapp.com/) to join the waitlist.
```

**Step 5: Commit English content**

```bash
git add frontend/content/portfolio/en/
git commit -m "feat(portfolio): add English MDX content for all projects"
```

---

## Task 9: Create MDX Content - Spanish

**Files:**
- Create: `frontend/content/portfolio/es/citadella.mdx`
- Create: `frontend/content/portfolio/es/barbershop.mdx`
- Create: `frontend/content/portfolio/es/omnishoppingapp.mdx`

**Step 1: Create Citadella Spanish content**

File: `frontend/content/portfolio/es/citadella.mdx`

```mdx
---
id: citadella
title: "Citadella Heritage Restaurant"
description: "Una landing page sofisticada que captura 30 años de tradición culinaria a través de un diseño elegante y una experiencia de usuario impecable."
category: "Landing Page de Restaurante"
status: live
liveUrl: "https://citadella-heritage-design.vercel.app/"
coverImage: "/assets/projects/citadella/citadella-desktop.png"
desktopVideo: "https://pub-c7fe284218cc4c33a0bad228e34cbbed.r2.dev/citadella-desktop-video.mp4"
mobileVideo: "https://pub-c7fe284218cc4c33a0bad228e34cbbed.r2.dev/citadella-mobile-video.mp4"
techStack: ["Next.js", "Tailwind CSS", "Framer Motion", "TypeScript"]
date: "2025-11-15"
---

## El Desafío

Citadella es un restaurante con más de tres décadas de excelencia culinaria. Su presencia web existente no reflejaba la sofisticación de su experiencia gastronómica. Necesitaban una plataforma digital que pudiera:

- Transmitir la rica historia y atmósfera del restaurante
- Facilitar las reservas de mesa
- Mostrar su menú de temporada con imágenes apetitosas
- Funcionar perfectamente en dispositivos móviles

## La Solución

Diseñé y construí una landing page que trata a cada visitante como un invitado que entra por las puertas del restaurante. El diseño utiliza colores cálidos y animaciones sutiles que reflejan el ambiente íntimo del espacio físico.

La arquitectura de la página prioriza el recorrido del cliente: desde la sección hero que establece inmediatamente el ambiente, pasando por los destacados del menú, hasta un flujo de reserva sin fricciones.

## Características Principales

**Sistema de Diseño Atmosférico**
Creé un sistema de diseño personalizado con tipografía cuidadosamente seleccionada, una paleta de colores cálidos derivada del interior del restaurante, y micro-animaciones que añaden sofisticación.

**Integración Inteligente de Reservas**
Sistema de reservas integrado que muestra disponibilidad en tiempo real. Los invitados pueden reservar una mesa en menos de 30 segundos.

**Escaparate del Menú**
Navegador visual del menú que destaca las especialidades de temporada con imágenes de alta calidad. Fácil de actualizar a través de un CMS headless.

**Experiencia Mobile-First**
Diseñado primero para móvil para asegurar que más del 60% de visitantes en teléfonos tengan una experiencia igualmente impresionante.

## Resultados

- **40% de aumento** en reservas online en el primer mes
- **Menos de 2 segundos** de tiempo de carga en móvil
- **Presentación profesional** que iguala su experiencia en el restaurante
```

**Step 2: Create Barbershop Spanish content**

File: `frontend/content/portfolio/es/barbershop.mdx`

```mdx
---
id: barbershop
title: "Sistema de Reservas para Barbería"
description: "Una demo moderna de reserva de citas que muestra programación fluida con disponibilidad en tiempo real y diseño mobile-first."
category: "Demo de Reservas"
status: live
liveUrl: "https://barbershop-booking-demo.vercel.app/"
coverImage: "/assets/projects/barbershop/barbershop-desktop.png"
desktopVideo: "https://pub-c7fe284218cc4c33a0bad228e34cbbed.r2.dev/barbershop-desktop-video.mp4"
mobileVideo: "https://pub-c7fe284218cc4c33a0bad228e34cbbed.r2.dev/barbershop-mobile-video.mp4"
techStack: ["Next.js", "Tailwind CSS", "React Hook Form", "TypeScript"]
date: "2025-10-20"
---

## El Desafío

Las barberías tradicionales dependen de llamadas telefónicas y visitas sin cita, lo que genera:

- Llamadas perdidas durante horas ocupadas
- Reservas duplicadas y conflictos de horarios
- Sin disponibilidad de reservas 24/7
- Tiempo perdido en tareas administrativas

Esta demo muestra cómo un sistema moderno de reservas puede resolver estos problemas.

## La Solución

Construí un flujo completo de reserva que guía a los clientes desde la selección del servicio hasta la confirmación en menos de un minuto. El sistema está diseñado para ser intuitivo, incluso para clientes que nunca han reservado online.

## Características Principales

**Flujo de Reserva Paso a Paso**
Un proceso guiado que divide la cita en pasos simples: elige tu servicio, selecciona tu barbero, escoge un horario y confirma.

**Selección de Servicios con Precios**
Presentación clara de todos los servicios con descripciones, duración y precios.

**Preferencia de Barbero**
Los clientes pueden elegir su barbero preferido o seleccionar "cualquiera disponible" para la cita más rápida.

**Selección Inteligente de Horarios**
El calendario muestra solo horarios disponibles, previniendo reservas duplicadas.

**Interfaz Optimizada para Móvil**
Diseñado principalmente para usuarios móviles, con layouts responsivos que funcionan igual de bien en escritorio.

## Resultados

- **Disponibilidad de reservas 24/7** elimina oportunidades perdidas
- **Cero reservas duplicadas** mediante verificación en tiempo real
- **Menos de 60 segundos** tiempo promedio de completar reserva
```

**Step 3: Create OmniShoppingApp Spanish content**

File: `frontend/content/portfolio/es/omnishoppingapp.mdx`

```mdx
---
id: omnishoppingapp
title: "OmniShoppingApp"
description: "Una plataforma de e-commerce de próxima generación que unifica la experiencia de compra a través de múltiples marcas y canales."
category: "Plataforma E-commerce"
status: coming-soon
liveUrl: "https://omnishoppingapp.com/"
coverImage: "/assets/projects/citadella/citadella-desktop.png"
desktopVideo: "https://pub-c7fe284218cc4c33a0bad228e34cbbed.r2.dev/citadella-desktop-video.mp4"
mobileVideo: "https://pub-c7fe284218cc4c33a0bad228e34cbbed.r2.dev/citadella-mobile-video.mp4"
techStack: ["Next.js", "React Native", "Node.js", "PostgreSQL", "Stripe"]
date: "2026-03-01"
---

## La Visión

OmniShoppingApp se está construyendo para resolver una frustración común: comprar en múltiples marcas significa manejar múltiples apps, cuentas y procesos de pago. Estamos creando una plataforma unificada que lo reúne todo.

Imagina navegar productos de tus marcas favoritas, añadir artículos a un solo carrito y pagar una vez, sin importar de cuántas tiendas diferentes vengan tus artículos.

## Características Planeadas

**Carrito de Compras Unificado**
Un carrito para todas las marcas. Añade artículos de múltiples tiendas y completa un solo checkout.

**Búsqueda Inteligente y Descubrimiento**
Búsqueda potenciada por IA que entiende consultas en lenguaje natural.

**Recomendaciones Personalizadas**
Algoritmos de machine learning que aprenden tus preferencias con el tiempo.

**Checkout Sin Fricciones**
Guarda tus métodos de pago y direcciones de envío una vez. Integración con Apple Pay y Google Pay.

**Seguimiento de Pedidos en Tiempo Real**
Rastrea todos tus pedidos de todas las marcas en un solo lugar.

## Estado Actual

OmniShoppingApp está actualmente en desarrollo activo. Lanzamiento esperado: Q2 2026.

¿Quieres ser notificado cuando lancemos? Visita [omnishoppingapp.com](https://omnishoppingapp.com/) para unirte a la lista de espera.
```

**Step 4: Commit Spanish content**

```bash
git add frontend/content/portfolio/es/
git commit -m "feat(portfolio): add Spanish MDX content for all projects"
```

---

## Task 10: Create MDX Content - Romanian

**Files:**
- Create: `frontend/content/portfolio/ro/citadella.mdx`
- Create: `frontend/content/portfolio/ro/barbershop.mdx`
- Create: `frontend/content/portfolio/ro/omnishoppingapp.mdx`

**Step 1: Create Citadella Romanian content**

File: `frontend/content/portfolio/ro/citadella.mdx`

```mdx
---
id: citadella
title: "Citadella Heritage Restaurant"
description: "O pagină de prezentare sofisticată care surprinde 30 de ani de tradiție culinară prin design elegant și experiență de utilizare impecabilă."
category: "Landing Page Restaurant"
status: live
liveUrl: "https://citadella-heritage-design.vercel.app/"
coverImage: "/assets/projects/citadella/citadella-desktop.png"
desktopVideo: "https://pub-c7fe284218cc4c33a0bad228e34cbbed.r2.dev/citadella-desktop-video.mp4"
mobileVideo: "https://pub-c7fe284218cc4c33a0bad228e34cbbed.r2.dev/citadella-mobile-video.mp4"
techStack: ["Next.js", "Tailwind CSS", "Framer Motion", "TypeScript"]
date: "2025-11-15"
---

## Provocarea

Citadella este un restaurant cu peste trei decenii de excelență culinară. Prezența lor web existentă nu reflecta sofisticarea experienței gastronomice. Aveau nevoie de o platformă digitală care să:

- Transmită istoria bogată și atmosfera restaurantului
- Permită rezervări ușoare de mese
- Prezinte meniul sezonier cu imagini apetisante
- Funcționeze perfect pe dispozitive mobile

## Soluția

Am proiectat și construit o pagină de prezentare care tratează fiecare vizitator ca pe un oaspete care trece pragul restaurantului. Designul folosește culori calde și animații subtile care reflectă ambianța intimă a spațiului fizic.

Arhitectura paginii prioritizează călătoria clientului: de la secțiunea hero care stabilește imediat atmosfera, prin punctele principale ale meniului, până la un flux de rezervare fără fricțiuni.

## Caracteristici Cheie

**Sistem de Design Atmosferic**
Am creat un sistem de design personalizat cu tipografie atent selectată, o paletă de culori calde derivată din interiorul restaurantului și micro-animații care adaugă sofisticare.

**Integrare Inteligentă a Rezervărilor**
Sistem de rezervări integrat care arată disponibilitatea în timp real. Oaspeții pot rezerva o masă în mai puțin de 30 de secunde.

**Prezentarea Meniului**
Navigator vizual al meniului care evidențiază specialitățile sezoniere cu imagini de înaltă calitate. Ușor de actualizat prin CMS headless.

**Experiență Mobile-First**
Proiectat mai întâi pentru mobil pentru a asigura că peste 60% dintre vizitatorii pe telefoane au o experiență la fel de impresionantă.

## Rezultate

- **Creștere de 40%** în rezervările online în prima lună
- **Sub 2 secunde** timp de încărcare pe mobil
- **Prezentare profesională** care egalează experiența din restaurant
```

**Step 2: Create Barbershop Romanian content**

File: `frontend/content/portfolio/ro/barbershop.mdx`

```mdx
---
id: barbershop
title: "Sistem de Rezervări pentru Frizerie"
description: "O demonstrație modernă de rezervare a programărilor care prezintă programare fluidă cu disponibilitate în timp real și design mobile-first."
category: "Demo Rezervări"
status: live
liveUrl: "https://barbershop-booking-demo.vercel.app/"
coverImage: "/assets/projects/barbershop/barbershop-desktop.png"
desktopVideo: "https://pub-c7fe284218cc4c33a0bad228e34cbbed.r2.dev/barbershop-desktop-video.mp4"
mobileVideo: "https://pub-c7fe284218cc4c33a0bad228e34cbbed.r2.dev/barbershop-mobile-video.mp4"
techStack: ["Next.js", "Tailwind CSS", "React Hook Form", "TypeScript"]
date: "2025-10-20"
---

## Provocarea

Frizeriile tradiționale se bazează pe apeluri telefonice și clienți fără programare, ceea ce duce la:

- Apeluri pierdute în orele aglomerate
- Rezervări duble și conflicte de programare
- Fără disponibilitate de rezervare 24/7
- Timp pierdut cu sarcini administrative

Această demonstrație arată cum un sistem modern de rezervări poate rezolva aceste probleme.

## Soluția

Am construit un flux complet de rezervare care ghidează clienții de la selectarea serviciului până la confirmarea rezervării în mai puțin de un minut. Sistemul este proiectat să fie intuitiv, chiar și pentru clienții care nu au mai rezervat niciodată online.

## Caracteristici Cheie

**Flux de Rezervare Pas cu Pas**
Un proces ghidat care împarte programarea în pași simpli: alege serviciul, selectează frizerul, alege un interval orar și confirmă.

**Selecție de Servicii cu Prețuri**
Prezentare clară a tuturor serviciilor cu descrieri, durată și prețuri.

**Preferință pentru Frizer**
Clienții pot alege frizerul preferat sau selecta "oricine disponibil" pentru cea mai rapidă programare.

**Selecție Inteligentă de Intervale Orare**
Calendarul arată doar intervalele disponibile, prevenind rezervările duble.

**Interfață Optimizată pentru Mobil**
Proiectat în principal pentru utilizatorii mobili, cu layouturi responsive care funcționează la fel de bine pe desktop.

## Rezultate

- **Disponibilitate de rezervare 24/7** elimină oportunitățile pierdute
- **Zero rezervări duble** prin verificare în timp real
- **Sub 60 de secunde** timp mediu de completare a rezervării
```

**Step 3: Create OmniShoppingApp Romanian content**

File: `frontend/content/portfolio/ro/omnishoppingapp.mdx`

```mdx
---
id: omnishoppingapp
title: "OmniShoppingApp"
description: "O platformă de e-commerce de ultimă generație care unifică experiența de cumpărături pe mai multe branduri și canale."
category: "Platformă E-commerce"
status: coming-soon
liveUrl: "https://omnishoppingapp.com/"
coverImage: "/assets/projects/citadella/citadella-desktop.png"
desktopVideo: "https://pub-c7fe284218cc4c33a0bad228e34cbbed.r2.dev/citadella-desktop-video.mp4"
mobileVideo: "https://pub-c7fe284218cc4c33a0bad228e34cbbed.r2.dev/citadella-mobile-video.mp4"
techStack: ["Next.js", "React Native", "Node.js", "PostgreSQL", "Stripe"]
date: "2026-03-01"
---

## Viziunea

OmniShoppingApp este construită pentru a rezolva o frustrare comună: cumpărăturile de la mai multe branduri înseamnă jonglarea cu mai multe aplicații, conturi și procese de plată. Creăm o platformă unificată care aduce totul împreună.

Imaginează-ți că navighezi produse de la brandurile tale preferate, adaugi articole într-un singur coș și plătești o singură dată, indiferent de câte magazine diferite provin articolele tale.

## Caracteristici Planificate

**Coș de Cumpărături Unificat**
Un coș pentru toate brandurile. Adaugă articole din mai multe magazine și completează un singur checkout.

**Căutare și Descoperire Inteligentă**
Căutare alimentată de AI care înțelege interogări în limbaj natural.

**Recomandări Personalizate**
Algoritmi de machine learning care învață preferințele tale în timp.

**Checkout Fără Fricțiuni**
Salvează metodele de plată și adresele de livrare o singură dată. Integrare Apple Pay și Google Pay.

**Urmărire Comenzi în Timp Real**
Urmărește toate comenzile de la toate brandurile într-un singur loc.

## Status Actual

OmniShoppingApp este în prezent în dezvoltare activă. Lansare așteptată: T2 2026.

Vrei să fii notificat când lansăm? Vizitează [omnishoppingapp.com](https://omnishoppingapp.com/) pentru a te înscrie pe lista de așteptare.
```

**Step 4: Commit Romanian content**

```bash
git add frontend/content/portfolio/ro/
git commit -m "feat(portfolio): add Romanian MDX content for all projects"
```

---

## Task 11: Test and Verify

**Step 1: Run the development server**

```bash
cd frontend && npm run dev
```

**Step 2: Verify the following**

1. Homepage shows portfolio section after services
2. All 3 projects display with video autoplay on scroll
3. "Coming Soon" badge shows on OmniShoppingApp
4. Click on project card navigates to detail page
5. Detail page renders MDX content correctly
6. Previous/Next navigation works
7. Test in all 3 locales: `/en`, `/es`, `/ro`
8. Test mobile responsive layout
9. Test video autoplay/pause on viewport enter/exit

**Step 3: Final commit if all tests pass**

```bash
git add -A
git commit -m "feat(portfolio): complete portfolio section implementation"
```

---

## Summary

This plan creates:
- 1 library helper (`lib/portfolio.ts`)
- 3 components (`ProjectVideo`, `ProjectCard`, `PortfolioSection`)
- 1 page route (`/portfolio/[slug]`)
- 9 MDX content files (3 projects × 3 languages)
- Translation keys in 3 locale files
- Homepage integration

Total estimated tasks: 11
