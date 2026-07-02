# AIRigCheck

A toolkit for AI engineers to plan hardware and estimate costs for running LLMs — locally or in the cloud. Calculate VRAM requirements, find bottlenecks, plan GPU upgrades, and compare cloud API pricing across providers.

Live app: [airigcheck.com](https://airigcheck.com)

> This is a sanitized portfolio mirror of the private production codebase — see [PORTFOLIO.md](PORTFOLIO.md) for what's omitted.

## Features

- **Hardware Analyzer** — check GPU/model compatibility, find bottlenecks, plan upgrade paths, estimate inference speed
- **Rig Configurator** — build a multi-GPU workstation, check PCIe bandwidth, estimate power cost, share configs
- **Cloud Pricing** — compare cloud LLM API pricing, budget calculator, batch vs. realtime cost analysis
- **Guides** — technical write-ups on VRAM calculation, local vs. cloud cost tradeoffs, and GPU buying advice
- **Forums** — community Q&A and discussion, no account required

## Tech stack

**Frontend**
- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite 8](https://vite.dev) — build tooling
- [Tailwind CSS 4](https://tailwindcss.com) — styling
- [React Router](https://reactrouter.com) — routing
- [Zustand](https://zustand-demo.pmnd.rs) — client state
- [TanStack Query](https://tanstack.com/query) — server state / data fetching
- [Framer Motion](https://www.framer.com/motion/) — animation
- [Recharts](https://recharts.org) — charts
- [react-helmet-async](https://github.com/staylor/react-helmet-async) — per-page SEO metadata

**Backend & infra**
- [Supabase](https://supabase.com) — Postgres database with row-level security, used directly from the client
- [Cloudflare Workers](https://workers.cloudflare.com) — API layer (TypeScript, [Zod](https://zod.dev) for validation)
- [Cloudflare Pages](https://pages.cloudflare.com) — static hosting/deployment

**Tooling**
- [oxlint](https://oxc.rs) — linting
- [Playwright](https://playwright.dev) — screenshot generation for this README/portfolio

## Development

```bash
cd frontend
npm install
npm run dev
```

```bash
npm run build    # type-check + production build
npm run lint      # oxlint
npm run preview   # preview the production build
```
