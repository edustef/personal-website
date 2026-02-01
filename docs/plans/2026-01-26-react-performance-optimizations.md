# React Performance Optimizations Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Optimize React components and hooks following Vercel React Best Practices to improve performance, reduce re-renders, and optimize event listeners.

**Architecture:** Apply targeted performance optimizations including passive event listeners, event listener deduplication, reduced intersection observer thresholds, and debounced resize handlers. Each optimization follows TDD principles where applicable and maintains existing functionality.

**Tech Stack:** React 19, Next.js 16, TypeScript, Framer Motion, IntersectionObserver API, ResizeObserver API

---

## Task 1: Optimize Timeline Resize Listener

**Files:**
- Modify: `frontend/components/ui/timeline.tsx:47`
- No test file (UI component)

**Step 1: Add passive option to resize listener**

Locate line 47 in `frontend/components/ui/timeline.tsx` and modify:

```typescript
// Before
window.addEventListener("resize", updateHeight);

// After
window.addEventListener("resize", updateHeight, { passive: true });
```

**Step 2: Verify the component still renders correctly**

Run: `npm run dev`
Navigate to a page with Timeline component (e.g., home page "How I Work" section)
Expected: Timeline renders correctly and height updates on resize

**Step 3: Commit**

```bash
git add frontend/components/ui/timeline.tsx
git commit -m "perf(timeline): add passive option to resize listener

Following Vercel React best practice client-passive-event-listeners.
Improves scroll performance by marking resize listener as passive.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Debounce Timeline Resize Handler

**Files:**
- Modify: `frontend/components/ui/timeline.tsx:37-51`
- No test file (UI component)

**Step 1: Import throttle utility**

Add import at top of file (after existing imports):

```typescript
import { useEffect, useRef, useState } from "react";
import { throttle } from "lodash"; // or implement custom throttle
```

**Step 2: Wrap updateHeight with throttle**

Modify the useEffect around line 37:

```typescript
useEffect(() => {
  const updateHeight = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  };

  // Throttle resize to max once per 100ms
  const throttledUpdateHeight = throttle(updateHeight, 100);

  updateHeight();
  const timeoutId = setTimeout(updateHeight, 0);
  window.addEventListener("resize", throttledUpdateHeight, { passive: true });

  return () => {
    clearTimeout(timeoutId);
    window.removeEventListener("resize", throttledUpdateHeight);
    throttledUpdateHeight.cancel(); // Clean up throttle
  };
});
```

**Step 3: Verify timeline resizing still works smoothly**

Run: `npm run dev`
Test: Resize browser window while viewing timeline
Expected: Height updates smoothly without jank, max once per 100ms

**Step 4: Commit**

```bash
git add frontend/components/ui/timeline.tsx
git commit -m "perf(timeline): throttle resize handler to 100ms

Reduces frequency of height recalculations during resize.
Prevents excessive re-renders and improves performance.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Reduce Reading Progress Intersection Thresholds

**Files:**
- Modify: `frontend/hooks/use-reading-progress.ts:45-49`
- No test file (custom hook)

**Step 1: Reduce threshold array from 101 to 20 items**

Modify the observerOptions around line 45:

```typescript
// Before
const observerOptions: IntersectionObserverInit = {
  root: null,
  rootMargin: "0px",
  threshold: Array.from({ length: 101 }, (_, i) => i / 100),
};

// After
const observerOptions: IntersectionObserverInit = {
  root: null,
  rootMargin: "0px",
  threshold: Array.from({ length: 20 }, (_, i) => i / 19), // 0, 0.05, 0.1, ..., 1.0
};
```

**Step 2: Verify reading progress still works accurately**

Run: `npm run dev`
Navigate to a blog post page
Scroll through article
Expected: Reading progress indicator updates smoothly (20 thresholds still provides smooth updates)

**Step 3: Commit**

```bash
git add frontend/hooks/use-reading-progress.ts
git commit -m "perf(reading-progress): reduce intersection thresholds from 101 to 20

Reduces observer overhead while maintaining smooth progress updates.
20 thresholds = updates every 5% which is sufficient for UX.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Create Global Mobile Detection Context

**Files:**
- Create: `frontend/contexts/mobile-context.tsx`
- Modify: `frontend/hooks/use-mobile.ts`
- Modify: `frontend/app/[locale]/layout.tsx` (to add provider)

**Step 1: Create MobileProvider context**

Create new file `frontend/contexts/mobile-context.tsx`:

```typescript
"use client";

import * as React from "react";

const MOBILE_BREAKPOINT = 768;

type MobileContextType = {
  isMobile: boolean;
};

const MobileContext = React.createContext<MobileContextType | undefined>(
  undefined
);

