# Web app (Angular 20)

Angular 20 frontend for the DR website — bilingual (EN/ES), SEO-first.

📖 **Full project docs** — architecture, stack, performance notes, SEO setup, deployment and engineering notes — live in the root [`README.md`](../README.md).

## Quick commands (run from this directory)

```bash
npm install            # install deps
npm start              # dev server → http://localhost:4200
npm run dev:ssr        # dev server with SSR
npm run build          # production browser bundle
npm run build:ssr      # production browser + SSR server bundle
npm run serve:ssr      # serve the built SSR bundle → http://localhost:4000
npm run prerender      # prerender the routes listed in angular.json
npm test               # unit tests
```

For the Azure Functions backend, see [`../api/`](../api/).

## UI standards

- **Standalone pages:** pages that do not use `PublicLayoutComponent` (`make-appointment`, `cardecal`, `vitamins-prescription`) must include the developer footer (`.developer-footer`) at the very bottom of the template. Its CSS is global in `styles.scss`.
- **Styling:** standalone pages follow the main site's clean styling (`#f1f6f1` background, white cards, `#005eb8` primary buttons). Avoid heavy dark themes or gradients unless specifically requested.

By Kevin Icabalzeta
