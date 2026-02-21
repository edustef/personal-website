# Homepage Cinematic Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the homepage top half (Hero, Services, Portfolio) and Navbar to feel immersive and experiential with scroll-driven transitions, mobile-first.

**Architecture:** Replace the current stacked-section layout with a cinematic scroll experience. Hero uses a full-viewport shader background with word-by-word animation. Services use a pinned horizontal scroll on desktop / stacking cards on mobile. Portfolio uses sticky full-viewport cards that stack. Navbar morphs from transparent to a floating pill on scroll.

**Tech Stack:** Next.js 16 (App Router), Framer Motion/motion-react (`useScroll`, `useTransform`, `useSpring`), `@paper-design/shaders-react` (MeshGradient), Tailwind v4, Radix UI, next-intl (en/ro/es).

---

## Task 1: Hero Section — Full Viewport Shader Background

**Files:**
- Modify: `components/ui/background-paper-shaders.tsx`
- Modify: `components/hero-section.tsx`
- Modify: `app/globals.css`

**Step 1: Update BackgroundPaperShaders to be mouse-reactive and scroll-aware**

The current shader is `absolute -z-10 inset-0 h-screen` with static colors. Modify it to:
- Accept `mouseX`/`mouseY` props that feed into the shader's `speed` and `distortion` params
- Use `useScroll` to darken/fade the shader as user scrolls past 50% of the hero
- Add a CSS gradient fallback that renders before the shader loads (matching shader palette)

```tsx
// background-paper-shaders.tsx — key changes:
// 1. Track mouse position via onMouseMove on container
// 2. Map mouse position to shader distortion (0.5-2 range)
// 3. Use useScroll + useTransform to fade opacity from 1 → 0 as scrollY goes 0 → window.innerHeight
// 4. Add fallback gradient: bg-gradient-to-b from-background to-muted
```

**Step 2: Make hero full viewport with edge-to-edge layout**

Change `hero-section.tsx`:
- Remove `py-12 md:py-16` padding and `max-w-6xl` constraint
- Add `min-h-svh` (100svh) and `relative` positioning
- Position content with flexbox centered vertically, padded from edges
- Add a scroll-darkening overlay `div` that fades in based on `scrollYProgress`

```tsx
// hero-section.tsx structure:
<section className="relative min-h-svh flex flex-col items-center justify-center overflow-hidden">
  <BackgroundPaperShaders /> {/* Now mouse-reactive */}
  {/* Scroll-darkening overlay */}
  <motion.div style={{ opacity: scrollDarken }} className="absolute inset-0 bg-background pointer-events-none" />
  {/* Content centered */}
  <div className="relative z-10 px-6 md:px-8 text-center max-w-5xl mx-auto">
    ...
  </div>
  {/* Scroll indicator at bottom */}
  ...
</section>
```

**Step 3: Verify visually**

Run: `npm run dev`
Expected: Hero fills full viewport, shader background visible, content centered, scrolling past hero darkens the background.

**Step 4: Commit**

```bash
git add components/ui/background-paper-shaders.tsx components/hero-section.tsx app/globals.css
git commit -m "feat(hero): full-viewport shader background with scroll-aware darkening"
```

---

## Task 2: Hero Section — Word-by-Word Animated Typography

**Files:**
- Modify: `components/hero-section.tsx`
- Create: `components/ui/animated-text.tsx`

**Step 1: Create the AnimatedText component**

A reusable component that splits text into words and animates each one in with a staggered spring — sliding up from below with slight rotation.

```tsx
// components/ui/animated-text.tsx
"use client";
import { motion } from "motion/react";
import type React from "react";

type AnimatedTextProps = {
  children: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "p" | "span";
  onAnimationComplete?: () => void;
};

export function AnimatedText({
  children,
  className,
  delay = 0,
  as: Tag = "span",
  onAnimationComplete,
}: AnimatedTextProps) {
  const words = children.split(" ");

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "100%", rotateX: 45, opacity: 0 }}
            animate={{ y: 0, rotateX: 0, opacity: 1 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 100,
              delay: delay + i * 0.08,
            }}
            onAnimationComplete={i === words.length - 1 ? onAnimationComplete : undefined}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </Tag>
  );
}
```

**Step 2: Integrate into hero-section**

The hero is currently a server component. It needs to become a client component (or extract a client wrapper) because word animation requires client-side rendering. The translations can be passed as props from a server wrapper.

