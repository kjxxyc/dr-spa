/**
 * Image Optimization Script - Dr. Adonis SPA
 * Converts PNG/JPG images to WebP and compresses them for better performance.
 * Run with: node scripts/optimize-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '../src/assets/images');

// Configuration per image - tailored compression settings
const IMAGE_CONFIG = [
  // Hero & background - needs to be small, quality matters a lot
  {
    input: 'backgrounds/home-main-img.png',
    outputs: [
      { file: 'backgrounds/home-main-img.webp', width: 1920, quality: 82 },
      { file: 'backgrounds/home-main-img-md.webp', width: 768, quality: 80 },
    ]
  },
  {
    input: 'background-dr.png',
    outputs: [
      { file: 'background-dr.webp', width: 1920, quality: 80 },
      { file: 'background-dr-md.webp', width: 768, quality: 78 },
    ]
  },
  // Doctor profile - very large, needs aggressive compression
  {
    input: 'logos/dr-full-img.jpg',
    outputs: [
      { file: 'logos/dr-full-img.webp', width: 800, quality: 82 },
      { file: 'logos/dr-full-img-sm.webp', width: 400, quality: 78 },
    ]
  },
  {
    input: 'logos/perfil-img.jpg',
    outputs: [
      { file: 'logos/perfil-img.webp', width: 600, quality: 82 },
    ]
  },
  // Book & products
  {
    input: 'book-dradonis.png',
    outputs: [
      { file: 'book-dradonis.webp', width: 600, quality: 85 },
    ]
  },
  {
    input: 'drug-bag-dradonis.png',
    outputs: [
      { file: 'drug-bag-dradonis.webp', width: 500, quality: 83 },
    ]
  },
  // Tadalafil banners
  {
    input: 'tadalafil-head-en.png',
    outputs: [
      { file: 'tadalafil-head-en.webp', width: 960, quality: 85 },
    ]
  },
  {
    input: 'tadalafil-head-es.png',
    outputs: [
      { file: 'tadalafil-head-es.webp', width: 960, quality: 85 },
    ]
  },
  // Login background
  {
    input: 'backgrounds/login3-bg.png',
    outputs: [
      { file: 'backgrounds/login3-bg.webp', width: 1200, quality: 80 },
    ]
  },
  // Logos - keep small, already optimized but convert to WebP
  {
    input: 'logos/Logo_720x192.jpg',
    outputs: [
      { file: 'logos/Logo_720x192.webp', quality: 90 },
    ]
  },
];

async function optimizeImage(config) {
  const inputPath = path.join(IMAGES_DIR, config.input);

  if (!fs.existsSync(inputPath)) {
    console.warn(`  ⚠️  Skipping (not found): ${config.input}`);
    return;
  }

  const inputStats = fs.statSync(inputPath);
  const inputKB = Math.round(inputStats.size / 1024);

  for (const output of config.outputs) {
    const outputPath = path.join(IMAGES_DIR, output.file);

    let pipeline = sharp(inputPath);

    if (output.width) {
      pipeline = pipeline.resize(output.width, null, {
        withoutEnlargement: true,
        fit: 'inside',
      });
    }

    await pipeline
      .webp({ quality: output.quality || 82, effort: 5 })
      .toFile(outputPath);

    const outputStats = fs.statSync(outputPath);
    const outputKB = Math.round(outputStats.size / 1024);
    const savings = Math.round((1 - outputStats.size / inputStats.size) * 100);

    console.log(`  ✅ ${config.input} (${inputKB}KB) → ${output.file} (${outputKB}KB) [${savings}% savings]`);
  }
}

async function main() {
  console.log('\n🖼️  Dr. Adonis Image Optimizer\n');
  console.log(`📁 Images directory: ${IMAGES_DIR}\n`);

  let totalSavingsKB = 0;

  for (const config of IMAGE_CONFIG) {
    try {
      await optimizeImage(config);
    } catch (err) {
      console.error(`  ❌ Error processing ${config.input}:`, err.message);
    }
  }

  console.log('\n✨ Optimization complete!');
  console.log('📝 Next: Update HTML templates to use .webp files\n');
}

main().catch(console.error);
