import { Injectable } from '@angular/core';

/** Topic groups shown as filter pills on /videos (shop-style). */
export type VideoCategory = 'brain' | 'hormones' | 'weight' | 'wellness' | 'functional' | 'about';

/** Catalog entry for one YouTube video of Dr. Adonis. */
export interface VideoCatalogItem {
  /** YouTube video ID. */
  id: string;
  /** i18n key (videos.list.*) holding the translated title. */
  titleKey: string;
  /** Topic group — drives the category filter pills on /videos. */
  category: VideoCategory;
  /** SEO-friendly URL segment — /videos/<slug> deep-links to this video. */
  slug: string;
  /** Spoken language of the video itself ('en' when omitted). */
  lang?: 'en' | 'es';
}

/**
 * Video catalog — single source of truth shared by the videos page
 * (/videos, /videos/<slug>) and the WhatsApp button (personalized message
 * on video detail pages).
 */
export const VIDEOS: VideoCatalogItem[] = [
  // ── Featured: book preview ──
  { id: 'SyF9dvOCCKI', titleKey: 'videos.list.v58', category: 'about', slug: 'book-modern-medicine-for-modern-times' },
  // ── From old WordPress gallery (Page 1) ──
  { id: 'F-jWDkQGMRg', titleKey: 'videos.list.v11', category: 'functional', slug: 'fibromyalgia-chronic-fatigue-adrenal-exhaustion' },
  { id: 'ri-sLzyiJjU', titleKey: 'videos.list.v12', category: 'functional', slug: 'lab-tests-in-functional-medicine' },
  { id: 'M32eBbD-axE', titleKey: 'videos.list.v13', category: 'brain', slug: 'hormone-replacement-menopause-alzheimers-risk' },
  { id: 'kAeswsB3bkk', titleKey: 'videos.list.v14', category: 'brain', slug: 'trophic-theory-of-alzheimers' },
  { id: 'C5TrmOI9TMY', titleKey: 'videos.list.v15', category: 'wellness', slug: 'dangers-of-too-low-cholesterol' },
  { id: 'NQbmfUu8UHc', titleKey: 'videos.list.v16', category: 'weight', slug: 'weight-rebound-after-diets-hormones' },
  { id: 'r5dT3iNlqXU', titleKey: 'videos.list.v17', category: 'brain', slug: 'neuroplasticity-and-neurogenesis' },
  { id: 'iyK-EPbfBlU', titleKey: 'videos.list.v18', category: 'hormones', slug: 'the-5-hormones-in-menopause' },
  { id: 'GKZR_XiSIbQ', titleKey: 'videos.list.v19', category: 'weight', slug: 'semaglutide-for-weight-loss' },
  { id: 'QD-m7tjkLSs', titleKey: 'videos.list.v20', category: 'hormones', slug: 'when-does-menopause-start' },
  { id: '8ROj00ttX3w', titleKey: 'videos.list.v21', category: 'functional', slug: 'sibo-small-intestinal-bacterial-overgrowth' },
  { id: 'RTKw2uPrk3s', titleKey: 'videos.list.v22', category: 'functional', slug: 'the-asia-syndrome' },
  { id: 'i2-KROsfOqM', titleKey: 'videos.list.v23', category: 'brain', slug: 'alzheimers-prevention-toxins' },
  { id: 'GcCt2jpYZpQ', titleKey: 'videos.list.v24', category: 'weight', slug: 'neat-calories-burned-without-exercise' },
  { id: 'wTn0WuYyN1o', titleKey: 'videos.list.v25', category: 'hormones', slug: 'thyroid-health' },
  // ── Spanish-only versions from YouTube channel ──
  { id: 'brnZdPm7mk8', titleKey: 'videos.list.v26', category: 'functional', slug: 'fibromialgia-fatiga-cronica', lang: 'es' },
  { id: 'cWrF75jkQhA', titleKey: 'videos.list.v27', category: 'functional', slug: 'examenes-de-laboratorio-medicina-funcional', lang: 'es' },
  { id: 'E-qqKxVesoc', titleKey: 'videos.list.v28', category: 'functional', slug: 'sibo-sobrecrecimiento-bacteriano-intestinal', lang: 'es' },
  { id: 'QbQFOirN93I', titleKey: 'videos.list.v29', category: 'brain', slug: 'terapia-hormonal-menopausia-riesgo-alzheimer', lang: 'es' },
  { id: 'WisYn539OSk', titleKey: 'videos.list.v30', category: 'brain', slug: 'teoria-trofica-del-alzheimer', lang: 'es' },
  { id: 'cgGzztfNPKw', titleKey: 'videos.list.v31', category: 'wellness', slug: 'peligros-del-colesterol-muy-bajo', lang: 'es' },
  { id: 'K0YRurRVaEk', titleKey: 'videos.list.v32', category: 'weight', slug: 'rebote-despues-de-las-dietas', lang: 'es' },
  { id: 'XMFAZB0dc20', titleKey: 'videos.list.v33', category: 'brain', slug: 'neurogenesis-y-neuroplasticidad', lang: 'es' },
  { id: 'hFwbHwvHoqU', titleKey: 'videos.list.v34', category: 'hormones', slug: 'las-5-hormonas-en-la-menopausia', lang: 'es' },
  { id: 'L5VVQJ0lncM', titleKey: 'videos.list.v35', category: 'weight', slug: 'bajar-de-peso-con-semaglutida', lang: 'es' },
  { id: 'v8pqsvpFkZI', titleKey: 'videos.list.v36', category: 'hormones', slug: 'cuando-comienza-la-menopausia', lang: 'es' },
  { id: 'rcaDR0VmaHY', titleKey: 'videos.list.v37', category: 'functional', slug: 'el-sindrome-asia', lang: 'es' },
  { id: 'yapm1IN6ObI', titleKey: 'videos.list.v38', category: 'brain', slug: 'prevencion-del-alzheimer-toxinas', lang: 'es' },
  { id: 'HROxqwf09rU', titleKey: 'videos.list.v39', category: 'weight', slug: 'neat-quemar-calorias-sin-ejercicio', lang: 'es' },
  { id: 'jaWlrZQ3Jyw', titleKey: 'videos.list.v40', category: 'hormones', slug: 'salud-de-la-tiroides', lang: 'es' },
  // ── From old WordPress gallery (Pages 2 & 3) ──
  { id: 'CpcAM1wrkPQ', titleKey: 'videos.list.v41', category: 'brain', slug: 'genetic-testing-alzheimers-prevention' },
  { id: 'wB3GeOd6S6E', titleKey: 'videos.list.v42', category: 'brain', slug: 'covid-increases-dementia-risk' },
  { id: 'zTAlspcuWkE', titleKey: 'videos.list.v43', category: 'wellness', slug: 'vitamin-d' },
  { id: 'Kjke1NwQdXU', titleKey: 'videos.list.v44', category: 'brain', slug: 'neuroendocrine-theory-of-aging' },
  { id: 'hWtgtv8O3NM', titleKey: 'videos.list.v45', category: 'wellness', slug: 'glutathione' },
  { id: 'NJ2wFogrjqg', titleKey: 'videos.list.v46', category: 'wellness', slug: 'magnesium-deficiency' },
  { id: '14SZvW-OrGw', titleKey: 'videos.list.v47', category: 'functional', slug: 'depression-and-autoimmunity' },
  { id: 'POOENh8EfxQ', titleKey: 'videos.list.v48', category: 'functional', slug: 'mental-illness-metabolic-causes' },
  { id: 'BOiX3WyyR6E', titleKey: 'videos.list.v49', category: 'brain', slug: 'alzheimers-and-insulin-levels' },
  { id: 'Rd0Xm7NM3ho', titleKey: 'videos.list.v50', category: 'functional', slug: 'post-covid-syndrome' },
  { id: 'C9n90j9Y98U', titleKey: 'videos.list.v51', category: 'about', slug: 'the-heart-pill-launch' },
  { id: 'GvSc1QB_0Ts', titleKey: 'videos.list.v52', category: 'about', slug: 'anti-aging-regenerative-medicine-chapter' },
  { id: 'q_tkF0eeOeA', titleKey: 'videos.list.v53', category: 'brain', slug: 'tms-transcranial-magnetic-stimulation' },
  { id: '79Rx5UkoF40', titleKey: 'videos.list.v54', category: 'brain', slug: 'the-brain-protocol' },
  { id: 'R5GW_x2qDck', titleKey: 'videos.list.v55', category: 'brain', slug: '8-pillars-memory-preservation' },
  { id: 'xOPKQ6YRpyk', titleKey: 'videos.list.v56', category: 'functional', slug: '8-pillars-stem-cells-functional-medicine' },
  { id: 'MYbdQgPCEYg', titleKey: 'videos.list.v57', category: 'functional', slug: '9-pillars-of-fibromyalgia' },
  { id: 'lWorK6csgvI', titleKey: 'videos.list.v59', category: 'wellness', slug: 'antioxidants' },
  { id: '3fbZ5Rqar3I', titleKey: 'videos.list.v60', category: 'wellness', slug: 'hair-loss-in-women' },
  { id: 'hysrzfqncCA', titleKey: 'videos.list.v61', category: 'wellness', slug: 'skin-hyperpigmentation-in-women' },
  { id: 'aM-fAwEvomw', titleKey: 'videos.list.v62', category: 'functional', slug: 'what-is-functional-medicine' },
  { id: 'gfV0Ye73jS0', titleKey: 'videos.list.v63', category: 'about', slug: 'new-office-welcome' }
];

@Injectable({ providedIn: 'root' })
export class VideoService {
  getVideos(): VideoCatalogItem[] {
    return VIDEOS;
  }

  getBySlug(slug: string): VideoCatalogItem | undefined {
    return VIDEOS.find(v => v.slug === slug);
  }
}
