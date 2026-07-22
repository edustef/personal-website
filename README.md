# Eduard Stefan — Personal Website

The source for [eduardstefan.dev](https://eduardstefan.dev), a multilingual portfolio and service website built with Next.js.

The website presents Eduard's Sanity CMS and design-system work, but the website itself does not connect to Sanity. Blog posts and portfolio entries are stored locally as MDX.

## Stack

- Next.js 16 and React 19
- TypeScript and Tailwind CSS 4
- `next-intl` for English, Romanian, and Spanish
- Local MDX content with `next-mdx-remote`
- PostHog analytics and Vercel Speed Insights
- Vercel deployment

## Getting started

Install the workspace dependencies:

```shell
npm install
```

Start the Next.js development server:

```shell
npm run dev:next
```

The site is available at [http://localhost:3000](http://localhost:3000).

## Content

Localized content lives in the frontend workspace:

- `frontend/content/blog/{locale}` — blog posts
- `frontend/content/portfolio/{locale}` — portfolio case studies
- `frontend/messages/{locale}.json` — interface and marketing copy

Supported locales are `en`, `ro`, and `es`.

## Quality checks

```shell
npm run type-check
npm run check
npm run build:next
```

## Deployment

The production site is deployed through Vercel from the `frontend` workspace.
