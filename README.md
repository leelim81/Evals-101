# Evals 101 — Evaluating LLMs

A teaching kit for briefing a (mixed, non‑specialist) team on **LLM evaluation**.
Theory lives in an **animated slide deck**; the **worked examples** live in an
interactive demo site. Everything is in a **Swiss modern** typographic style and
deploys for free to **GitHub Pages** from this one repo.

Topics: **LLM‑as‑a‑Judge**, judge **biases**, **Cohen's Kappa** (agreement beyond
chance, the kappa paradox), and **Singapore's AI Verify & Project Moonshot**.

## Structure

```
.
├── site/index.html          # Swiss landing page → links to /slides and /demo
├── slides/                  # Slidev deck (theory)  → built to slides/dist
├── demo/                    # Astro site (examples) → built to demo/dist
├── scripts/assemble-dist.mjs# merges builds into ./dist for Pages
├── exports/                 # PDF / PPTX hand‑outs (generated in CI, see below)
└── .github/workflows/deploy.yml
```

Published layout (base path is the repo name, `/Evals-101/`):

- `…/Evals-101/`        landing page
- `…/Evals-101/slides/` the deck
- `…/Evals-101/demo/`   the labs

## Develop

```bash
pnpm install

pnpm dev:slides   # Slidev dev server (the deck)
pnpm dev:demo     # Astro dev server (the labs)
```

## Build & export

```bash
pnpm build         # builds both + assembles ./dist (what Pages serves)
pnpm test          # unit tests for the Cohen's Kappa math
pnpm export:pdf    # exports the deck to exports/evals-101.pdf
pnpm export:pptx   # exports the deck to exports/evals-101.pptx (image-based)
```

> **Exports need a headless browser.** `export:pdf` / `export:pptx` use Slidev's
> Playwright exporter, so they require `pnpm --filter slides exec playwright
> install chromium` first. The CI workflow does this automatically and both
> attaches the files as a build artifact **and** publishes them at
> `…/Evals-101/exports/`. The `.pptx` renders each slide as an image (a Slidev
> limitation) — great for sharing, not for editing — so the **PDF** is the
> recommended hand‑out.

## Deploy

Pushing to `claude/ultra-effort-fiscw1` (or merging to the default branch) runs
`.github/workflows/deploy.yml`, which builds everything and publishes `./dist`
to GitHub Pages. You only need to enable Pages once in the repo settings
(**Settings → Pages → Source: GitHub Actions**).

## The Cohen's Kappa worked examples

| Preset | Confusion matrix | pₒ | pₑ | κ | Reading |
|---|---|---|---|---|---|
| Good judge | `[[45,10],[5,40]]` | 0.85 | 0.50 | **0.70** | Substantial |
| Kappa paradox | `[[85,5],[5,5]]` | 0.90 | 0.82 | **0.44** | Moderate (despite 90% agreement!) |

The maths is in `demo/src/lib/kappa.ts` and is unit‑tested.

## Sources for the AI Verify / Moonshot material

- AI Verify Foundation — <https://aiverifyfoundation.sg/>
- Project Moonshot — <https://github.com/aiverify-foundation/moonshot>
- Global AI Assurance Pilot (2025) — <https://assurance.aiverifyfoundation.sg/>