Create a split:
- `hero-section.tsx` remains the server component that fetches translations
- Create `hero-section-client.tsx` as the client component with all animation logic

```tsx
// hero-section.tsx (server) — passes translated strings as props:
export default async function HeroSection() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "home" });
  return (
    <HeroSectionClient
      announcementLabel={t.rich("announcementLabel", { strong: (c) => <strong className="font-bold">{c}</strong> })}
      headline={t("headline")} // plain string for word splitting
      headlineRich={t.rich("headline", { strong: (c) => c })} // for identifying bold words
      tagline={t("tagline")}
      scheduleCall={t("scheduleCall")}
      contactDirectly={t("contactDirectly")}
    />
  );
}
```

```tsx
// hero-section-client.tsx (client) — uses AnimatedText for headline
// Headline: text-5xl mobile, text-7xl md:text-8xl desktop
// Tagline: fades in after headline animation completes (controlled by state)
// CTA buttons: fade up after tagline
// HighlightBadge: positioned above headline with float animation
```

**Step 3: Verify visually**

Run: `npm run dev`
Expected: Words animate in one at a time with spring physics. Tagline appears after headline. CTAs appear last.

**Step 4: Commit**

```bash
git add components/ui/animated-text.tsx components/hero-section.tsx components/hero-section-client.tsx
git commit -m "feat(hero): word-by-word spring animation for headline"
```

---

## Task 3: Hero Section — CTA Buttons, Scroll Indicator & Announcement Badge

**Files:**
- Modify: `components/hero-section-client.tsx`
- Modify: `components/contact-button-observer.tsx`

**Step 1: Position CTA buttons at bottom of viewport with frosted glass**

```tsx
// Inside hero-section-client.tsx:
// CTA container: fixed to bottom of hero viewport
<motion.div
  className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 px-6"
  initial={{ opacity: 0, y: 20 }}
  animate={ctaVisible ? { opacity: 1, y: 0 } : {}}
  transition={{ type: "spring", damping: 20, stiffness: 100 }}
>
  <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl bg-background/60 backdrop-blur-xl border border-border/20">
    {/* Schedule Call button */}
    {/* WhatsApp button */}
  </div>
</motion.div>
```

**Step 2: Add scroll indicator**

Animated chevron at the very bottom of the hero that pulses and disappears on first scroll.

```tsx
// Scroll indicator — below CTA buttons
<motion.div
  className="absolute bottom-2 left-1/2 -translate-x-1/2"
  initial={{ opacity: 0 }}
  animate={{ opacity: hasScrolled ? 0 : 1, y: [0, 8, 0] }}
  transition={{ y: { repeat: Infinity, duration: 1.5 }, opacity: { duration: 0.3 } }}
>
  <ChevronDown className="size-5 text-muted-foreground" />
</motion.div>
```

Track `hasScrolled` with a simple scroll listener that sets `true` after `scrollY > 50`.

**Step 3: Update FloatingContactButton**

The current `FloatingContactButton` in `contact-button-observer.tsx` shows a floating calendar icon on mobile when hero CTA scrolls away. Update the `HERO_CONTACT_BUTTON_ID` to point at the new CTA container so the observer still works correctly. The floating button logic remains the same.

**Step 4: Add float animation to HighlightBadge**

Wrap the HighlightBadge in a `motion.div` with the existing `animate-float` CSS class or a Framer Motion float animation.

**Step 5: Verify visually**

Run: `npm run dev`
Expected: CTAs at bottom with glass backdrop, scroll indicator pulses, badge floats gently, floating contact button appears on mobile after scrolling past hero.

**Step 6: Commit**

```bash
git add components/hero-section-client.tsx components/contact-button-observer.tsx
git commit -m "feat(hero): glass CTA bar, scroll indicator, floating badge"
```

---

## Task 4: Hero → Services Scroll Transition

**Files:**
- Modify: `components/hero-section-client.tsx`
- Modify: `app/[locale]/(website)/page.tsx`

**Step 1: Add parallax depth to hero content**

Use `useScroll` targeting the hero section. Map `scrollYProgress` to:
- Hero content `y` offset: moves up faster than natural scroll (e.g., `[0, 1] → [0, -150]`)
- Shader opacity: `[0, 0.5, 1] → [1, 0.8, 0]` (fades as you scroll)
- Background darkening overlay opacity: `[0, 0.5, 1] → [0, 0.3, 1]`

