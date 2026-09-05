# Design System: Eduard Stefan — Precision Editorial

## Purpose

This document turns the current homepage into the reusable visual and interaction system for the rest of the website. Use it when reworking service pages, the blog, legal pages, booking entry points, and future editorial or product pages.

The goal is consistency, not duplication. Other pages should inherit the homepage's atmosphere, typography, palette, spacing, controls, rules, imagery, and motion language without copying every homepage composition literally.

When this document and an older concept image disagree, use this order of authority:

1. The current rendered homepage and its working components.
2. This `DESIGN.md`.
3. The reference pack in `docs/design-references/homepage-precision-editorial/`.

Preserve real content, routes, localization, accessibility, analytics, and application behavior while applying the system.

## 1. Visual Theme and Atmosphere

The site should feel like a precision instrument laid out in an editorial studio: calm, exact, tactile, technically credible, and quietly personal.

- **Density: 4/10 — gallery-airy.** Large pauses and strong section boundaries create rhythm. Information is concentrated into purposeful areas rather than spread across many small cards.
- **Variance: 7/10 — structured asymmetry.** Use offset compositions, unequal columns, alternating artifact placement, and controlled negative space inside a stable grid.
- **Motion: 4/10 — restrained and responsive.** Motion acknowledges interaction and reveals hierarchy. It must never become decoration competing with the work.
- **Shape language:** mostly square, with 0–6px corner radii. Rounded pills and soft dashboard cards do not belong to the primary website language.
- **Surface language:** warm paper, charcoal instruments, muted clay, thin calibration rules, technical diagrams, working surfaces, specification sheets, and photographic material.
- **Voice:** direct, concrete, senior, collaborative, and low-hype. Explain the work and the outcome without agency clichés.

The interface is not a generic SaaS site, a glossy agency template, or a decorative portfolio. It should feel designed by someone who understands both editorial systems and production engineering.

## 2. Color Palette and Roles

Use one signal accent: acid lime. Clay is a supporting material color, not a second interactive accent.

### Core colors

| Token | Value | Role |
| --- | --- | --- |
| **Instrument Charcoal** | `#11110F` | Primary dark background, footer, dark editorial sections, cinematic close |
| **Raised Charcoal** | `#181412` | Subtle elevation on dark surfaces |
| **Bone Paper** | `hsl(43 24% 91%)` / approximately `#EEEAE3` | Primary light background |
| **Raised Paper** | `hsl(42 24% 94%)` / approximately `#F3F1EC` | Light raised surfaces and quiet separation |
| **Ink** | `hsl(60 6% 9%)` / approximately `#181816` | Primary light-mode text and dark text on lime |
| **Warm White** | `#F2ECE2` | Primary text on charcoal |
| **Hero Warm White** | `#F4F0E7` | High-emphasis hero text in dark mode |
| **Signal Lime** | `hsl(72 88% 57%)` / approximately `#CBF231` | Primary CTA fills, active states, arrow emphasis, focus rings |
| **Dark Signal Lime** | `hsl(72 88% 61%)` / approximately `#D0F344` | Slightly brighter lime on dark surfaces |
| **Clay** | `#A96F52` | Warm editorial field and material accent |
| **Deep Clay** | `#281C18` | Dark-mode clay field |
| **Specification Paper** | `#D8D0C3` | Tactile proposal/specification artifacts |
| **Sanity Coral** | `#F36458` | Functional color inside Sanity interface artifacts only; never a site-wide CTA color |

### Text and rule colors

- Dark-surface body copy: `rgb(238 231 220 / 0.72)`.
- Dark-surface subtle labels: `rgb(238 231 220 / 0.58)`.
- Dark rules: `rgb(255 255 255 / 0.14)`; stronger rules: `rgb(255 255 255 / 0.24)`.
- Light-mode muted text: `hsl(35 7% 34%)`, approximately `#5D5851`.
- Light rules should normally be derived from the current text color at 16–25% opacity.
- Action underlines can use current text at roughly 48% opacity and become lime on hover.

### Color rules

- Use lime sparingly. It identifies the primary action, active navigation, open-state marker, focus ring, or one important signal.
- Lime text on light paper must use the readable `--primary-text` treatment rather than the brightest fill color.
- Maintain one dominant surface per section. Avoid nested white cards on white or black cards on black.
- Gradients are allowed only as photographic scrims that protect text contrast. Do not use decorative gradients or gradient text.
- Never use pure black `#000000` as a large site surface.
- Do not introduce purple, blue-neon, or multi-accent palettes.

