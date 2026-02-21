# Homepage Cinematic Redesign

## Goal

Redesign the homepage top half (Hero, Services, Portfolio) and Navbar to feel immersive and experiential — not "vibe-coded." Mobile-first. Balance visual wow-factor with clear conversion paths.

## Scope

Focused on: Hero, Services, Portfolio, Navbar. The rest of the homepage (Tools, About, How I Work, Pricing, FAQ, Contact) remains unchanged for now.

## Tech Stack (already available)

- Framer Motion / motion/react — scroll animations, springs, stagger
- @paper-design/shaders-react — GPU shader backgrounds
- Tailwind v4 — styling
- Radix UI — accessible primitives
- next-intl — i18n (en/ro/es)

---

## Section 1: Hero — "The Shader Stage"

### Layout
- Full viewport height (`100svh`), no max-width constraint
- Hero owns the entire screen edge-to-edge

### Background
- `@paper-design/shaders-react` shader fills viewport
- Reacts to mouse position (desktop) with subtle color distortion
- Mobile: gentle auto-animation loop (no device orientation — keep it simple)
- Lazy-loaded with a matching CSS gradient fallback (no flash on load)
- As user scrolls past ~50%, shader darkens/morphs into services background

### Typography
- Headline: `text-5xl` mobile, `text-7xl md:text-8xl` desktop
- Words animate in one at a time — slide up from below with slight rotation (spring physics)
- Strong/highlighted words get gradient text treatment with subtle pulse
- Tagline fades in after headline completes

### CTA Buttons
- Appear after headline animation finishes
- Positioned at bottom of viewport with frosted glass backdrop
- On scroll: shrink into a sticky mini-bar (replaces current FloatingContactButton)

### Scroll Indicator
- Animated chevron/line at viewport bottom, pulses to invite scroll
- Disappears after first scroll interaction

### Scroll Transition
- Hero content parallaxes up faster than shader background (depth separation)
- Shader morphs/darkens as section exits — no hard break into services

### Announcement Badge
- Keep the HighlightBadge but position it above the headline with a subtle float animation

---

## Section 2: Services — "The Horizontal Cinema"

### Desktop (md+)
- Section takes `100vh` and pins (position: sticky)
- Section title/label pinned at top-left
- Each service is a full-width "slide" that scrolls in from the right as user scrolls vertically
- Large typography for service name, icon animates with spring, description fades up
- Each slide has a colored gradient glow background (using existing glowColors)
- Horizontal progress bar at bottom shows position through services
- After last service: section unpins, normal scroll resumes

### Mobile
- No horizontal scroll pinning
- Vertical card stack: each service card slides up and overlaps previous one
- Slight offset visible so stack builds visually
- Full-width cards with generous padding
- Each card has distinct background glow treatment

### Micro-interactions
- Service icons animate (rotate, scale) as their card enters viewport
- Progress bar gradient shifts color to match current service accent
- Staggered content entry: icon, then title, then description
- Subtle parallax between card background and content

### Transition
- Background transitions from services treatment into portfolio

---

## Section 3: Portfolio — "The Spotlight Stack"

### Desktop (md+)
- Each project gets full viewport (`100vh`) as its stage
- Projects are sticky cards that stack — next project slides up over current one
- Layout: project image/video (60% width) + details (40% width)
- Image/video has subtle parallax offset from text
- Tech stack badges animate in with stagger
- Project counter ("01 / 04") in corner transitions with each card

### Mobile
- Full-width cards, image on top (16:9), details below
- Cards stack with sticky effect, peek of previous card edge visible at top
- "Coming Soon" placeholder becomes full-width CTA card in same stacking style

### Micro-interactions
- Project images: slow Ken Burns effect (zoom) while in viewport
- Tech badges spring in one by one
- Project title: clip-path reveal wipe from left
- Video projects auto-play muted when active card
- Spring animations on card transitions

---

## Section 4: Navbar — "The Contextual Bar"

### Initial State (hero visible)
- Transparent, minimal: logo/name left, language toggle + compact menu icon right
- Theme toggle is inside the menu, NOT visible in the bar
- No nav links visible — hero should breathe

### Scrolled State (past hero)
- Transitions to floating pill shape
- Detaches from screen edges (margin appears), corners round
- Glassmorphic backdrop blur
- Nav links slide in from transparent state
- Language toggle stays visible
- Width animates from full to pill, smooth transition

### Active Section Indicator
- Animated underline slides to current section (tab indicator style, not just color change)

### Mobile
- Transparent thin bar initially
- Scrolled: floating pill with logo + language toggle + hamburger
- Hamburger opens full-screen overlay (not side sheet)
- Large touch targets, staggered link animations
- Language + theme toggles in the overlay

### Micro-interactions
- Logo has subtle hover animation
- Nav links have magnetic cursor pull (desktop)
- Menu open/close uses spring animation
- Floating pill shadow deepens with scroll depth

---

## Performance Constraints

- Shader must be lazy-loaded with CSS fallback
- Use `will-change` and GPU-composited properties (transform, opacity) for animations
- Scroll-driven animations should use Framer Motion's `useScroll` + `useTransform` (not scroll event listeners)
- Pinned sections use CSS `position: sticky` where possible, JS fallback only if needed
- Videos lazy-load and only auto-play when their card is the active/visible one
- All animations respect `prefers-reduced-motion`

## Accessibility

- All interactive elements remain keyboard accessible
- Screen reader announcements for section transitions
- Reduced motion: disable parallax, stagger, and scroll-driven animations; use simple fades
- Maintain semantic HTML (sections, headings, nav landmarks)
- Touch targets minimum 44x44px on mobile

## i18n Considerations

- All text remains translated via next-intl (no hardcoded strings)
- Typography sizing must accommodate Romanian/Spanish text (typically 15-20% longer)
- Word-by-word animation needs to handle different word counts per locale