```tsx
const heroRef = useRef(null);
const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
const contentY = useTransform(scrollYProgress, [0, 1], [0, -150]);
const shaderOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0]);
const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.3, 1]);
```

**Step 2: Remove hard section breaks in page.tsx**

Remove any gap/margin between `<HeroSection />` and `<ServicesSection />` in `page.tsx`. The services section should start immediately after the hero viewport, with the hero's scroll-darkening creating the visual transition.

**Step 3: Verify visually**

Run: `npm run dev`
Expected: Scrolling creates a smooth parallax with content rising faster than background, shader fading into dark, seamlessly blending into services.

**Step 4: Commit**

```bash
git add components/hero-section-client.tsx app/[locale]/(website)/page.tsx
git commit -m "feat(hero): parallax depth and seamless transition to services"
```

---

## Task 5: Services Section — Horizontal Scroll (Desktop)

**Files:**
- Create: `components/sections/services-section-cinematic.tsx`
- Create: `components/sections/services-horizontal-scroll.tsx`
- Modify: `app/[locale]/(website)/page.tsx`

**Step 1: Create the horizontal scroll container component**

This is the core scroll mechanic. A container that:
- Takes up `height: (numberOfServices * 100vh)` to create enough scroll runway
- Contains a sticky inner div (`position: sticky; top: 0; height: 100vh`)
- Maps vertical scroll progress → horizontal translateX of the services strip
- Shows a section label pinned at top-left
- Shows a progress bar at the bottom

```tsx
// components/sections/services-horizontal-scroll.tsx
"use client";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

type Props = {
  children: React.ReactNode;
  itemCount: number;
  label: string;
  headline: string;
};

export function HorizontalScrollContainer({ children, itemCount, label, headline }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  // Map vertical scroll to horizontal translation
  // Each service is 100vw wide, so total strip width = itemCount * 100vw
  // translateX goes from 0 to -(itemCount - 1) * 100vw
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `${-(itemCount - 1) * 100}%`]);

  // Progress bar width
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Current active index for color transitions
  const activeIndex = useTransform(scrollYProgress, (v) => Math.round(v * (itemCount - 1)));

  return (
    <div ref={containerRef} style={{ height: `${itemCount * 100}vh` }}>
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Pinned label */}
        <div className="absolute top-8 left-8 z-10">
          <p className="text-primary text-sm font-medium uppercase tracking-wider">{label}</p>
          <h2 className="text-foreground text-2xl md:text-3xl mt-2">{headline}</h2>
        </div>

        {/* Horizontal strip */}
        <motion.div className="flex h-full" style={{ x, width: `${itemCount * 100}%` }}>
          {children}
        </motion.div>

        {/* Progress bar */}
        <div className="absolute bottom-8 left-8 right-8 h-0.5 bg-border/30 rounded-full">
          <motion.div className="h-full bg-primary rounded-full" style={{ width: progressWidth }} />
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Create the cinematic service slide component**

Each service gets a full-viewport slide with large typography, animated icon, and glow background.

```tsx
// Inside services-section-cinematic.tsx
// Each slide is w-full h-full (taking 1/N of the strip width)
// Contains: centered content with icon (spring animation), large title, description
// Background: subtle radial gradient glow using the service's glowColor
```

**Step 3: Wire up in page.tsx**

Replace `<ServicesSection />` with the new cinematic version on desktop. Keep the existing mobile carousel version for mobile (wrapped in `md:hidden`). The new horizontal scroll wraps in `hidden md:block`.

**Step 4: Verify visually**

Run: `npm run dev`
Expected: On desktop, scrolling vertically moves through services horizontally. Each service fills the viewport. Progress bar tracks position. On mobile, the existing carousel still works.

**Step 5: Commit**

```bash
git add components/sections/services-section-cinematic.tsx components/sections/services-horizontal-scroll.tsx app/[locale]/(website)/page.tsx
git commit -m "feat(services): horizontal scroll cinema on desktop"
```

---

## Task 6: Services Section — Mobile Stacking Cards

**Files:**
- Modify: `components/sections/services-section-cinematic.tsx`

**Step 1: Build mobile card stack**

Replace the carousel on mobile with a vertical stack where each card overlaps the previous one using negative margins and increasing z-index.

```tsx
// Mobile layout (inside services-section-cinematic.tsx):
<div className="md:hidden">
  <div className="px-4">
    {/* Section header */}
    <SectionHeader label={label} headline={headline} subtitle={subtitle} />

    {/* Stacking cards */}
    <div className="space-y-[-2rem]"> {/* Negative spacing for overlap */}
      {services.map((service, i) => (
        <motion.div
          key={service._id}
          className="sticky rounded-2xl bg-card border border-border/30 p-6 shadow-lg"
          style={{
            top: `${8 + i * 2}rem`, // Each card sticks a bit lower
            zIndex: i + 1,
          }}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.5, delay: i * 0.05 }}
        >
          {/* Icon with spring animation */}
          {/* Title */}
          {/* Description */}
          {/* Glow background */}
        </motion.div>
      ))}
    </div>
  </div>