## 3. Typography

### Font families

- **Display and body:** Manrope, weights 400, 500, 600, and 700.
- **Labels and technical metadata:** DM Mono, weights 300, 400, and 500.
- Do not introduce a serif merely to make a page feel editorial. The homepage achieves editorial character through scale, spacing, rules, and composition.
- Do not use Inter, generic system UI typography, or a different display font on individual pages.

### Display hierarchy

- Hero display: `clamp(3.15rem, 5.15vw, 5.4rem)`, weight 400, line-height about `0.94`, tracking about `-0.055em`.
- Standard section title: `clamp(2.75rem, 4.6vw, 4.75rem)`, weight 400, line-height `0.96`, tracking `-0.05em`.
- Compact section title: `clamp(2.65rem, 3.6vw, 3.75rem)`.
- Cinematic closing title may reach `clamp(2.75rem, 7vw, 6.5rem)` when the section is intentionally centered and isolated.
- Card/cell headings: approximately `1.45rem–2rem`, weight 400, tight line-height around `1.02`, tracking from `-0.035em` to `-0.04em`.

Use `text-balance` for display headings. Keep line breaks meaningful and language-safe; never clip translated headings to preserve a visual shape.

### Body copy

- Standard section copy: `1rem`, rising to `1.0625rem` from 768px, line-height `1.65`.
- Hero and closing copy may reach `1.125rem` on larger screens.
- Keep normal body lines to roughly 34–55 characters where the layout allows, and never exceed about 65 characters.
- Use `text-pretty` for supporting paragraphs where wrapping quality matters.
- Default to regular weight. Use medium or semibold only for actions, compact labels, and information that truly needs emphasis.

### Labels and metadata

- DM Mono, uppercase, `0.6rem–0.68rem`, medium weight, tracking `0.12em–0.14em`.
- Labels are quiet orientation devices, not decorative eyebrow slogans.
- Counters and sequence numbers should use two digits when part of a technical artifact: `01`, `02`, `03`.

## 4. Grid, Containers, and Spacing

### Primary container

- Reuse the `editorial-shell` geometry: centered, full width, maximum width `90rem`.
- Horizontal padding: `1.25rem` mobile, `2rem` from 640px, `3rem` from 1024px.
- The homepage hero is an intentional exception: it is full bleed and uses the same inset values internally.

### Section rhythm

- Standard vertical padding: `5rem` mobile, `6rem` from 640px, `8rem` from 1024px.
- Separate major sections with one-pixel rules, a meaningful surface change, or both.
- Prefer `margin-top` values around `1.5rem`, `2.25rem`, and `2.5rem` to establish local hierarchy.
- Let important compositions breathe. Do not fill empty areas with badges, statistics, illustrations, or extra copy.

### Layout system

- Use a 12-column CSS Grid for major desktop compositions.
- Typical editorial split: 4 columns for context and 8 for content.
- Typical image/text split: 5/7, 6/6, or 7/5 depending on the artifact's importance.
- Unequal columns are preferred when they improve hierarchy.
- Replace generic card rows with gapless ruled grids, definition lists, editorial splits, or one dominant artifact.
- Use grid rather than percentage `calc()` layouts.

### Borders and corners

- Rules are normally one pixel and low contrast.
- Use stronger rules only for active structure, accordion boundaries, or specification sheets.
- Primary CTA and editorial artifact corners: `2px` is the default visual target.
- Utility controls may use the shared small radius token, but avoid pills.

## 5. Page Composition

### Interior-page opening

Interior pages should feel related to the homepage hero without copying its full-height scene by default.

- Start with a strong left-aligned title and concise supporting copy.
- Use an asymmetric 12-column composition or a wide title with a disciplined artifact zone.
- Keep one clear primary action when the page needs an action.
- A photographic or technical hero must carry meaning. Do not add a stock image simply to fill the right side.
- Reserve full-viewport cinematic heroes for genuinely high-level landing pages.

### Content sections

- Open with a mono section label, a clear title, and one useful explanatory paragraph.
- Build hierarchy using scale, space, rules, and artifacts before adding containers.
- Long-form pages may use a narrower reading column inside the editorial shell, while titles and supporting artifacts can break wider.
- Alternate dark, paper, raised paper, and clay only when the content warrants a meaningful change in mode.
- Each major section should have one dominant idea and, at most, one dominant action.

### Closing pattern

