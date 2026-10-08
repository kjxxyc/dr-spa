# DR — Bilingual Medical Practice Website (Angular 20)

Production website built for **DR**, a functional & regenerative medicine practice in the US. A single Angular 20 codebase serves the whole site in **English and Spanish**, with an **SEO-first architecture** (per-route metadata, 44 types of JSON-LD structured data, hreflang, a 184-URL sitemap, `llms.txt`), a **content system** for 87 articles and 60 videos, and a **serverless API** on Azure.

Built and maintained between February and October 2026 (180 commits) by [Kevin Icabalzeta](https://github.com/kjxxyc).

> **About this repository.** The client is referred to as "DR" throughout. The code is published for portfolio purposes; branding, copy, images and videos belong to the practice. GitHub Actions are disabled in this copy — production deploys from the practice's own repository.

---

## Highlights

| Area | What was built |
| --- | --- |
| **Architecture** | Angular 20 standalone components, every route lazy-loaded (`loadComponent`), Angular Material 20, SCSS. SSR tooling in place (`@angular/ssr`, Express server, prerender target). |
| **Internationalization** | `ngx-translate` with **3,812 keys per language** (EN/ES). Articles and videos are language-aware: each English article/video is paired with its Spanish counterpart and the site switches both together. First-visit language selector. |
| **SEO** | A `SeoService` applies title, meta description, canonical, hreflang, Open Graph and Twitter tags per route. **44 JSON-LD schema types** (`Physician`, `MedicalWebPage`, `MedicalCondition`, `MedicalTherapy`, `FAQPage`, `Product`/`Offer`, `VideoObject`, `BreadcrumbList`, `HowTo`…). `sitemap.xml` with 184 URLs and 60 video entries, `robots.txt`, `llms.txt`, **44 legacy 301 redirects** from the previous WordPress site, and a smart 404 page that suggests the closest pages from the broken URL. |
| **Content system** | 87 articles (41 EN / 46 ES) in a JSON store with meta title/description and FAQ schema; 60-video catalog with slug deep links (`/videos/<slug>`), EN/ES pairs and topic filters; 10-product supplement catalog with detail pages and `Product`/`Offer` schema; three health calculators (BMI, BMR/TDEE, water intake). |
| **Performance** | Self-hosted variable font and a **3.6 KB icon subset**, `font-display: optional` + `size-adjust` fallback to avoid layout shift, 26 lazy-loaded iframes/images, Angular `@defer` for the maps embed, Meta Pixel deferred until the first user interaction, intent-based `preconnect` for the booking form, immutable cache headers for hashed assets, build-version cache busting for runtime JSON, WebP image pipeline (`sharp`). |
| **Integrations** | GoHighLevel/LeadConnector booking form and chat launcher, Mailchimp newsletter, EmailJS intake form, YouTube (privacy-enhanced) embeds, Google Reviews carousel, Meta Pixel. |
| **Backend** | Azure Functions (Node) endpoint that creates Clover Hosted Checkout sessions server-side, so the merchant token never reaches the browser. |
| **Hosting & CI/CD** | Azure Static Web Apps deployed by GitHub Actions. `staticwebapp.config.json` owns routing, 301 redirects, cache control and global security headers. |
| **Compliance** | Medical-claims copy review against healthcare advertising standards, prescription and regulatory disclaimers, SMS opt-in (A2P 10DLC) consent on the appointment form. |

---

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Homepage: hero, services, reviews, book, deferred maps embed |
| `/services` | Clinical services overview |
| `/functional-medicine` | Hub page with six child pages: `gut-health`, `brain-health`, `autoimmune`, `hashimotos`, `thyroid`, `fibromyalgia` |
| `/hormone-replacement-therapy`, `/testosterone-replacement-therapy` | Hormone therapy service pages |
| `/erectile-dysfunction`, `/enclomiphene`, `/peptide-therapy`, `/medical-weight-loss` | Treatment pages with `MedicalCondition` / `MedicalTherapy` schema |
| `/telemedicine` | Remote consultation flow |
| `/meet-doctor` | Credentials page (E-E-A-T signal) |
| `/book` | The practice's published book |
| `/shop`, `/shop/:slug` | Supplement catalog and product detail pages |
| `/articles`, `/articles/:slug` | Bilingual article list and detail pages |
| `/videos`, `/videos/:slug` | Video gallery with deep links; one route matcher keeps the component instance alive between videos |
| `/tools/bmi-calculator`, `/tools/tmb-calculator`, `/tools/water-calculator` | Free health calculators (`WebApplication` schema) |
| `/contact`, `/makeanappointment` | Contact page and standalone appointment page for campaigns |
| `/vitamins-prescription` | Personalized vitamin protocol intake form |
| `/cardecal` | First-visit language selector |
| `/sitemap` | HTML sitemap |
| `**` | Smart 404 with page suggestions |

Spanish and legacy aliases (`/tiroides`, `/services/thyroid`, `/thyroid` → `/functional-medicine/thyroid`, etc.) redirect client-side in the router and server-side as 301s in `staticwebapp.config.json`.

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | Angular 20, Angular Material 20, RxJS, SCSS, TypeScript 5.8 |
| i18n | `@ngx-translate/core` with JSON dictionaries (`en`, `es`) |
| SSR / prerender | `@angular/ssr`, Express 5 with Brotli/gzip `compression`, Angular prerender builder |
| Content | JSON content store (`articles.json`), typed catalogs for products and videos |
| Backend | Azure Functions (Node 18+), Clover Hosted Checkout API |
| Hosting | Azure Static Web Apps (edge CDN, managed Functions) |
| CI/CD | GitHub Actions (`Azure/static-web-apps-deploy`) |
| Tooling | Angular CLI, `sharp` image optimization script, build-version script, Karma/Jasmine |

**Rendering note.** Production currently ships the browser build with hydration configured (`provideClientHydration(withEventReplay())`). The SSR server and the prerender target are wired in `angular.json`; moving every route to static prerender is the next planned step.

---

## Project structure

```
.
├── api/                                  # Azure Functions (Node)
│   ├── clover-create-checkout/           # Server-side Clover Hosted Checkout session
│   ├── host.json
│   └── local.settings.json.example       # Secrets template (real values live in Azure App Settings)
│
├── dradonis-SPA/                         # Angular 20 app
│   ├── angular.json                      # build / server / prerender targets
│   ├── scripts/
│   │   ├── generate-build-version.js     # Cache-busting version for runtime JSON
│   │   └── optimize-images.js            # WebP pipeline (sharp)
│   └── src/
│       ├── server.ts                     # Express SSR server (+ compression, cache headers)
│       ├── sitemap.xml                   # 184 URLs, hreflang, 60 video entries
│       ├── robots.txt · llms.txt
│       ├── staticwebapp.config.json      # Routing, 301s, cache control, security headers
│       ├── assets/
│       │   ├── data/articles.json        # 87 bilingual articles
│       │   ├── i18n/                     # en.json / es.json (3,812 keys each)
│       │   ├── fonts/                    # Self-hosted variable font + icon subset
│       │   └── images/                   # WebP-first assets
│       └── app/
│           ├── app.routes.ts             # Top-level routes
│           ├── core/services/            # articles, products, videos, booking prefetch, chat launcher
│           ├── pages/authentication/     # One folder per page (lazy-loaded)
│           │   └── authentication.routes.ts   # Nested routes + alias redirects + video matcher
│           └── shared/
│               ├── seo/seo.service.ts    # Per-route metadata + JSON-LD
│               ├── appointment-dialog/   # Booking form embed
│               ├── site-footer/ · language-selector-dialog/ · whatsapp-btn/
│               └── styles/
│
└── .github/workflows/                    # Azure Static Web Apps CI/CD (disabled in this copy)
```

---

## Local development

Requirements: Node.js 18+ and npm 9+. Optional: Azure Functions Core Tools for the API.

```bash
cd dradonis-SPA
npm install

npm start              # dev server → http://localhost:4200
npm run dev:ssr        # dev server with server-side rendering
npm run build          # production browser bundle
npm run build:ssr      # browser + SSR server bundle
npm run serve:ssr      # serve the SSR bundle → http://localhost:4000
npm run prerender      # prerender the routes listed in angular.json
npm test               # unit tests
```

API:

```bash
cd api
cp local.settings.json.example local.settings.json   # fill in sandbox credentials
func start                                           # → http://localhost:7071/api/clover-create-checkout
```

---

## Deployment

1. A push to the deployment branch triggers the Azure Static Web Apps GitHub Action.
2. The action builds the Angular app and the `api/` Functions and uploads both to the Static Web App.
3. Secrets (Clover merchant ID and API token) are configured as Azure Application Settings, never in the repository. See [`api/README.md`](api/README.md).

---

## Engineering notes

- **SSR-safe code.** Browser-only APIs are accessed behind `isPlatformBrowser` guards so the same components render on the server.
- **One source of truth per catalog.** Products, videos and articles live in typed services or JSON, and the sitemap, the detail pages and the JSON-LD are derived from them.
- **Per-route SEO contract.** Every page calls `seo.apply({...})` on init and `seo.reset()` on destroy; adding a public route means adding it to `sitemap.xml`.
- **Bilingual by key.** Every UI string is a translation key added to `en.json` first and mirrored in `es.json`.
- **Conversion paths are load-bearing.** The booking form and the chat launcher are covered by a change checklist so refactors cannot break lead capture.
- **Icon subset.** Only the icons used in the app are shipped; adding a new `<mat-icon>` means regenerating the subset.

---

## Author

**Kevin Icabalzeta** — architecture, build, SEO, performance, integrations, CI/CD and compliance work. Content and SEO copy contributions came from a marketing collaborator (see commit history).

GitHub: [@kjxxyc](https://github.com/kjxxyc)
