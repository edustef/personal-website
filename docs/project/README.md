# Personal Website project

This directory is the durable source for project context and decisions. Live work is tracked with GitHub Issues and a GitHub Project board.

## Current direction

The website is positioned for established product and marketing teams that already understand content management systems.

The offer is **Sanity-first, not Sanity-only**:

- Sanity CMS architecture, content modeling, migrations, localization, and editor workflows are the flagship specialty.
- Reusable design systems and page-building blocks help marketing publish on-brand work without a developer queue.
- Custom platforms, portals, dashboards, integrations, and ongoing product work remain in scope.
- Claims must be supported by real case studies, verified outcomes, and approved client proof.

## Code baseline

Reconciliation date: 2026-08-02.

- Content and positioning baseline: `codex/sanity-positioning-refresh` at `86e0e2a`.
- The baseline is 4 commits ahead of `main` and 0 behind.
- `develop` is a descendant of the baseline and is 24 commits ahead.
- Later `develop` changes include a broader homepage, a dedicated `/services/sanity` page, Pricing, and removal of the inquiry flow.
- Those later changes must be reconciled explicitly; they do not silently replace the approved positioning baseline.

## Active work

### Core website

- [#10 — Reconcile the Sanity content baseline with develop](https://github.com/edustef/personal-website/issues/10)
- [#12 — Add proof-led Sanity case studies](https://github.com/edustef/personal-website/issues/12)
- [#13 — Document verified outcomes for case studies](https://github.com/edustef/personal-website/issues/13)
- [#14 — Collect client testimonials for Sanity and content-platform work](https://github.com/edustef/personal-website/issues/14)

### Labs

Labs is a separate workstream for experimental interactive components.

- [PR #9 — UI experiments lab with Magnetic Dock](https://github.com/edustef/personal-website/pull/9)
- [#11 — Reconcile Labs PR #9 with the Sanity source branch](https://github.com/edustef/personal-website/issues/11)

PR #9 was reviewed at `294f7d7` and is open and mergeable against the older `main` branch. Because it changes shared navigation, locale messages, and the sitemap, it must be reconciled and revalidated after the core website direction is stable.

## Archived Notion backlog

The following tasks were preserved here as migration history but are no longer active GitHub Issues:

- **Improve CTA Buttons** — superseded by the current design and Sanity positioning.
- **Rewrite Hero Section** — old Romanian small-business CRO headline options conflict with the approved buyer and offer.
- **Create Why Me vs Agency Section** — generic freelancer-versus-agency framing dilutes the established-team positioning.
- **Improve Portfolio Mockups** — premature while proof-led case studies and approved assets are not selected.
- **Create Lead Magnet** — generic SEO/CRO funnel is outside the current primary offer.
- **Write 3 Blog Posts** — generic small-business SEO/CRO topics and unsourced claims do not support the current direction.

Useful parts of three older tasks were retained and re-scoped into issues #12–#14.

## Project workflow

- GitHub Issues hold executable work, context, and acceptance criteria.
- The GitHub Project board shows status and priority across active Issues and pull requests.
- Files under `docs/project/` hold durable context, decisions, and historical rationale.
- Pull requests contain implementation and validation evidence.
- Notion is a read-only migration backup until the GitHub board, Issues, and documentation are verified.
- New website project work should be created in GitHub, not Notion.

## Release guardrails

- Do not reintroduce small-business education or unsupported conversion claims.
- Do not merge Labs automatically.
- Re-run type-check, production build, and proportional visual/accessibility QA after branch reconciliation.
- Preserve client permissions and evidence for every published logo, quote, screenshot, or metric.
