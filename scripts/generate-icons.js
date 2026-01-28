// Script zum Generieren von PNG-Icons aus dem 1024x1024 Quell-Icon
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 180, name: 'icon-180x180.png' },    // iOS
  { size: 192, name: 'icon-192x192.png' },    // Android/PWA
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' },    // Android/PWA
];

const sourcePath = path.join(__dirname, '..', 'public', 'icons', 'icon-1024x1024.png');
const outputDir = path.join(__dirname, '..', 'public', 'icons');

// Erstelle Output-Verzeichnis
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  console.log('Generiere PNG-Icons aus icon-1024x1024.png...\n');

  if (!fs.existsSync(sourcePath)) {
    console.error('❌ Fehler: public/icons/icon-1024x1024.png nicht gefunden!');
    process.exit(1);
  }

  for (const { size, name } of sizes) {
    const outputPath = path.join(outputDir, name);

    await sharp(sourcePath)
      .resize(size, size)
      .png()
      .toFile(outputPath);

    console.log(`✓ ${name} (${size}x${size})`);
  }

  // Kopiere auch als favicon (72x72 für bessere Qualität)
  await sharp(sourcePath)
    .resize(72, 72)
    .png()
    .toFile(path.join(__dirname, '..', 'public', 'favicon.png'));
  console.log(`✓ favicon.png (72x72)`);

  // Erstelle Apple Touch Icon
  await sharp(sourcePath)
    .resize(180, 180)
    .png()
    .toFile(path.join(__dirname, '..', 'public', 'apple-touch-icon.png'));
  console.log(`✓ apple-touch-icon.png (180x180)`);

  console.log('\n✅ Alle Icons wurden erstellt!');
  console.log(`📁 Speicherort: ${outputDir}`);
}

generateIcons().catch(console.error);