- High-intent pages should end with the dark cinematic contact section and minimal footer.
- Use one large statement, one lime primary CTA, and an optional understated secondary text link.
- Do not stack several equal buttons or repeat navigation inside the closing scene.

## 6. Component Language

### Primary signal button

- Acid-lime fill with dark ink text.
- Nearly square corners (`2px`), no outer glow, no large shadow.
- Minimum target height: `48px`; the major closing CTA may use `64px`.
- Semibold Manrope, short label, no wrapping.
- Arrow: northeast arrow placed after the label when the action leaves the current context or starts contact.
- Hover: slight opacity reduction; arrow moves about `2px` up and right.
- Active: move the control down `1px`.
- Focus: 2px lime outline with a 4px offset.

### Editorial text link

- Inline-flex with a one-pixel underline/rule, minimum height `44px`.
- Medium weight, usually `0.875rem–1rem`.
- Hover: text and rule shift to lime and the link rises `2px`; an arrow, when present, moves slightly up and right.
- Active: link moves down `1px`.
- Use this for secondary actions, direct questions, and quiet navigation between related pages.

### Header navigation

- Logo and nav links use simple color-only hover. Never scale or grow them.
- Hover color is lime. The active desktop section/page adds a one-pixel lime underline.
- Header controls and text stay compact while retaining 44px interaction targets.
- Language and theme controls use the shared utility Button treatment and always show a pointer cursor.
- The homepage header is transparent and absolute over the hero at the top. After scrolling, it becomes fixed with the current background at about 92% opacity, a subtle bottom rule, and restrained backdrop blur.
- On interior pages, use the regular background with a subtle bottom rule.
- Hide the project CTA at the intermediate desktop breakpoint when space is constrained; never allow its label to wrap.
- Below 768px, replace the horizontal navigation with the existing sheet-style mobile menu.

### Accordions

- Use large, full-width ruled rows rather than cards.
- Row height: approximately `80–96px`, depending on viewport and translation.
- Question type: `1.2rem–1.55rem`, regular weight, tight tracking.
- Use a mono `+` and `−` at the trailing edge; lime marks the open state.
- Allow one open item by default when it helps visitors understand the content pattern.
- Keep the related CTA below the full question list, not in a disconnected side column.

### Cards and structured content

- Avoid generic elevated cards.
- For services and capabilities, prefer gapless grid cells with thin rules and an integrated artifact.
- For factual comparisons, scopes, or deliverables, prefer definition lists and specification-sheet layouts.
- Use shadows only for physical-looking layered artifacts such as paper, screenshots, or pinned material.

### Forms

- Put labels above fields and error/help text below.
- Use square or lightly rounded fields with visible boundaries.
- Focus must use the lime ring system.
- Preserve clear validation, keyboard order, and 44px controls.
- Do not use floating labels or glass inputs.

### Footer

- Charcoal surface with warm-white text and a single top rule.
- Compact grid: identity, location, social/language controls, navigation, legal links, and copyright.
- Utility links use color-only lime hover and 44px minimum targets.
- The footer language menu must open upward or otherwise remain fully inside the viewport.

## 7. Imagery and Artifacts

Imagery is structural, not decorative.

- Favor real working surfaces, technical sketches, content models, interface crops, specification sheets, editorial layouts, and the real portrait.
- Pair light and dark image variants when an artifact must remain legible in both themes.
- Use `next/image`, correct intrinsic dimensions, and realistic `sizes` values.
- Use `object-cover` for atmospheric scenes and `object-contain` when every part of a diagram must remain visible.
- Mobile crops should preserve the subject and natural proportions. Never clip essential content to mimic desktop framing.
- The About portrait may use grayscale, slight sepia, contrast, and brightness calibration, but identity must remain recognizable.
- Layered artifacts can rotate by roughly `0.5–2.6deg` and use deep, background-tinted shadows to suggest paper or screens.
- Small embedded interface mockups must look plausible and purposeful; avoid fake dashboards full of meaningless charts.
- Decorative images should have empty alt text. Meaningful images require concise localized alt text.

## 8. Motion and Interaction

Motion is quiet evidence of quality. It should make hierarchy and interaction clearer without making the site feel animated.

### Timing

- Hover and press feedback: about `200ms`.
- Section reveals: about `500–550ms` with confident deceleration.
- Major hero entrance: about `1.2–1.4s`, very gentle, with small offsets.
- Use `cubic-bezier(0.16, 1, 0.3, 1)` or an equivalently calm ease for reveals and artifact motion.

