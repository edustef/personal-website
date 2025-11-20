# SEO & Accessibility Checklist

## Metadata
- [x] `[locale]/layout.tsx` pulls localized settings for title template, description, metadataBase, Open Graph, twitter, and language alternates.
- [x] `(website)/page.tsx` merges localized hero copy with site-wide OG data and issues locale-specific SEO metadata.
- [x] `(website)/posts/[slug]/page.tsx` localizes titles/excerpts, adds canonical + language alternates, article schema timestamps, and reuses localized OG image fallbacks.
- [x] Settings-derived OG image (URL + alt text) is reused across root/page/post metadata to guarantee consistent cards per locale.
- [ ] Re-run `next lint`/`next build` before deploy to confirm metadata typing stays valid.

## Accessibility
- [x] Header exposes a localized “Skip to main content” link with focus styles and `NavigationMenu` now carries an `aria-label`.
- [x] `(website)/layout.tsx` main region has `id="main-content"` and `tabIndex={-1}` so the skip link target is focusable.
- [x] `HeroSpline` background animation is marked `aria-hidden` and non-focusable.
- [x] Footer year placeholder renders via `<time>` for screen-reader clarity while preserving localized templates.
- [ ] Audit remaining interactive components (LanguageToggle, CTA buttons) for ARIA labels before launch.

## UX & Content Hygiene
- [x] Resume CTA, footer template, and hero copy remain localized via Sanity fields.
- [ ] Revisit commented sections (experience, projects, contact) to ensure headings follow a single `h1` hierarchy when re-enabled.
- [ ] Confirm localized settings document always includes description text for each locale to avoid demo fallbacks.

## Operational Follow-ups
- [ ] Validate updated metadata in the Next.js route analyzer and social card debuggers (Meta/Twitter) per locale.
- [ ] Coordinate with content editors to keep `settings.ogImage` alt text localized alongside the asset.
- [ ] Add automated health checks (e.g., Lighthouse CI) to watch for SEO/a11y regressions in future changes.

