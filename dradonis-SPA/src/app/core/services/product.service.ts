import { Injectable } from '@angular/core';

/** A video of Dr. Adonis related to a product (links to /videos/<slug>). */
export interface RelatedVideo {
  slug: string;
  youtubeId: string;
  /** Existing i18n key from videos.list.* — no new translations needed. */
  titleKey: string;
}

/** Internal site link (service, tool, telemedicine…) related to a product. */
export interface RelatedLink {
  route: string;
  /** Existing i18n key used as the visible label. */
  labelKey: string;
  icon: string;
}

export interface Product {
  /** Fullscript product ID (used in the oEmbed `data-fs` payload). */
  id: string;
  /** SEO-friendly URL segment — /shop/<slug> is the product detail page. */
  slug: string;
  /** Display name kept for accessibility / fallback while embed loads. */
  name: string;
  /** Real manufacturer brand (used in JSON-LD and the detail page). */
  brand: string;
  /** i18n key for the doctor's custom description. */
  descriptionKey: string;
  /** i18n sub-key under shop.details.* holding benefits/ingredients/whoFor. */
  detailKey: string;
  /** Category used by the filter pills. */
  category: 'general' | 'antiaging' | 'gut' | 'menopause';
  /** Price in USD — used exclusively in JSON-LD structured data for Google, not shown on the site. */
  price: string;
  /**
   * Absolute URL of the product photo on Fullscript's public asset CDN.
   * Required by Google Merchant listings — each Product in the JSON-LD must
   * point at its own image, not a shared logo.
   */
  image: string;
  /** Related article slugs per language (from assets/data/articles.json). */
  relatedArticles: { en: string[]; es: string[] };
  relatedVideos: RelatedVideo[];
  relatedLinks: RelatedLink[];
}

/**
 * Fullscript product catalog — single source of truth shared by the shop
 * grid and the per-product detail pages (/shop/<slug>).
 * IDs and categories must match the ones in `shop v9*.html` provided by the
 * client, since `store_slug: "dradonis"` is what attributes the commission
 * to Dr. Adonis.
 */
