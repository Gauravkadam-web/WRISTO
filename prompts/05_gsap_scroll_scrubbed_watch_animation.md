# Prompt 05: GSAP Scroll-Scrubbed Hero Watch Frame Animation

**Target Project:** WRISTO Ultra-Luxury Watch Marketplace  
**Domain:** GSAP 3 + ScrollTrigger + High-DPI HTML Canvas Rendering  
**Status:** Implemented, Tested, & Documented  

---

## 📜 Master Implementation Prompt

```markdown
MASTER IMPLEMENTATION PROMPT
WRISTO — GSAP SCROLL-SCRUBBED HERO WATCH FRAME ANIMATION

You are working on the existing WRISTO watch ecommerce website.

A 240-frame watch animation image sequence exists under docs/wristo_scroll_frames_30fps/ (frame_0001.jpg through frame_0240.jpg).
- 240 frames
- 1280x720 resolution (16:9)
- 30 FPS target animation

The goal is to replace the static watch image in the existing WRISTO Hero Section with a premium scroll-controlled animation where the user sees the watch hands move as they scroll.

### Key Rules & Requirements:
1. Use GSAP + GSAP ScrollTrigger for the scroll-driven animation. Map scroll progress 0 → 1 to frame index 0 → 239.
2. Use ONE HTML Canvas element. Do NOT render 240 DOM image elements.
3. Preload frame_0001.jpg first for instant zero-flash initial render, then progressively load remaining frames.
4. Use GSAP ScrollTrigger's scrub functionality (`scrub: 0.6`) with `ease: "none"`.
5. Maintain 16:9 aspect ratio without stretching the watch.
6. Support `window.devicePixelRatio` capped at 2 for Retina/4K sharpness.
7. Respect `prefers-reduced-motion`: Render frame 0001 statically without scroll scrubbing when enabled.
8. GSAP Context Cleanup: Use `gsap.context()` for clean teardown on unmount with zero memory leaks.
9. Keep existing WRISTO design, typography, buttons, colors, and layout intact.
```
