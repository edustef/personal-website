# Homepage precision-editorial redesign handover

## Purpose

This folder is the stable visual reference pack for a section-by-section homepage rework. Each image is a single horizontal section concept. Treat the images as the visual target and the existing translated content as the factual/content source.

The current working branch is `refactor/new-design-taste`. A broad first implementation pass is present but uncommitted. It establishes some useful palette and layout scaffolding, but it does **not** yet match the references closely enough. Rework one section per task rather than trying to normalize the whole page again.

## Shared visual system

- Concept: a precision instrument / calibrated craft.
- Palette: warm bone paper, near-black ink, muted clay, acid-lime signal accent.
- Type: refined grotesk for display and body; small mono annotations.
- Structure: 12-column editorial grid, thin rules, square 2–6px corners, generous whitespace.
- Imagery: tactile, art-directed, and structurally important—not decorative thumbnails.
- Motion: quiet float/parallax/reveal cues; respect reduced motion.
- CTAs: one unmistakable primary action per major section; avoid pill-button repetition.
- Preserve EN/RO/ES content, routes, anchor IDs, analytics, WhatsApp links, keyboard access, and 44px mobile targets.
- Validate each section at desktop and 390px. Required boundary: `document.documentElement.scrollWidth === window.innerWidth`.
- Do not add claims visible only in a concept unless they are verified in source content.

## Current verification boundary

- `npm run type-check`: passed after regenerating Next route types.
- Targeted Biome check of the changed homepage files: passed.
- Local desktop and 390px checks: eight sections render; mobile menu works; no horizontal overflow; no browser console errors.
- Production build was started but intentionally interrupted when the work switched to this handover. Do not call the build verified.
- Local preview was running at `http://127.0.0.1:3000/en` at handover time.

## Section tasks

### 01 — Hero

Reference: [01-hero.png](./01-hero.png)

Primary source:

- `frontend/components/hero-section.tsx`
- `frontend/components/header.tsx`
- `frontend/messages/{en,ro,es}.json` under `home`

Target: a full-bleed working-surface image with a dark tonal overlay; compact transparent navigation; bottom-left statement, CTA cluster, and three quiet trust notes. Preserve the real localized headline and CTA copy unless the task explicitly changes content.

Acceptance focus: match the reference's crop, safe area, bottom alignment, type scale, and header relationship. The current implementation uses an existing project screenshot and is only an approximation.

### 02 — Services

Reference: [02-services.png](./02-services.png)

Primary source:

- `frontend/components/sections/services-section.tsx`
- `frontend/lib/data/services.ts`
- `frontend/messages/{en,ro,es}.json` under `services`

Target: a pristine gapless specimen/grid system with two visually dominant capabilities and smaller supporting cells. Use content-model, layout, or code artifacts instead of generic icon cards.

Acceptance focus: reproduce the reference's cell proportions, quiet rules, internal spacing, and mixed visual/typographic cells. Mobile should become a clean stacked sequence, not a clipped desktop grid.

### 03 — Sanity specialty

Reference: [03-sanity-specialty.png](./03-sanity-specialty.png)

Primary source:

- `frontend/components/sections/sanity-spotlight-section.tsx`
- `frontend/app/[locale]/(website)/services/sanity/`
- `frontend/messages/{en,ro,es}.json` under `home.sanitySpotlight`

Target: muted-clay field; layered content-model, Studio, and finished-page artifacts on the left; concise expertise narrative and capability rows on the right.

Important: the concept's “Sanity certified / production proven” stamp is visual placeholder copy. Do not ship it unless certification/proof is confirmed. Use verified wording from the site instead.

Acceptance focus: build credible layered artifacts with readable depth and a strong desktop-to-mobile reorder. Avoid generic fake dashboard UI.

### 04 — Process

Reference: [04-process.png](./04-process.png)

Primary source:

- `frontend/components/sections/how-i-work-section.tsx`
- `frontend/components/sections/how-i-work-section-client.tsx`
- `frontend/messages/{en,ro,es}.json` under `howIWork`

Target: a near-black calibration track with four sequential delivery stages and tactile evidence artifacts. The four stages should read as one system rather than independent cards.

Acceptance focus: match the reference's horizontal rhythm and active lime marker on desktop; on mobile preserve sequence and detail without truncating translated content.

### 05 — Ways to work together

Reference: [05-work-together.png](./05-work-together.png)

Primary source:

- `frontend/components/sections/ways-to-work-together-section.tsx`
- `frontend/messages/{en,ro,es}.json` under `waysToWorkTogether`

Target: oversized offer statement at left and a tactile, slightly rotated specification sheet at right. This is one focused engagement model, not a pricing-card row.

Acceptance focus: match the sheet's material quality, rotation, field layout, and headline scale. Keep real scope/timeline/include copy; do not invent pricing or availability.

### 06 — About

Reference: [06-about.png](./06-about.png)

Primary source:

- `frontend/components/sections/about-me-section.tsx`
- `frontend/components/sections/about-me-section-client.tsx`
- `frontend/assets/images/me-transparent.png`
- `frontend/messages/{en,ro,es}.json` under `home.aboutMe`

Target: large warm-duotone editorial portrait on a clay field, with the bio in a clean left safe area. Keep the existing real portrait and recognizable identity.

Important: “15+ years” in the concept was explicitly a visual placeholder. Do not ship it unless verified. Use factual profile content already in the repository.

Acceptance focus: portrait crop and scale must match the reference without overlapping copy/CTA at 390px. Mobile order: headline and bio first, portrait second.

### 07 — FAQ

Reference: [07-faq.png](./07-faq.png)

Primary source:

- `frontend/components/faq-section.tsx`
- `frontend/lib/data/faqs.ts`
- `frontend/messages/{en,ro,es}.json` under `faq`

Target: a mini, quiet pacing section with left-side context and large ruled accordion rows. One open row should feel expansive and editorial rather than card-like.

Acceptance focus: match row height, type size, plus/minus treatment, and negative space. Confirm keyboard interaction and visible focus states.

### 08 — Contact and close

Reference: [08-contact.png](./08-contact.png)

Primary source:

- `frontend/components/sections/contact-section.tsx`
- `frontend/components/footer.tsx`
- `frontend/messages/{en,ro,es}.json` under `home.contact`

Target: a dark, cinematic closing scene with one huge statement, one acid-lime primary CTA, a secondary booking link, and a minimal utility footer.

Important: only state a reply-time promise if it is confirmed. Reconcile this section with the existing global footer so the page does not end with two competing footers.

Acceptance focus: reproduce the reference's centered hierarchy, width, background material, and footer rule while keeping social links and localized routes functional.

## Suggested task starter

Copy this into a new task, then add the section-specific context:

> Rework homepage section NN to match `docs/design-references/homepage-precision-editorial/NN-name.png`. Read `docs/design-references/homepage-precision-editorial/HANDOVER.md`, inspect the current component and localized copy, preserve unrelated dirty work, and validate desktop plus 390px. I will provide the exact content/interaction changes below.

## Working-tree note

Before starting any section, inspect `git status` and the diff for that component. The first-pass redesign currently touches shared tokens/layout plus all eight homepage sections. Preserve unrelated work and decide deliberately whether to refine or replace the first-pass code within the selected section.