export const PRODUCTS: Product[] = [
  {
    id: '62134',
    slug: 'pectasol-modified-citrus-pectin',
    name: 'PectaSol®',
    brand: 'EcoNugenics',
    descriptionKey: 'shop.products.pectasol',
    detailKey: 'pectasol',
    category: 'general',
    price: '39.99',
    image: 'https://assets.fullscript.io/Product/EN0037/400_front.png',
    relatedArticles: {
      en: ['what-is-detoxification-and-toxin-exposure', 'do-you-have-mold-in-your-home-be-careful-it-could-be-making-you-sick-without-you-noticing'],
      es: ['tienes-moho-en-casa-cuidado-podria-estar-enfermandote-sin-que-lo-notes'],
    },
    relatedVideos: [
      { slug: 'alzheimers-prevention-toxins', youtubeId: 'i2-KROsfOqM', titleKey: 'videos.list.v23' },
      { slug: 'what-is-functional-medicine', youtubeId: 'aM-fAwEvomw', titleKey: 'videos.list.v62' },
    ],
    relatedLinks: [
      { route: '/services', labelKey: 'cardecal.services.functional.title', icon: 'medical_services' },
      { route: '/telemedicine', labelKey: 'cardecal.services.video.title', icon: 'videocam' },
    ],
  },
  {
    id: '72479',
    slug: 'mitochondrial-nrg',
    name: 'Mitochondrial NRG',
    brand: 'Designs for Health',
    descriptionKey: 'shop.products.mitochondrial',
    detailKey: 'mitochondrial',
    category: 'general',
    price: '29.99',
    image: 'https://assets.fullscript.io/Product/DF0263/400_front.png',
    relatedArticles: {
      en: ['what-is-mitochondrial-health', 'unlock-the-secret-to-fighting-fatigue-quality-sleep'],
      es: ['que-es-la-salud-mitocondrial', 'descubre-el-secreto-para-combatir-la-fatiga-sueno-de-calidad'],
    },
    relatedVideos: [
      { slug: 'neat-calories-burned-without-exercise', youtubeId: 'GcCt2jpYZpQ', titleKey: 'videos.list.v24' },
      { slug: 'antioxidants', youtubeId: 'lWorK6csgvI', titleKey: 'videos.list.v59' },
    ],
    relatedLinks: [
      { route: '/tools/tmb-calculator', labelKey: 'bmr.pageTitle', icon: 'calculate' },
      { route: '/services', labelKey: 'cardecal.services.functional.title', icon: 'medical_services' },
    ],
  },
  {
    id: '71334',
    slug: 'uric-acid-formula',
    name: 'Uric Acid Formula',
    brand: 'Pure Encapsulations',
    descriptionKey: 'shop.products.uricAcid',
    detailKey: 'uricAcid',
    category: 'general',
    price: '19.99',
    image: 'https://assets.fullscript.io/Product/PU0785/400_front.png',
    relatedArticles: {
      en: ['when-was-your-last-medical-checkup', 'are-you-drinking-enough-water-to-beat-fatigue'],
      es: ['cuando-fue-tu-ultimo-chequeo-medico', 'puedo-detectar-la-diabetes-a-tiempo-aun-sin-tener-sintomas-si-con-el-test-hba1c'],
    },
    relatedVideos: [
      { slug: 'lab-tests-in-functional-medicine', youtubeId: 'ri-sLzyiJjU', titleKey: 'videos.list.v12' },
      { slug: 'examenes-de-laboratorio-medicina-funcional', youtubeId: 'cWrF75jkQhA', titleKey: 'videos.list.v27' },
    ],
    relatedLinks: [
      // 'calculate' en vez de 'water_drop': el subset de Material Icons del
      // sitio (assets/fonts/material-icons) solo trae 43 glifos.
      { route: '/tools/water-calculator', labelKey: 'waterCalc.pageTitle', icon: 'calculate' },
      { route: '/services', labelKey: 'cardecal.services.functional.title', icon: 'medical_services' },
    ],
  },
  {
    id: '72491',
    slug: 'omegavail-hi-po-fish-oil',
    name: 'OmegAvail Hi-Po Fish Oil',
    brand: 'Designs for Health',
    descriptionKey: 'shop.products.omegavail',
    detailKey: 'omegavail',
    category: 'general',
    price: '19.99',
    image: 'https://assets.fullscript.io/Product/DF0253/400_front.png',
    relatedArticles: {
      en: ['embrace-healthy-fats-for-thyroid-health-and-hormone-balance', 'is-your-brain-inflamed-without-you-knowing-it'],
      es: ['grasas-saludables-para-la-salud-de-la-tiroides-y-el-equilibrio-hormonal', 'esta-tu-cerebro-inflamado-sin-que-lo-sepas'],
    },
    relatedVideos: [
      { slug: 'dangers-of-too-low-cholesterol', youtubeId: 'C5TrmOI9TMY', titleKey: 'videos.list.v15' },
      { slug: 'the-heart-pill-launch', youtubeId: 'C9n90j9Y98U', titleKey: 'videos.list.v51' },
    ],
    relatedLinks: [
      { route: '/tools/bmi-calculator', labelKey: 'bmi.pageTitle', icon: 'monitor_weight' },
      { route: '/services', labelKey: 'cardecal.services.functional.title', icon: 'medical_services' },
    ],
  },
  {
    id: '76696',
    slug: 'broccoli-seed-extract',
    name: 'Broccoli Seed Extract',
    brand: 'Thorne',
    descriptionKey: 'shop.products.broccoli',
    detailKey: 'broccoli',
    category: 'antiaging',
    price: '19.99',
    image: 'https://assets.fullscript.io/Product/TH0319/400_front.png',
    relatedArticles: {
      en: ['unlock-the-secret-to-glowing-skin-the-power-of-antioxidants', 'what-is-detoxification-and-toxin-exposure'],
      es: ['descubre-el-secreto-de-una-piel-radiante-el-poder-de-los-antioxidantes'],
    },
    relatedVideos: [
      { slug: 'antioxidants', youtubeId: 'lWorK6csgvI', titleKey: 'videos.list.v59' },
      { slug: 'skin-hyperpigmentation-in-women', youtubeId: 'hysrzfqncCA', titleKey: 'videos.list.v61' },
    ],
    relatedLinks: [
      { route: '/services', labelKey: 'cardecal.services.functional.title', icon: 'medical_services' },
    ],
  },
  {
    id: '72276',
    slug: 'complete-mineral-complex',
    name: 'Complete Mineral Complex',
    brand: 'Designs for Health',
    descriptionKey: 'shop.products.mineral',
    detailKey: 'mineral',
    category: 'general',
    price: '19.99',
    image: 'https://assets.fullscript.io/Product/DF0083/400_front.png',
    relatedArticles: {
      en: ['iodine-is-a-key-ingredient-to-thyroid-health', 'navigating-your-diet-for-thyroid-health-understanding-goitrogens'],
      es: ['descubre-el-secreto-de-la-salud-tiroidea-el-yodo', 'explorando-su-dieta-para-unas-tiroides-saludables-que-son-los-goitrogenos'],
    },
    relatedVideos: [
      { slug: 'magnesium-deficiency', youtubeId: 'NJ2wFogrjqg', titleKey: 'videos.list.v46' },
      { slug: 'thyroid-health', youtubeId: 'wTn0WuYyN1o', titleKey: 'videos.list.v25' },
    ],
    relatedLinks: [
      { route: '/services', labelKey: 'cardecal.services.functional.title', icon: 'medical_services' },
    ],
  },
  {
    id: '89800',
    slug: 'telomere-pro',
    name: 'Telomere Pro',
    brand: 'Enzyme Science',
    descriptionKey: 'shop.products.telomere',
    detailKey: 'telomere',
    category: 'antiaging',
    price: '49.99',
    image: 'https://assets.fullscript.io/Product/ES0025/400_front.png',
    relatedArticles: {
      en: ['telomeres-and-aging-a-deep-dive-into-cellular-aging-mechanisms', 'the-biomarkers-of-aging-key-indicators-to-monitor-your-health-span', 'chronological-vs-biological-age-understanding-the-difference'],
      es: ['telomeros-y-envejecimiento-una-inmersion-profunda-en-los-mecanismos-del-envejecimiento-celular', 'los-biomarcadores-del-envejecimiento-indicadores-claves-para-controlar-su-estado-de-salud', 'edad-cronologica-frente-a-edad-biologica-entender-la-diferencia'],
    },
    relatedVideos: [
      { slug: 'neuroendocrine-theory-of-aging', youtubeId: 'Kjke1NwQdXU', titleKey: 'videos.list.v44' },
      { slug: 'genetic-testing-alzheimers-prevention', youtubeId: 'CpcAM1wrkPQ', titleKey: 'videos.list.v41' },
    ],
    relatedLinks: [
      { route: '/services', labelKey: 'cardecal.services.functional.title', icon: 'medical_services' },
      { route: '/telemedicine', labelKey: 'cardecal.services.video.title', icon: 'videocam' },
    ],
  },
  {
    id: '71597',
    slug: 'iron-liquid',
    name: 'Iron Liquid',
    brand: 'Pure Encapsulations',
    descriptionKey: 'shop.products.iron',
    detailKey: 'iron',
    category: 'general',
    price: '14.99',
    image: 'https://assets.fullscript.io/Product/PU0903/400_front.png',
    relatedArticles: {
      en: ['feeling-fatigued-your-iron-levels-might-be-to-blame', 'when-was-your-last-medical-checkup'],
      es: ['se-siente-fatigado-la-culpa-podria-ser-de-tus-niveles-de-hierro', 'cuando-fue-tu-ultimo-chequeo-medico'],
    },
    relatedVideos: [
      { slug: 'hair-loss-in-women', youtubeId: '3fbZ5Rqar3I', titleKey: 'videos.list.v60' },
      { slug: 'lab-tests-in-functional-medicine', youtubeId: 'ri-sLzyiJjU', titleKey: 'videos.list.v12' },
    ],
    relatedLinks: [
      { route: '/telemedicine', labelKey: 'cardecal.services.video.title', icon: 'videocam' },
    ],
  },
  {
    id: '105060',
    slug: 'probiomax-sb-df',
    // Fullscript renamed the listing "ProbioMax® Sb 35B" (verified against
    // the live product_cards/105060 widget) — keep the name in sync.
    name: 'ProbioMax® Sb 35B',
    brand: 'Xymogen',
    descriptionKey: 'shop.products.probiomax',
    detailKey: 'probiomax',
    category: 'gut',
    price: '29.99',
    image: 'https://assets.fullscript.io/Product/XM0146/400_front.png',
    relatedArticles: {
      en: ['gut-health-how-your-microbiome-affects-overall-wellness', 'crohns-disease-the-power-of-the-vagus-nerve-a-functional-medicine-perspective'],
      es: ['salud-intestinal-como-afecta-su-microbioma-al-bienestar-general', 'crohn-y-el-poder-del-nervio-vago-una-mirada-desde-la-medicina-funcional'],
    },
    relatedVideos: [
      { slug: 'sibo-small-intestinal-bacterial-overgrowth', youtubeId: '8ROj00ttX3w', titleKey: 'videos.list.v21' },
      { slug: 'sibo-sobrecrecimiento-bacteriano-intestinal', youtubeId: 'E-qqKxVesoc', titleKey: 'videos.list.v28' },
    ],
    relatedLinks: [
      { route: '/services', labelKey: 'cardecal.services.functional.title', icon: 'medical_services' },
      { route: '/telemedicine', labelKey: 'cardecal.services.video.title', icon: 'videocam' },
    ],
  },
  {
    // NOTE: Fullscript product 72404 is "FemGuard + Balance" (verified against
    // the live product_cards/72404 widget). The legacy "shop v9" spec labeled
    // it DIM-Evail, but the buy widget has always sold FemGuard — the local
    // name/description now match what the customer actually receives.
    id: '72404',
    slug: 'femguard-balance',
    name: 'FemGuard + Balance™',
    brand: 'Designs for Health',
    descriptionKey: 'shop.products.femguard',
    detailKey: 'femguard',
    category: 'menopause',
    price: '24.99',
    image: 'https://assets.fullscript.io/Product/DF0045/400_front.png',
    relatedArticles: {
      en: ['what-is-hormonal-imbalance', 'bioidentical-vs-synthetic-hormones-an-in-depth-comparison'],
      es: ['que-es-el-desequilibrio-hormonal', 'hormonas-bioidenticas-vs-hormonas-sinteticas-una-comparacion-en-profundidad'],
    },
    relatedVideos: [
      { slug: 'the-5-hormones-in-menopause', youtubeId: 'iyK-EPbfBlU', titleKey: 'videos.list.v18' },
      { slug: 'when-does-menopause-start', youtubeId: 'QD-m7tjkLSs', titleKey: 'videos.list.v20' },
      { slug: 'las-5-hormonas-en-la-menopausia', youtubeId: 'hFwbHwvHoqU', titleKey: 'videos.list.v34' },
    ],
    relatedLinks: [
      { route: '/services', labelKey: 'cardecal.services.menopause.title', icon: 'spa' },
      { route: '/services', labelKey: 'cardecal.services.hormone.title', icon: 'science' },
      { route: '/telemedicine', labelKey: 'cardecal.services.video.title', icon: 'videocam' },
    ],
  },
];

@Injectable({ providedIn: 'root' })
export class ProductService {
  getProducts(): Product[] {
    return PRODUCTS;
  }

  getBySlug(slug: string): Product | undefined {
    return PRODUCTS.find(p => p.slug === slug);
  }

  /** Other products to keep the visitor browsing (same category first). */
  getSuggestions(current: Product, limit = 3): Product[] {
    const sameCategory = PRODUCTS.filter(p => p.slug !== current.slug && p.category === current.category);
    const others = PRODUCTS.filter(p => p.slug !== current.slug && p.category !== current.category);
    return [...sameCategory, ...others].slice(0, limit);
  }
}
