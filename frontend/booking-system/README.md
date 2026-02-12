# Booking System

A production-ready appointment booking system built with **Next.js 16**, **Convex**, **Framer Motion**, and **TailwindCSS 4**. Features a multi-step booking flow with smooth animations, OTP email verification, session management, and real-time availability.

---

## Tech Stack

- **Frontend:** Next.js 16.1.1, React 19, TypeScript 5
- **Backend:** Convex (real-time BaaS)
- **Styling:** TailwindCSS 4, shadcn/ui (base-lyra)
- **Animations:** Framer Motion 12
- **Auth:** Passwordless OTP (email verification)
- **Monorepo:** Turborepo + Bun 1.3.5

---

## Prerequisites

Before you begin, make sure you have:

1. **Bun** (v1.3.5+) — [Install Bun](https://bun.sh)
2. **A Convex account** — [Sign up free](https://convex.dev)
3. **Node.js** (v18+) — required by some tooling

---

## Quick Start (5 minutes)

### Step 1: Install Dependencies

```bash
cd booking-system
bun install
```

### Step 2: Set Up Convex Backend

```bash
bun run dev:setup
```

This will:
- Prompt you to log in to Convex (opens browser)
- Create a new Convex project
- Deploy the schema and functions
- Generate a `.env.local` file with your `CONVEX_DEPLOYMENT` and `CONVEX_URL`

### Step 3: Configure Frontend Environment

Create the frontend env file:

```bash
# Copy from the root .env.local that was auto-generated
cp .env.local apps/web/.env.local
```

Or manually create `apps/web/.env.local`:

```env
NEXT_PUBLIC_CONVEX_URL=https://your-deployment-id.convex.cloud
```

> The `NEXT_PUBLIC_CONVEX_URL` value is the same as `CONVEX_URL` from the root `.env.local`.

### Step 4: Run Development Server

```bash
bun run dev
```

This starts both the Next.js frontend (port 3001) and the Convex backend simultaneously.

Open [http://localhost:3001](http://localhost:3001) to see your booking system.

---

## Project Structure

```
booking-system/
├── apps/
│   └── web/                          # Next.js frontend
│       ├── public/
│       │   └── hero_background.png   # Hero section background
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx        # Root layout (fonts, providers)
│       │   │   ├── page.tsx          # Landing page (hero)
│       │   │   ├── schedule/
│       │   │   │   └── page.tsx      # Booking flow page
│       │   │   └── appointments/
│       │   │       └── page.tsx      # Manage bookings page
│       │   ├── components/
│       │   │   ├── booking-schedule.tsx    # ★ Main booking component
│       │   │   ├── manage-appointments.tsx # ★ Booking management
│       │   │   ├── weekly-calendar.tsx     # ★ Calendar with animations
│       │   │   ├── header.tsx             # Navigation header
│       │   │   ├── providers.tsx          # Convex + Theme providers
│       │   │   ├── theme-provider.tsx     # Dark/light mode
│       │   │   ├── mode-toggle.tsx        # Theme switcher
│       │   │   ├── loader.tsx             # Loading spinner
│       │   │   └── ui/                    # shadcn/ui components (42 files)
│       │   └── lib/
│       │       ├── utils.ts               # cn() utility
│       │       └── cookies.ts             # Session cookie helpers
│       ├── package.json
│       ├── next.config.ts
│       ├── tsconfig.json
│       ├── postcss.config.mjs
│       └── components.json           # shadcn/ui config
├── packages/
│   ├── backend/                      # Convex backend
│   │   ├── convex/
│   │   │   ├── schema.ts            # Database schema (3 tables)
│   │   │   ├── bookings.ts          # Booking CRUD operations
│   │   │   ├── auth.ts              # OTP + session management
│   │   │   ├── healthCheck.ts       # Health endpoint
│   │   │   └── convex.config.ts     # Convex app config
│   │   └── package.json
│   ├── config/                       # Shared TypeScript config
│   │   ├── tsconfig.base.json
│   │   └── package.json
│   └── env/                          # Environment variable validation
│       ├── src/
│       │   ├── web.ts                # Client env (NEXT_PUBLIC_*)
│       │   ├── server.ts             # Server env
│       │   └── native.ts             # React Native env (if needed)
│       ├── tsconfig.json
│       └── package.json
├── package.json                      # Root monorepo config
├── turbo.json                        # Turborepo tasks
├── tsconfig.json                     # Root TS config
├── .env.example                      # Environment template
└── .gitignore
```

---

## Customization Guide

### 1. Change Branding (Required)

Search for `TODO` comments across the codebase to find all branding placeholders:

```bash
grep -r "TODO" apps/web/src/ --include="*.tsx"
```

**Files to update:**

| File | What to Change |
|------|---------------|
| `apps/web/src/app/page.tsx` | Brand name, tagline, city, establishment year |
| `apps/web/src/components/header.tsx` | Logo text |
| `apps/web/src/components/booking-schedule.tsx` | Google Calendar event title/details |
| `apps/web/src/app/layout.tsx` | Page title and meta description |

### 2. Replace Hero Background

Replace `apps/web/public/hero_background.png` with your own image. The image renders as a full-screen background with 30% opacity overlay.

### 3. Customize Colors

Edit `apps/web/src/index.css` — the color system uses CSS custom properties:

```css
:root {
  --gold: oklch(0.75 0.12 85);        /* Primary accent */
  --gold-light: oklch(0.85 0.10 85);  /* Hover states */
  --burgundy: oklch(0.35 0.12 15);    /* Secondary accent */
  --cream: oklch(0.95 0.02 85);       /* Text color */
  --charcoal: oklch(0.15 0.01 0);     /* Background */
}
```

Change these values to match your brand. The entire UI derives from these variables.

### 4. Customize Time Slots

Edit `packages/backend/convex/bookings.ts`:

```typescript
const ALL_SLOTS = [
  "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00",
];
```

And the matching frontend array in `apps/web/src/components/booking-schedule.tsx`:

```typescript
const slots = [
  "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00",
];
```

### 5. Customize Appointment Duration

In `booking-schedule.tsx`, search for `30 min appointment` and change the display text. Also update the Google Calendar duration calculation (currently 30 minutes):

```typescript
endDate.setMinutes(endDate.getMinutes() + 30); // Change 30 to your duration
```

### 6. Enable Real Email Sending

By default, verification codes display in the UI (demo mode). To send real emails:

1. Get a [Resend](https://resend.com) API key
2. Add `RESEND_API_KEY` to your Convex environment
3. Uncomment the email sending code in `packages/backend/convex/auth.ts`

---

## Database Schema

Three tables in Convex:

### `bookings`
| Field | Type | Description |
|-------|------|-------------|
| date | string | YYYY-MM-DD format |
| slot | string | HH:mm format (e.g., "10:00") |
| userEmail | string | Customer email |
| status | "confirmed" \| "cancelled" | Booking state |
| sessionId | string? | Optional session reference |

**Indexes:** `by_date`, `by_email`

### `verificationCodes`
| Field | Type | Description |
|-------|------|-------------|
| email | string | Email that requested the code |
| code | string | 6-digit OTP |
| expiresAt | number | Timestamp (10 min TTL) |

**Indexes:** `by_email`

### `sessions`
| Field | Type | Description |
|-------|------|-------------|
| sessionId | string | UUID |
| email | string | Associated email |
| expiresAt | number | Timestamp (2 hour TTL) |

**Indexes:** `by_sessionId`, `by_email`

---

## Booking Flow

```
Landing (/) → Schedule (/schedule) → Appointments (/appointments)

Schedule Flow:
  1. SELECT DATE    → Calendar with month navigation + drag gestures
  2. SELECT TIME    → 8 time slots in 2-column grid, live availability
  3. VERIFY EMAIL   → OTP verification (or continue with session)
  4. CONFIRMED      → Success screen + Google Calendar export
```

---

## Animation Reference

Every animation is powered by **Framer Motion 12**. Key animations preserved:

- **Step indicator:** Spring-based scale + rotate transitions, shimmer on active step
- **Calendar:** Direction-aware slide transitions, drag-to-navigate months
- **Date buttons:** whileHover scale 1.05, whileTap scale 0.95
- **Time slots:** Staggered fade-in (0.03s delay each), shared layout for selection
- **Slot button:** layoutId="selectedSlot" spring animation
- **Step transitions:** AnimatePresence with x-axis slide (±20px)
- **Active users badge:** Ping animation on live dot
- **Confirmation:** Spring bounce checkmark (bounce: 0.4), staggered detail cards
- **Booking list:** popLayout with staggered entry, slide-out exit on cancel
- **Status bar:** Shimmer gradient animation (3s infinite loop)
- **CTA button:** Shine sweep effect on hover (1000ms CSS transition)
- **Arrow icon:** Infinite x-axis pulse [0, 4, 0] at 1.5s

---

## Deployment

### Vercel (Recommended)

```bash
# 1. Push to GitHub
git init && git add . && git commit -m "Initial commit"
gh repo create booking-system --private --push

# 2. Deploy via Vercel CLI or Dashboard
vercel

# 3. Set environment variable in Vercel
# NEXT_PUBLIC_CONVEX_URL = your Convex deployment URL
```

### Convex Production

```bash
# Deploy Convex to production
cd packages/backend
npx convex deploy --prod
```

---

## Common Commands

```bash
bun run dev          # Start all services (frontend + backend)
bun run dev:web      # Start only Next.js frontend
bun run dev:server   # Start only Convex backend
bun run build        # Production build
bun run dev:setup    # Initial Convex setup
```

---

## Troubleshooting

**"NEXT_PUBLIC_CONVEX_URL is required"**
→ Create `apps/web/.env.local` with your Convex URL

**"Cannot find module @booking-system/backend"**
→ Run `bun install` from the root directory

**Convex functions not deploying**
→ Run `bun run dev:setup` to reconfigure

**Styles not loading**
→ Ensure `@tailwindcss/postcss` is installed: `bun add -D @tailwindcss/postcss tailwindcss`