### Allowed patterns

- Small opacity and vertical-position entrances for section content.
- Mild scroll parallax on one large image when it improves depth.
- Subtle drift or transform inside an artifact on hover.
- Arrow movement up and right on actionable links.
- Color-only hover for logo and navigation links.
- One-pixel active press translation for buttons and text links.

### Rules

- Animate transform and opacity whenever possible.
- Do not animate layout dimensions or create content jumps.
- Avoid scale hover on navigation, logo, language control, and theme control.
- Do not add perpetual pulsing, floating, shimmer, or rotating decoration to standard page content.
- Never block interaction while an animation finishes.
- Every motion pattern must have a reduced-motion fallback. Remove transforms and disable nonessential transitions under `prefers-reduced-motion: reduce`.

## 9. Responsive Behavior

### Breakpoints

- Mobile-first base: below 640px.
- Small: 640px.
- Medium: 768px.
- Large: 1024px.
- Extra large: 1280px.

### Mobile requirements

- Collapse major multi-column layouts to one clear reading sequence below 768px unless a component has a proven alternative.
- Headline and explanation come before supporting imagery.
- Maintain `20px` horizontal page padding.
- All actionable controls must be at least `44px` high or wide.
- Never allow horizontal document overflow: `document.documentElement.scrollWidth` must equal `window.innerWidth`.
- Remove decorative rotations when they reduce readability, especially on specification sheets.
- Use natural image ratios and intentional mobile crops.
- Do not shorten, clamp, or hide translated copy to make a composition fit.

### Tablet and smaller desktop

- Treat 768–1279px as a designed range, not an accidental interpolation.
- Check long navigation and translated labels before displaying the header CTA.
- Move large portraits or artifacts away from text when an intermediate width creates overlap.
- Rebalance columns or hide nonessential header actions before allowing wrapping or collision.

### Required validation widths

- `390px` for mobile in English, Romanian, and Spanish.
- Around `900px` for tablet and content-order checks.
- `1024px` and `1217–1280px` for intermediate header and overlap checks.
- `1440px` for the primary desktop composition.

## 10. Light and Dark Themes

- Both themes are first-class unless a task explicitly scopes a page otherwise.
- Light mode uses bone paper, raised paper, ink, muted warm grays, and readable olive-toned lime text where needed.
- Dark mode uses Instrument Charcoal, warm-white foregrounds, translucent warm copy, and the brighter signal lime.
- Use semantic tokens (`background`, `foreground`, `muted-foreground`, `primary`, and section-local variables) rather than scattering new colors.
- Theme changes must not create global transition flashes.
- Keep the current three-state behavior: light, dark, and system. The system state reflects the resolved theme visually.
- Never place bright lime body text on bone paper or white text on light surfaces.

## 11. Content and Localization

- English, Romanian, and Spanish are equal layouts, not an English layout with translated strings inserted later.
- Content comes from the existing `next-intl` message namespaces and structured data sources.
- Preserve localized routes and anchor IDs derived from translated navigation settings.
- Use direct, concrete copy. Prefer specific capabilities, workflows, deliverables, and outcomes.
- Avoid phrases such as “elevate,” “seamless,” “next-gen,” “unlock,” “digital experiences,” “world-class,” and “web surfaces.”
- Do not imply that discovery is only a short call. Describe onboarding, business needs, users, content mapping, constraints, priorities, and delivery planning accurately and concisely.
- Do not invent certifications, client results, years of experience, response-time promises, prices, or performance claims.
- Calls to action should say what happens next: “Discuss project,” “Tell me about your site,” “Book a short call,” or similarly concrete wording.

## 12. Accessibility and Interaction Quality

- Use semantic landmarks, headings in order, lists for sequences, definition lists for paired facts, and real buttons/links for actions.
- Maintain visible keyboard focus using the lime outline/ring system.
- Keep minimum mobile interaction targets at `44px`.
- Preserve skip navigation and keyboard-operable mobile navigation, menus, accordions, and theme controls.
- Do not encode meaning through color alone; pair active color with an underline, plus/minus state, label, or structural change.
- Check contrast in both themes and across photographic backgrounds.
- Respect reduced motion at component and global levels.
- Prevent layout shift by reserving image dimensions and keeping interactive labels from wrapping unexpectedly.

## 13. Implementation Conventions

Reuse the existing system before creating a new abstraction:

