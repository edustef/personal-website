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
