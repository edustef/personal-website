# Services Section Interactivity Design

## Overview

Add animated shapes, effects, and scroll-triggered animations to the services section, with special focus on mobile carousel interactivity.

## Visual Layers

### Layer 1: Ambient Blobs (deepest)

Soft, morphing gradient blobs positioned behind all cards.

- **Count**: 2-3 blobs, asymmetrically placed (top-left, bottom-right, optional center)
- **Size**: 200-400px diameter, responsive scaling
- **Style**: CSS `blur(40px)` filter for soft organic edges
- **Colors**: `linear-gradient(135deg, var(--navy-400), var(--navy-200))` at 20% opacity
- **Dark mode**: 25% opacity for better contrast

### Layer 2: Organic Tendrils (middle)

SVG paths that weave through the section with self-drawing animation.

- **Stroke**: 1.5-2px, `var(--navy-300)` at 40% opacity
- **Style**: `stroke-linecap: round` for organic feel
- **Count**: 2-3 main curved paths across section
- **Mobile**: Paths curve through carousel viewport, connecting card centers

### Layer 3: Icon-Derived Shapes (per-card)

Small geometric echoes of each service icon floating near their cards.

- **Size**: 8-16px each
- **Fill**: `var(--navy-400)` at 30% opacity
- **Position**: Offset from main icon (top-right, bottom-left corners)
- **Mapping**:
  - `layers` → stacked rectangles
  - `zap` → angular fragments
  - `rocket` → triangular thrust shapes
  - `palette` → circular dots
  - `headphones` → curved arcs
  - `globe` → concentric rings

## Animation Behavior

### Intersection Observer

- Single observer on section container
- Threshold: `0.7` (70% visible triggers animation)
- Fires once, then transitions to ambient state

### Orchestrated Reveal Sequence

```
0ms     → Blobs fade in (opacity 0→1, scale 0.8→1) over 800ms
200ms   → First tendril begins drawing (1200ms duration)
400ms   → Second tendril begins drawing
600ms   → Icon shapes emerge per card (staggered 100ms each)
1000ms  → Third tendril completes
1200ms  → Transition to ambient idle state
```

### Ambient Idle State

- **Blobs**: Slow scale oscillation (1.0→1.05→1.0) over 8-12s, slight translate drift
- **Tendrils**: Gentle SVG path morphing, control points shift ±5px over 6s
- **Icon shapes**: Float in small circles/figure-8 patterns, 4-6s loops, 20-30px orbit radius

### Mobile Carousel Trail Effect

Using Embla's scroll progress API:

- Active card's connected tendril segment glows brighter
- Trail paths elastically stretch/compress based on drag velocity
- On snap to new card, subtle pulse travels along connecting tendril

## Technical Implementation

### Component Structure

```
ServicesSection (server - existing)
└── ServicesSectionClient (client - new)
    ├── BlobsLayer (absolute, pointer-events-none)
    │   └── AnimatedBlob components (2-3)
    ├── TendrilsLayer (SVG, absolute)
    │   └── AnimatedTendril paths
    ├── Desktop Grid
    │   └── ServiceCard + FloatingIconShapes
    └── Mobile Carousel
        └── ServiceCard + FloatingIconShapes + trail tendrils
```

### Key Dependencies (existing in project)

- `framer-motion` - orchestration, blob/shape animations
- `embla-carousel-react` - scroll progress for trail effect
- Native `IntersectionObserver` - scroll trigger

### Performance Optimizations

- `will-change: transform` on animated elements
- CSS animations for blobs (GPU-accelerated)
- SVG `pathLength="1"` for efficient dash animation
- Mobile: reduce to 2 blobs, simpler tendril paths

## Files to Create/Modify

### New Files

- `components/sections/services-section-client.tsx` - main client component
- `components/ui/animated-blob.tsx` - reusable blob component
- `components/ui/animated-tendril.tsx` - SVG tendril with draw animation
- `components/ui/floating-icon-shapes.tsx` - icon-derived decorative shapes

### Modified Files

- `components/sections/services-section.tsx` - wrap content with client component

## Implementation Phases

1. Create `ServicesSectionClient` wrapper with intersection observer
2. Implement `AnimatedBlob` with idle animation
3. Implement `AnimatedTendril` with draw + morph animations
4. Implement `FloatingIconShapes` with per-icon shape mapping
5. Wire up orchestrated reveal sequence
6. Implement mobile carousel trail effect with Embla scroll progress
7. Polish timing, colors, and responsiveness