</div>
```

**Step 2: Add micro-interactions to each card**

- Icon scales up and rotates slightly when card enters viewport
- Title and description have staggered fade-in
- Each card has a subtle glow matching its accent color

**Step 3: Verify on mobile viewport**

Run: `npm run dev`, resize to mobile or use device emulation.
Expected: Cards stack on top of each other as you scroll, each sticking at a slightly different offset.

**Step 4: Commit**

```bash
git add components/sections/services-section-cinematic.tsx
git commit -m "feat(services): mobile stacking card layout with micro-interactions"
```

---

## Task 7: Portfolio Section — Sticky Full-Viewport Cards (Desktop)

**Files:**
- Create: `components/sections/portfolio-section-cinematic.tsx`
- Create: `components/sections/portfolio-spotlight-card.tsx`
- Modify: `app/[locale]/(website)/page.tsx`

**Step 1: Create the portfolio spotlight card**

Each project gets a full-viewport sticky card. Layout: image/video (60%) + details (40%).

```tsx
// components/sections/portfolio-spotlight-card.tsx
"use client";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import { useRef } from "react";
import type { Project } from "@/lib/portfolio";

type Props = {
  project: Project;
  index: number;
  total: number;
};

export function PortfolioSpotlightCard({ project, index, total }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.5 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Ken Burns: slow zoom while in view
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  // Parallax offset between image and text
  const imageY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <div
      ref={ref}
      className="sticky top-0 h-svh w-full"
      style={{ zIndex: index + 1 }}
    >
      <div className="h-full flex items-center px-8 md:px-16 max-w-7xl mx-auto">
        {/* Image/video side (60%) */}
        <motion.div className="w-3/5 h-4/5 rounded-2xl overflow-hidden" style={{ y: imageY }}>
          <motion.div style={{ scale: imageScale }} className="h-full">
            {/* Image or video */}
          </motion.div>
        </motion.div>

        {/* Details side (40%) */}
        <div className="w-2/5 pl-12">
          {/* Counter: "01 / 04" */}
          <p className="text-muted-foreground font-mono text-sm mb-4">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>

          {/* Category */}
          {/* Title with clip-path reveal */}
          {/* Description */}
          {/* Tech badges with stagger */}
          {/* Link if available */}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Create the portfolio section wrapper**

```tsx
// components/sections/portfolio-section-cinematic.tsx
// Server component that fetches projects, passes to client cards
// Contains: section header, then N sticky cards stacked
// Each card is position:sticky top:0 so they overlap
// Total container height accommodates all cards scrolling through
```

**Step 3: Wire up in page.tsx**

Replace `<PortfolioSection />` with `<PortfolioSectionCinematic />` on desktop. Keep existing carousel for mobile (wrapped in `md:hidden`).

**Step 4: Add clip-path title reveal**

The project title uses a CSS clip-path animation that wipes from left to right when the card enters view.

```tsx
<motion.h3
  className="text-4xl font-semibold"
  initial={{ clipPath: "inset(0 100% 0 0)" }}
  animate={isInView ? { clipPath: "inset(0 0% 0 0)" } : {}}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
>
  {project.title}
</motion.h3>
```

**Step 5: Add tech badge stagger animation**

```tsx
{project.techStack.map((tech, i) => (
  <motion.span
    key={tech}
    initial={{ opacity: 0, scale: 0.8, y: 10 }}
    animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
    transition={{ type: "spring", delay: 0.4 + i * 0.06 }}
  >
    <Badge variant="secondary">{tech}</Badge>
  </motion.span>
))}
```

**Step 6: Verify visually**

Run: `npm run dev`
Expected: Each project fills the viewport. Scrolling reveals the next project sliding up over the previous. Images have Ken Burns zoom. Titles wipe in. Badges stagger in.

**Step 7: Commit**

```bash
git add components/sections/portfolio-section-cinematic.tsx components/sections/portfolio-spotlight-card.tsx app/[locale]/(website)/page.tsx
git commit -m "feat(portfolio): sticky full-viewport spotlight cards with micro-interactions"
```

---

## Task 8: Portfolio Section — Mobile Layout

**Files:**
- Modify: `components/sections/portfolio-section-cinematic.tsx`

**Step 1: Build mobile portfolio stack**

Full-width cards with image on top (16:9), details below. Cards use `position: sticky` with slight top offset for the peek effect.

```tsx
// Mobile layout:
<div className="md:hidden space-y-[-1.5rem]">
  {projects.map((project, i) => (
    <div
      key={project.id}
      className="sticky rounded-2xl overflow-hidden bg-card border border-border/30 shadow-xl"
      style={{ top: `${4 + i * 1.5}rem`, zIndex: i + 1 }}
    >
      {/* Image: aspect-video */}
      <div className="relative aspect-video overflow-hidden">
        {/* Ken Burns effect on image */}
      </div>
      {/* Details below image */}
      <div className="p-5">
        {/* Counter, category, title, description, badges */}
      </div>
    </div>
  ))}
  {/* Coming Soon CTA card */}
</div>
```

**Step 2: Add video auto-play when active**

Use `useInView` to detect when a card is the active one (>50% visible). Trigger video play/pause accordingly.

**Step 3: Verify on mobile viewport**

Run: `npm run dev`, mobile viewport.
Expected: Cards stack with peek of previous card visible. Videos auto-play when active.

**Step 4: Commit**

```bash
git add components/sections/portfolio-section-cinematic.tsx
git commit -m "feat(portfolio): mobile stacking cards with auto-play video"
```

---

## Task 9: Navbar — Transparent → Floating Pill Morph

**Files:**
- Modify: `components/header.tsx`
- Modify: `app/globals.css`

**Step 1: Restructure the header for morphing**

Current header: `fixed inset-x-0 top-0` with conditional background on scroll.

New header structure:
- Outer wrapper: `fixed top-0 inset-x-0 z-50 flex justify-center`
- Inner pill: `motion.nav` that animates between full-width transparent → narrower pill with glass
- Use `isScrolled` (already tracked) to drive the morph

```tsx
// Key layout change:
<div className="fixed top-0 inset-x-0 z-50 flex justify-center p-0 md:px-4 transition-all duration-500"
  style={{ paddingTop: isScrolled ? '0.75rem' : '0' }}
>
  <motion.nav
    className={cn(
      "w-full flex items-center h-16 md:h-14 px-4 md:px-6 transition-all duration-500",
      isScrolled
        ? "max-w-4xl rounded-full bg-background/70 backdrop-blur-xl border border-border/30 shadow-lg"
        : "max-w-6xl bg-transparent"
    )}
    layout
    transition={{ type: "spring", damping: 25, stiffness: 200 }}
  >
    {/* Logo */}
    {/* Nav links — only visible when scrolled (desktop) */}
    {/* Language toggle — always visible */}
    {/* Menu icon — mobile only */}
  </motion.nav>
</div>
```

**Step 2: Move theme toggle into menu, keep language toggle visible**

- Remove `<ModeToggle />` from the visible header bar
- Add `<ModeToggle />` inside the `SheetContent` (desktop and mobile menu)
- `{languageToggle}` stays in the main bar

**Step 3: Show/hide nav links based on scroll state**

Desktop nav links should only appear when `isScrolled` is true. Use `AnimatePresence` for smooth enter/exit.

```tsx
<AnimatePresence>
  {isScrolled && (
    <motion.div
      initial={{ opacity: 0, width: 0 }}
      animate={{ opacity: 1, width: "auto" }}
      exit={{ opacity: 0, width: 0 }}
      transition={{ duration: 0.3 }}
      className="hidden md:flex overflow-hidden"
    >
      <NavigationMenu>...</NavigationMenu>
    </motion.div>
  )}
</AnimatePresence>
```

**Step 4: Sliding active section indicator**

Replace the current `layoutId="activeNavItem"` background pill with a bottom-edge underline that slides. Use `motion.layoutId` on the underline `span` so it animates position between nav items.

```tsx
{active && (
  <motion.span
    layoutId="navIndicator"
    className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
  />
)}
```

**Step 5: Verify visually**

Run: `npm run dev`
Expected: Header starts transparent and minimal. After scrolling past hero, it morphs into a floating pill with nav links sliding in. Active indicator slides between sections.

**Step 6: Commit**

```bash
git add components/header.tsx app/globals.css
git commit -m "feat(navbar): transparent to floating pill morph with sliding indicator"
```

---

## Task 10: Navbar — Mobile Full-Screen Overlay Menu

**Files:**
- Modify: `components/header.tsx`

**Step 1: Replace Sheet (side drawer) with full-screen overlay**

Remove the Radix `Sheet` component for mobile. Replace with a custom full-screen overlay using Framer Motion.

```tsx
// Full-screen menu overlay:
<AnimatePresence>
  {isMobileMenuOpen && (
    <motion.div
      className="fixed inset-0 z-40 bg-background flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Close button in top-right */}
      <div className="flex justify-end p-6">
        <button onClick={() => setIsMobileMenuOpen(false)}>
          <X className="size-6" />
        </button>
      </div>

      {/* Nav links — large, centered, staggered animation */}
      <nav className="flex-1 flex flex-col items-center justify-center gap-8">
        {navItems.map((item, i) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: i * 0.1, type: "spring", damping: 20 }}
          >
            <Link
              href={getNavHref(item)}
              className="text-3xl font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {getNavText(item)}
            </Link>
          </motion.div>
        ))}
      </nav>

      {/* Bottom: language toggle + theme toggle + CTA */}
      <div className="p-8 flex flex-col gap-4 items-center">
        <div className="flex gap-4">
          {languageToggle}
          <ModeToggle />
        </div>
        <Button asChild className="w-full max-w-xs" size="lg">
          <Link href="/schedule">{contactMeText}</Link>
        </Button>
      </div>
    </motion.div>
  )}
</AnimatePresence>
```

**Step 2: Update hamburger/close button animation**

Keep the existing `AnimatePresence` rotation animation for the menu/close icon toggle.

**Step 3: Verify on mobile viewport**

Run: `npm run dev`, mobile viewport.
Expected: Hamburger opens full-screen overlay with large staggered links, language + theme toggles at bottom.

**Step 4: Commit**

```bash
git add components/header.tsx
git commit -m "feat(navbar): full-screen mobile menu overlay with staggered links"
```

---

## Task 11: Accessibility & Reduced Motion

**Files:**
- Modify: `components/hero-section-client.tsx`
- Modify: `components/sections/services-horizontal-scroll.tsx`
- Modify: `components/sections/portfolio-spotlight-card.tsx`
- Modify: `components/ui/animated-text.tsx`
- Modify: `app/globals.css`

**Step 1: Add reduced motion support**

Use `useReducedMotion()` from Framer Motion in all animated components. When `true`:
- Disable word-by-word animation → show all text immediately
- Disable parallax → static positioning
- Disable horizontal scroll pinning → show services as a simple grid
- Disable sticky portfolio cards → show as a vertical list
- Replace spring/stagger animations with simple opacity fades

```tsx
import { useReducedMotion } from "motion/react";

// In each component:
const prefersReducedMotion = useReducedMotion();

// Example in AnimatedText:
if (prefersReducedMotion) {
  return <Tag className={className}>{children}</Tag>;
}
```

**Step 2: Add CSS fallback for prefers-reduced-motion**

```css
/* app/globals.css */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Step 3: Verify semantic HTML**

Ensure all sections maintain proper heading hierarchy (h1 in hero, h2 in services/portfolio), nav landmarks, and ARIA labels.

**Step 4: Verify with reduced motion**

Enable "Reduce motion" in macOS System Preferences → Accessibility → Display.
Run: `npm run dev`
Expected: All animations replaced with simple fades or instant display.

**Step 5: Commit**

```bash
git add components/hero-section-client.tsx components/sections/services-horizontal-scroll.tsx components/sections/portfolio-spotlight-card.tsx components/ui/animated-text.tsx app/globals.css
git commit -m "feat: reduced motion support and accessibility pass"
```

---

## Task 12: Layout Integration & Cleanup

**Files:**
- Modify: `app/[locale]/(website)/page.tsx`
- Modify: `app/[locale]/(website)/layout.tsx`

**Step 1: Update page.tsx section order and spacing**

Ensure the redesigned sections flow together:
- Remove `BackgroundPaperShaders` from page.tsx (now inside hero)
- Ensure no extra margins between Hero → Services → Portfolio
- Keep remaining sections (Tools, About, How I Work, etc.) unchanged

```tsx
// page.tsx final structure:
<>
  {/* Schema scripts... */}
  <HeroSection />
  <ServicesSectionCinematic />
  <PortfolioSectionCinematic />
  <ToolsSection />
  <AboutMeSection />
  <HowIWorkSection />
  <HowIPriceSection />
  <FAQSection />
  <ContactSection socialLinks={socialLinksRaw} />
  <FloatingContactButton contactMeText={t("scheduleCall")} />
</>
```

**Step 2: Update layout.tsx for new header**

The layout currently adds `mt-16` to main content to offset the fixed header. Since the hero is now full-viewport and the header starts transparent, remove the `mt-16` — the hero content positioning handles the header overlap.

```tsx
// layout.tsx:
<main id="main-content" className="flex flex-1 flex-col">
  {props.children}
</main>
```

**Step 3: Remove old unused components**

If the old `services-section.tsx` and `portfolio-section.tsx` are fully replaced, keep them but add a `_deprecated_` prefix or leave a comment. Don't delete yet — keep as fallback reference.

**Step 4: Full visual review**

Run: `npm run dev`
Test: Desktop (1440px), tablet (768px), mobile (375px).
Expected: Seamless flow from hero → services → portfolio with no jarring breaks. Rest of page unaffected.

**Step 5: Commit**

```bash
git add app/[locale]/(website)/page.tsx app/[locale]/(website)/layout.tsx
git commit -m "feat: integrate cinematic sections and clean up layout"
```

---

## Task 13: Performance Optimization

**Files:**
- Modify: `components/ui/background-paper-shaders.tsx`
- Modify: `components/sections/portfolio-spotlight-card.tsx`

**Step 1: Lazy-load the shader**

Wrap the shader in `dynamic()` from Next.js with `ssr: false` and a fallback gradient.

```tsx
import dynamic from "next/dynamic";

const MeshGradientLazy = dynamic(
  () => import("@paper-design/shaders-react").then(m => ({ default: m.MeshGradient })),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
    ),
  }
);
```

**Step 2: Lazy-load portfolio videos**

Videos should only load when their card is approaching the viewport. Use `loading="lazy"` on video elements and only set `src` when `useInView` returns true.

**Step 3: Add `will-change` hints**

Add `will-change: transform` to sticky containers and horizontally scrolling elements for GPU compositing. Remove after animation completes to free memory.

**Step 4: Test performance**

Run Lighthouse on `npm run build && npm run start`.
Expected: Performance score > 85 on mobile.

**Step 5: Commit**

```bash
git add components/ui/background-paper-shaders.tsx components/sections/portfolio-spotlight-card.tsx
git commit -m "perf: lazy-load shader and videos, GPU compositing hints"
```

---

## Reference: Key File Paths

| File | Purpose |
|------|---------|
| `app/[locale]/(website)/page.tsx` | Homepage — section composition |
| `app/[locale]/(website)/layout.tsx` | Website layout — header, footer, main offset |
| `app/globals.css` | Design tokens, animations, utilities |
| `components/hero-section.tsx` | Hero server component (translations) |
| `components/hero-section-client.tsx` | NEW: Hero client component (animations) |
| `components/ui/animated-text.tsx` | NEW: Word-by-word text animation |
| `components/ui/background-paper-shaders.tsx` | Shader background (mouse-reactive) |
| `components/sections/services-section-cinematic.tsx` | NEW: Cinematic services (server) |
| `components/sections/services-horizontal-scroll.tsx` | NEW: Horizontal scroll container |
| `components/sections/portfolio-section-cinematic.tsx` | NEW: Cinematic portfolio (server) |
| `components/sections/portfolio-spotlight-card.tsx` | NEW: Full-viewport project card |
| `components/header.tsx` | Navbar (transparent → pill morph) |
| `components/contact-button-observer.tsx` | Floating CTA on mobile |
| `lib/data/services.ts` | Service data (unchanged) |
| `lib/portfolio.ts` | Portfolio data loading (unchanged) |
