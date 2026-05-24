# dradonis-SPA

Angular 20 SSR frontend for the Dr. Adonis website.

📖 **Full project docs** — architecture, stack, performance notes, SEO setup, deployment, and contributor checklist — live in the root [`README.md`](../README.md).

## Quick commands (run from this directory)

```bash
npm install            # install deps
npm start              # dev server → http://localhost:4200
npm run dev:ssr        # dev server with SSR
npm run build          # production browser bundle
npm run build:ssr      # production browser + SSR server bundle
npm run serve:ssr      # serve the built SSR bundle → http://localhost:4000
npm run prerender      # prerender / and /landing to static HTML
npm test               # unit tests
```

For the Azure Functions backend, see [`../api/`](../api/).