export function MobileProvider({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return (
    <MobileContext.Provider value={{ isMobile }}>
      {children}
    </MobileContext.Provider>
  );
}

export function useMobileContext() {
  const context = React.useContext(MobileContext);
  if (context === undefined) {
    throw new Error("useMobileContext must be used within a MobileProvider");
  }
  return context;
}
```

**Step 2: Update useIsMobile hook to use context**

Modify `frontend/hooks/use-mobile.ts`:

```typescript
import { useMobileContext } from "@/contexts/mobile-context";

export function useIsMobile() {
  const { isMobile } = useMobileContext();
  return isMobile;
}
```

**Step 3: Add MobileProvider to root layout**

Modify `frontend/app/[locale]/layout.tsx` - add MobileProvider around children:

```typescript
import { MobileProvider } from "@/contexts/mobile-context";

// In the component return:
<html>
  <body>
    <MobileProvider>
      {/* existing providers and children */}
    </MobileProvider>
  </body>
</html>
```

**Step 4: Verify mobile detection still works**

Run: `npm run dev`
Test: Resize browser below and above 768px
Check components using `useIsMobile()` still respond correctly
Expected: Mobile detection works, but only ONE event listener created globally

**Step 5: Commit**

```bash
git add frontend/contexts/mobile-context.tsx frontend/hooks/use-mobile.ts frontend/app/[locale]/layout.tsx
git commit -m "perf(mobile): deduplicate mobile detection with global context

Following Vercel best practice client-event-listeners.
Creates single event listener instead of one per component.
Reduces listener overhead and improves performance.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Verify All Optimizations

**Files:**
- No file changes

**Step 1: Run type checking**

Run: `npm run type-check`
Expected: No TypeScript errors

**Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds without errors or warnings

**Step 3: Manual testing checklist**

Test the following in dev mode (`npm run dev`):

1. ✓ Navigate to home page
2. ✓ Scroll through "How I Work" timeline - verify smooth scrolling
3. ✓ Resize browser window - verify timeline adjusts height
4. ✓ Navigate to a blog post
5. ✓ Scroll through blog post - verify reading progress updates smoothly
6. ✓ Resize browser to mobile width - verify mobile UI appears
7. ✓ Resize back to desktop - verify desktop UI appears
8. ✓ Check browser DevTools console - verify no errors
9. ✓ Check Performance tab - verify no excessive listener registrations

**Step 4: Final commit (if any fixes needed)**

If any issues found and fixed:

```bash
git add <files>
git commit -m "fix(perf): resolve issues from optimization testing

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Document Optimizations

**Files:**
- Create: `docs/performance-optimizations.md`

**Step 1: Create documentation file**

Create `docs/performance-optimizations.md`:

```markdown
# Performance Optimizations

## Overview

This document tracks performance optimizations applied to the codebase following Vercel React Best Practices.

## Completed Optimizations

### 2026-01-26 - Event Listener Optimizations

**Changes:**
1. Added passive event listeners to timeline resize handler
2. Debounced timeline resize handler (100ms throttle)
3. Reduced reading progress intersection thresholds (101 → 20)
4. Deduplicated mobile detection with global context

**Impact:**
- Reduced event listener overhead
- Fewer intersection observer callbacks
- Single global mobile detection listener
- Improved scroll performance

**References:**
- Vercel Rule: `client-passive-event-listeners`
- Vercel Rule: `client-event-listeners`
- Plan: `docs/plans/2026-01-26-react-performance-optimizations.md`

## Best Practices Followed

- ✅ `bundle-dynamic-imports` - Spline component already lazy-loaded
- ✅ `bundle-barrel-imports` - Direct imports (no barrel files)
- ✅ `client-passive-event-listeners` - All scroll/resize listeners passive
- ✅ `client-event-listeners` - Mobile detection deduplicated

## Future Optimization Opportunities

- Consider memoizing AnimatedContainer axisOffset object
- Extract header intersection logic to custom hook
- Add performance monitoring for LCP, FID, CLS metrics
```

**Step 2: Commit documentation**

```bash
git add docs/performance-optimizations.md
git commit -m "docs: add performance optimizations tracking

Documents completed optimizations and future opportunities.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Success Criteria

- ✅ All event listeners use passive option where appropriate
- ✅ Timeline resize handler throttled to 100ms
- ✅ Reading progress uses 20 thresholds instead of 101
- ✅ Mobile detection uses single global listener
- ✅ Type checking passes
- ✅ Build succeeds
- ✅ All features work as before
- ✅ No console errors
- ✅ Performance improvements measurable in DevTools

## Notes

- **lodash dependency**: If lodash is not installed, use `throttle-debounce` package or implement custom throttle
- **Testing**: These are performance optimizations with no behavior changes - manual testing is primary validation
- **Monitoring**: Consider adding performance metrics tracking in future work
