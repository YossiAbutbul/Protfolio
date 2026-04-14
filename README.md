# Yossi Abutbul — portfolio

Personal portfolio site. Next.js 15 (App Router, TS) + React 19, static-exported to GitHub Pages.

Live: `https://YossiAbutbul.github.io/Protfolio/`

## Stack

- **Next.js 15** — App Router, `output: "export"` for static GH Pages hosting
- **React 19** + TypeScript
- **@react-three/fiber 9** + **three.js** — signature cursor + ink-reveal shaders
- **Lenis** + **GSAP ScrollTrigger** — smooth scroll, scroll-driven effects
- **Variable fonts** — Fraunces (serif, morphs on pointer), Inter, JetBrains Mono — served via `next/font/google`
- **MDX** (via `@next/mdx`) — per-project long-form writeups in `content/projects/<slug>.mdx`
- Hand-rolled CSS modules + `tokens.css` custom properties (no Tailwind)

## Creative direction

Dark editorial / ink-on-black with a single **cadmium red `#E23614`** accent. Three signature effects, all live:

1. **Live variable-font morph** on the hero — `wght` / `opsz` / `SOFT` / `WONK` axes driven by pointer position and velocity.
2. **Scroll-scrubbed ink-bleed reveals** on project images — WebGL fragment shader samples the image + an fBm noise mask, threshold driven by a ScrollTrigger 0..1 progress (`src/components/fx/InkRevealScene.tsx`). Canvases mount lazily via IntersectionObserver; CSS blur+grain covers LCP + reduced-motion.
3. **Liquid displacement cursor** — fullscreen R3F canvas with a trail of Gaussian splats summed in the fragment shader, `mix-blend-mode: screen` (`src/components/fx/LiquidCursorScene.tsx`). Desktop-only; respects `prefers-reduced-motion` and touch-input fallbacks.

Hybrid CS + hardware touches:
- **Silkscreen-label tag pills** (`[ SW ] [ HW ] [ EMB ]`) echoing PCB reference designators
- **Fiducial corner marks** (⊕) on hero + contact sections
- **DevTools boot-log** easter egg — open the console on any page

## Structure

```
content/             # Real content source
├── projects.ts      # typed Project[] registry (metadata only)
└── projects/*.mdx   # per-project writeups

public/              # Static assets, served as-is
├── projects/<slug>/hero.svg
├── cv.pdf           # (drop in — see below)
└── .nojekyll        # needed so GH Pages serves _next/

src/
├── app/             # Next App Router
├── components/
│   ├── layout/      # Nav, SmoothScroll, SkipToContent
│   ├── hero/        # Hero + MorphingTitle
│   ├── about/       # About + quick-facts rail
│   ├── projects/    # ProjectsGrid, ProjectCard, TagPill
│   ├── skills/      # .text / .data columns
│   ├── experience/  # timeline
│   ├── contact/     # big type + link rows
│   ├── fx/          # BootLog, InkReveal, LiquidCursor, shader scenes
│   └── ui/          # Fiducial, SectionLabel
├── hooks/           # useFontAxes
├── lib/             # env / basePath helper
├── styles/          # tokens.css
└── types/
```

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export → out/
npm run typecheck
npm run lint
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages via the official `actions/deploy-pages@v4` pipeline.

**One-time setup** in the repo settings:
- Settings → Pages → Source = **GitHub Actions**

`next.config.ts` sets `basePath` and `assetPrefix` to `/Protfolio` in production so all assets resolve under the repo-name subpath.

### Drop your CV

Copy the PDF into `public/cv.pdf` (the Contact section links to `/cv.pdf`).

## Accessibility + motion

- Skip-to-content link, semantic landmarks, visible focus rings, `aria-label`s on nav + filter tablist
- `prefers-reduced-motion` globally neutralizes transitions and freezes the variable-font morph at a neutral preset
- Touch devices skip the desktop-only cursor effect (currently shelved anyway)

## Known next steps

- Replace placeholder SVG project hero images with real screenshots once available.
- Add `OPlanner` GitHub link when the repo is made public (currently presented as a case study).
- Optional: tune shader parameters once the site is on production hardware (smear radius, trail length, reveal bias).
