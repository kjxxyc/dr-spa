# Dr. Adonis — Functional & Regenerative Medicine

Customer-facing website for **Dr. Adonis Maiquez, MD**, a functional and regenerative medicine practice in Miami, FL. Built as an Angular SSR application with bilingual (English / Spanish) content, aggressive performance tuning for SEO, and a serverless payment backend on Azure.

**Current deployment:** [my.dradonis.com](https://my.dradonis.com) (production; migrating to `dradonis.com`)

> ⚠️ **Compliance positioning**: This site is **not** an online pharmacy or e-commerce store. Dr. Adonis is a licensed physician who issues prescriptions after a medical evaluation. Medications are picked up at the clinic or delivered locally in South Florida. Keep all copy, meta tags, and structured data aligned with "physician-prescribed", "medical evaluation", "Miami / Florida", "in-clinic pickup / local delivery", and "telemedicine".

---

## 🎯 Project goals

1. **Rank #1 organically on Google** for local Miami / South Florida functional medicine searches — no paid ads. Drives every architectural decision toward `100/100` PageSpeed and rich SEO signals.
2. **Convert tadalafil-cialis / vitamins / supplements** funnels via tracked channels (Meta + TikTok pixels) without polluting the rest of the site with tracker overhead.
3. **Bilingual** (en / es) experience from a single URL, with hreflang and per-route SEO that Google can crawl.

---

## ✨ Pages

| Path | Component | Purpose |
| --- | --- | --- |
| `/` | `landing` | Homepage — hero, services marquee, Tadalafil/Vitamins promo cards, book section, deferred Google Maps |
| `/landing/services` | `services` | 18 clinical services with expandable details |
| `/landing/meet-doctor` | `meet-doctor` | Bio / credentials (E-A-T signal) |
| `/landing/videos` | `videos` | YouTube embeds (lazy-loaded) + Google Reviews |
| `/landing/shop` | `shop` | 10 Fullscript supplement product cards (oEmbed, lazy via IntersectionObserver) |
| `/landing/tools/bmi-calculator` | `bmi-calculator` | Free BMI tool with medical context |
| `/men-wellness` | `men-wellness-contact` | ED consultation entry — bilingual landing for the **tadalafil-cialis campaign** |
| `/men-wellness/evaluation` | `tadalafil-evaluation` | Multi-step medical evaluation + PayPal/Clover payment |
| `/vitamins-prescription` | `vitamins-prescription` | Personalized vitamin protocol intake form |

Legacy `/landing/men-wellness*` and `/landing/vitamins-prescription` paths **301-redirect** to the canonical versions above (configured both server-side in `staticwebapp.config.json` and client-side in `authentication.routes.ts`).

---

## 🚀 Tech stack

### Frontend (`dradonis-SPA/`)
- **Angular 20** with SSR (`@angular/ssr`) + Express server (`src/server.ts`)
- **Angular Material 20** (lazy-loaded modules per route)
- **ngx-translate** for i18n (`en`, `es`, `fr`, `de` JSON files in `src/assets/i18n/`)
- **SCSS** with self-hosted **Plus Jakarta Sans** (variable font, latin + latin-ext) and **Material Icons** (43-icon subset, 3.4 KB)
- **Beasties** for automatic critical CSS inlining at build time
- **`@emailjs/browser`** for client-side email (newsletter, vitamin intake)

### Backend (`api/`)
- **Azure Functions** (Node.js v4 programming model)
- `clover-create-checkout/` — payment session creation for the tadalafil evaluation flow

### Hosting
- **Azure Static Web Apps** (with prerendering for `/` and `/landing` + SSR for everything else)
- `staticwebapp.config.json` controls routing, cache headers (`immutable` on hashed assets), 301 redirects, and global security headers
- Azure SWA's edge handles Brotli/gzip; `compression` middleware in Express is defense-in-depth for non-SWA hosts

### Analytics & widgets
- **Meta Pixel** (Facebook) — loaded on first user interaction (scroll/click/touch/keydown) so Lighthouse never triggers it; route-scoped (excluded from `/men-wellness` and `/vitamins-prescription` where component-level pixels take over)
- **TikTok Pixel** — only loaded inside `men-wellness-contact.component` for the tadalafil-cialis campaign (not global)
- **Fullscript oEmbed** — 10 product cards on `/shop`, injected via `IntersectionObserver` when each card nears the viewport
- **Google Maps embed** on the homepage testimonials — wrapped in Angular 20 `@defer (on viewport; prefetch on idle)` so its ~350 KiB of JS never touches the critical path
- **WhatsApp floating button** — load-bearing conversion path (`https://api.whatsapp.com/send/?phone=13053355424...`). **Must not break** under any refactor; hidden on `/men-wellness*` and `/vitamins-prescription*` routes via `whatsapp-btn.component.ts → HIDDEN_ROUTES`

---

## 📂 Project structure

```
dradonis/
├── api/                                # Azure Functions (Node.js)
│   └── clover-create-checkout/         # Clover payment session endpoint
│
├── dradonis-SPA/                       # Angular 20 SSR app
│   ├── .browserslistrc                 # Modern-browser target (drops legacy polyfills)
│   ├── angular.json                    # sourceMap: false in production
│   ├── src/
│   │   ├── index.html                  # Shell — preloads, deferred Meta Pixel
│   │   ├── server.ts                   # Express SSR + Brotli compression + cache headers
│   │   ├── sitemap.xml                 # 9 URLs with hreflang
│   │   ├── robots.txt
│   │   ├── staticwebapp.config.json    # Azure SWA routing + 301 redirects + cache headers
│   │   ├── styles.scss                 # Global @font-face + size-adjust fallback
│   │   ├── assets/
│   │   │   ├── fonts/
│   │   │   │   ├── plus-jakarta-sans/  # Self-hosted variable font (latin + latin-ext)
│   │   │   │   └── material-icons/     # 43-icon subset (3.4 KB)
│   │   │   ├── i18n/                   # en/es/fr/de.json
│   │   │   ├── images/                 # WebP-first, no oversized PNG/JPG
│   │   │   └── icons/                  # Custom SVGs (flags, socials)
│   │   └── app/
│   │       ├── app.config.ts           # Hydration with event replay, no zone-coalescing issues
│   │       ├── app.routes.ts           # Top-level routing
│   │       ├── pages/authentication/
│   │       │   ├── authentication.routes.ts        # Nested routes + legacy 301 redirects
│   │       │   ├── public-layout/                  # Shared header for /landing/*
│   │       │   ├── landing/
│   │       │   ├── services/
│   │       │   ├── meet-doctor/
│   │       │   ├── videos/
│   │       │   ├── shop/
│   │       │   ├── tools/bmi-calculator/
│   │       │   ├── men-wellness-contact/
│   │       │   ├── tadalafil-evaluation/
│   │       │   ├── vitamins-prescription/
│   │       │   └── cardecal/                       # First-visit language selector
│   │       └── shared/
│   │           ├── seo/seo.service.ts              # Per-route title / canonical / OG / JSON-LD
│   │           ├── whatsapp-btn/                   # Floating WhatsApp button (load-bearing)
│   │           ├── appointment-dialog/
│   │           └── language-selector-dialog/
│   └── package.json
│
├── .github/                            # CI/CD workflows
├── MailChimp.html                      # Standalone email template
└── README.md
```

---

## ⚙️ Local development

### Prerequisites
- **Node.js 18+** and **npm 9+**
- Optional: **Azure Functions Core Tools** if you want to run the `api/` locally

### Setup

```bash
git clone <repo-url>
cd dradonis/dradonis-SPA
npm install
```

### Run

```bash
# Dev server (hot reload, no SSR — fastest iteration)
npm start
# → http://localhost:4200

# Dev server with SSR (closer to production behavior)
npm run dev:ssr
# → http://localhost:4200 with server-side rendering

# Production build (browser bundle only)
npm run build

# Production build + SSR server bundle
npm run build:ssr
# Then:
node dist/Spike/server/main.js
# → http://localhost:4000

# Prerender / for /landing (static HTML)
npm run prerender

# Unit tests
npm test
```

### Running the API locally

```bash
cd api
# Install Azure Functions Core Tools if not already: brew tap azure/functions && brew install azure-functions-core-tools@4
func start
# → http://localhost:7071/api/clover-create-checkout
```

Set up `api/local.settings.json` (copy from `local.settings.json.example`) with your Clover sandbox credentials.

---

## 🎨 Performance optimizations

This site is tuned aggressively for `100/100` PageSpeed. Anything that touches the critical path needs to preserve these wins:

| Optimization | Impact | Where |
| --- | --- | --- |
| Self-hosted Plus Jakarta Sans (variable font) | Eliminates `fonts.gstatic.com` round-trip (~1.3 s on slow 4G) | `styles.scss` `@font-face`, `index.html` preload |
| Self-hosted Material Icons subset (43 icons → 3.4 KB) | From 126 KB → 3.4 KB; zero external font request | `assets/fonts/material-icons/` |
| `font-display: optional` + `size-adjust` fallback | **CLS = 0** (was 0.213) | `styles.scss` |
| Brotli compression in Express + Azure SWA edge | ~68 % reduction on main bundle wire size | `server.ts` |
| Long-lived immutable cache for hashed assets | Repeat visits cost nothing | `staticwebapp.config.json` + `server.ts` |
| `loading="lazy"` on all below-fold iframes (YouTube, Maps) | Defers ~350 KiB of third-party JS | `videos`, `services`, `landing` |
| Angular 20 `@defer (on viewport)` for Google Maps testimonials | Removes Maps from critical path entirely | `landing.component.html` |
| `IntersectionObserver` lazy-load of Fullscript oEmbed scripts | 10 product scripts only load when in viewport | `shop.component.ts` |
| Meta Pixel deferred to first user interaction (`scroll`/`click`/`touchstart`) | Lighthouse never triggers it; real users do | `index.html` |
| TikTok Pixel scoped to `/men-wellness` only | Saves ~120 KiB on every other page | `men-wellness-contact.component.ts` |
| Source maps disabled in production | ~30-50 % bundle shrink | `angular.json` |
| Modern `.browserslistrc` (no IE11, no opera-mini) | Drops legacy polyfills | `.browserslistrc` |
| Critical CSS inlined via **Beasties** (built into Angular CLI) | First paint without waiting for full stylesheet | Automatic |
| Image cleanup: removed 17.4 MB of unused JPG/PNG | Smaller build, faster CDN sync | `assets/images/` |

---

## 🔍 SEO architecture

Every public route applies its own metadata via `SeoService` (`src/app/shared/seo/seo.service.ts`):

- **`<title>`** — keyword-focused, ≤ 60 chars
- **`<meta name="description">`** — ≤ 155 chars, hooks search intent
- **`<link rel="canonical" id="route-canonical">`** — per-route canonical URL
- **Open Graph + Twitter cards** — `og:title`, `og:description`, `og:url`, `og:image`, `og:type`, `og:locale`
- **`<html lang>`** — flips between `en` / `es` when the user toggles language
- **JSON-LD schema** — per-route structured data:
  - Homepage: `Physician` + `WebSite` + `FAQPage` + `Product` (Vagustim) + `Book`
  - `services`: `MedicalBusiness` with `availableService` list
  - `meet-doctor`: `Physician` with `sameAs` social profiles
  - `videos`: `ItemList` of `VideoObject` per YouTube embed
  - `shop`: `Store` + `OfferCatalog` of supplements
  - `bmi-calculator`: `WebApplication` (`HealthApplication`)
  - `men-wellness*`: `MedicalProcedure` (tadalafil)
  - `vitamins-prescription`: `MedicalProcedure`

### Sitemap & hreflang

`src/sitemap.xml` lists **9 URLs** with `xhtml:link rel="alternate" hreflang="en-US|es|x-default"` per URL. Because `ngx-translate` doesn't change URLs per language, all hreflang alternates point to the same URL (correct signal for "this URL serves both languages").

### Pre-submission validation

After deploying, validate with:

- **Google Search Console** — re-submit `sitemap.xml`
- **[Rich Results Test](https://search.google.com/test/rich-results)** — paste each URL
- **[Schema Validator](https://validator.schema.org)** — paste each URL
- **[PageSpeed Insights](https://pagespeed.web.dev/)** — measure mobile + desktop

---

## 🌐 Internationalization

- **Translation files**: `src/assets/i18n/en.json`, `es.json`, `fr.json`, `de.json` (primary languages: en + es)
- **Language selector**: opens on first visit via `cardecal.component` (writes `dradonis.cardecal.langSelected` to `localStorage`)
- **Per-component override**: `/men-wellness*` and `/vitamins-prescription` reopen the language selector to ensure correct language for medical/legal copy

When adding a new translation key:

1. Add it to `en.json` first (source of truth)
2. Add localized strings to `es.json` (and `fr.json` / `de.json` if relevant)
3. Reference with `{{ 'key.path' | translate }}`

---

## 🔒 Security & compliance

- **HTTPS enforced** via Azure SWA (automatic)
- **Security headers** (`X-Content-Type-Options: nosniff`) in `staticwebapp.config.json` `globalHeaders`
- **No e-commerce framing** — copy and JSON-LD positioned as `MedicalBusiness` / `Physician` issuing prescriptions, never "buy online" / "online pharmacy"
- **Patient data**: forms submit directly to EmailJS or Clover — no PHI is stored on Azure SWA
- **Pixel consent**: Meta and TikTok pixels respect OneTrust `data-ot-ignore` attributes on Fullscript scripts; users can be excluded from tracking on specific routes via the route-allowlist in `index.html`
- **WhatsApp link integrity** — `whatsapp-btn.component.ts` has a `FALLBACK_WHATSAPP_URL` constant so the button always works even if `TranslateService` hasn't loaded yet

---

## 📦 Deployment

This site is wired for **Azure Static Web Apps** with the Angular SSR adapter.

1. Push to the configured branch (see `.github/workflows/`)
2. Azure SWA's GitHub Action builds `dradonis-SPA/` and the `api/` Functions
3. Static assets serve from the edge CDN with Brotli + long-lived immutable cache
4. SSR routes (everything beyond `/` and `/landing` prerender) run on Azure Functions

When migrating from `my.dradonis.com` → `dradonis.com`:

1. Replace `my.dradonis.com` with `dradonis.com` in `sitemap.xml`
2. Update the `Sitemap:` line in `robots.txt`
3. Update `SITE_ORIGIN_FALLBACK` in `src/app/shared/seo/seo.service.ts`
4. Update `<link rel="canonical">` defaults if any are hardcoded
5. Re-submit the new sitemap in Google Search Console and request reindexing of the top URLs

---

## 🤝 Contributing / safe-change checklist

Before merging any change, confirm:

- [ ] **WhatsApp button** still renders on the homepage and links to `api.whatsapp.com/send/?phone=13053355424` — this is load-bearing for lead capture.
- [ ] **No new `window.X` access** outside `if (isPlatformBrowser(this.platformId))` — breaks SSR.
- [ ] **No new `<mat-icon>name</mat-icon>`** with a name that's not in the 43-icon subset, unless you regenerate `material-icons-subset.woff2`.
- [ ] **Per-route SEO** still applied — every route component calls `this.seo.apply({...})` in `ngOnInit` and `this.seo.reset()` in `ngOnDestroy`.
- [ ] **Sitemap** updated if you added a new public route.
- [ ] **PageSpeed** re-measured on `my.dradonis.com` after deploy — no regressions on LCP / CLS / TBT.

---

## 📞 Contact

- **Practice**: Dr. Adonis Maiquez, MD — (305) 204-7816
- **Clinic location**: Miami, FL (see Google Maps embed in homepage testimonials)
- **Issues**: open a GitHub issue on this repository