- `frontend/app/globals.css` — semantic tokens and shared editorial classes.
- `frontend/components/header.tsx` — responsive navigation and homepage scroll behavior.
- `frontend/components/ui/button.tsx` and `frontend/components/ui/link.tsx` — shared actions.
- `frontend/components/language-toggle.tsx` — main-site Radix language menu.
- `frontend/components/theme-toggle.tsx` — light/dark/system control.
- `frontend/components/hero-section.tsx` — full-bleed cinematic opening.
- `frontend/components/sections/services-section.tsx` — ruled capability grid.
- `frontend/components/sections/sanity-spotlight-section.tsx` — layered product/editorial artifacts.
- `frontend/components/sections/ways-to-work-together-section.tsx` — offer plus specification-sheet pattern.
- `frontend/components/sections/about-me-section-client.tsx` — editorial portrait composition.
- `frontend/components/faq-section.tsx` — ruled accordion pattern.
- `frontend/components/sections/contact-section.tsx` and `frontend/components/footer.tsx` — closing system.

Do not edit the similarly named Base UI components inside `frontend/booking-system/apps/web/` when changing the main website unless the booking app is explicitly in scope.

Favor the existing semantic classes:

- `editorial-shell`
- `editorial-section`
- `editorial-label`
- `editorial-section-title`
- `editorial-section-title-compact`
- `editorial-section-copy`
- `editorial-text-link`
- `editorial-display`
- `signal-button`
- `dark-instrument`
- `editorial-surface-raised`
- `editorial-clay-surface`

Add a reusable class or component only when the same pattern is needed in more than one place. Avoid page-specific forks of buttons, headings, and containers.

## 14. Applying the System to Other Pages

For each page rework:

1. Inventory the page's real content, actions, media, routes, analytics, and localized variants.
2. Choose one opening composition, one primary action, and one dominant surface.
3. Map every section to an existing homepage pattern: editorial intro, ruled grid, layered artifact, specification sheet, portrait/story, accordion, or cinematic close.
4. Remove generic cards, duplicated CTAs, decorative badges, and filler sections before adding new styling.
5. Reuse semantic tokens and shared components.
6. Validate content order and line wrapping in EN, RO, and ES.
7. Verify keyboard focus, reduced motion, image loading, theme contrast, and no horizontal overflow.

The result should clearly belong to the same website while allowing the page's information architecture to determine its exact composition.

## 15. Banned Patterns

Never introduce these into the primary website design language:

- Generic three-card feature rows.
- Pill-shaped buttons, pill navigation, or excessive rounded containers.
- Large collections of floating cards on an empty background.
- Decorative glassmorphism or generic translucent blur panels.
- Neon glows, purple/blue gradients, aurora backgrounds, or gradient text.
- Excessive shadows; use them only to establish physical artifact depth.
- Scale or grow hover on logo and navigation items.
- Continuous decorative animation, bouncing arrows, or “scroll to explore” prompts.
- Custom cursors.
- Stock photography unrelated to the work.
- Fake dashboard metrics, fake testimonials, or unverified proof.
- Huge type used only for spectacle when it damages hierarchy or translation.
- Overlapping text and imagery at intermediate widths.
- Clipped or line-clamped translated content.
- Multiple equally loud CTAs in one section.
- Tiny interaction targets or invisible focus states.
- AI marketing clichés and abstract labels that do not explain the work.

## 16. Acceptance Checklist

Before considering a reworked page complete, confirm:

- The page uses Manrope and DM Mono consistently.
- The palette stays within paper, charcoal, clay, warm neutrals, and one lime signal.
- Titles, copy widths, rules, and spacing follow the editorial hierarchy.
- The page has one clearly dominant action per major decision point.
- Shared buttons, links, header, language, theme, and footer behaviors remain consistent.
- Logo and navigation hover are color-only; active navigation is underlined.
- Arrow actions use the established subtle up-right motion.
- EN, RO, and ES render complete copy without clipping.
- Desktop, tablet, 1024–1280px, and 390px layouts have intentional composition.
- There is no horizontal overflow.
- Touch targets are at least 44px.
- Keyboard focus is visible and interaction order is logical.
- Reduced motion removes nonessential transforms.
- Light and dark contrast are both correct.
- Images have correct sizing, cropping, theme variants, and alt behavior.
- No unverified claims or generic placeholder content were introduced.
- Browser console is clean, TypeScript passes, targeted formatting/lint checks pass, and `git diff --check` passes.
