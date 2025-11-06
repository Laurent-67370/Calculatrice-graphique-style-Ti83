#!/usr/bin/env node

import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [
  { size: 192, name: 'icon-192.png', maskable: false },
  { size: 512, name: 'icon-512.png', maskable: false },
  { size: 192, name: 'icon-maskable-192.png', maskable: true },
  { size: 512, name: 'icon-maskable-512.png', maskable: true },
];

console.log('🎨 Génération des icônes PWA...\n');

// Lire le SVG
const svgPath = join(__dirname, 'public', 'icon.svg');
const svgBuffer = readFileSync(svgPath);

// Générer chaque taille
for (const { size, name, maskable } of sizes) {
  try {
    let buffer = svgBuffer;

    // Pour les icônes maskable, ajouter un padding de 10%
    if (maskable) {
      const paddingPercent = 10;
      const newSize = size;
      const iconSize = Math.floor(size * (100 - paddingPercent * 2) / 100);
      const padding = Math.floor((newSize - iconSize) / 2);

      // Créer un canvas avec padding
      const canvas = sharp({
        create: {
          width: newSize,
          height: newSize,
          channels: 4,
          background: { r: 26, g: 26, b: 26, alpha: 1 }
        }
      });

      // Redimensionner le SVG
      const resizedIcon = await sharp(svgBuffer)
        .resize(iconSize, iconSize)
        .png()
        .toBuffer();

      // Composer avec le padding
      buffer = await canvas
        .composite([{
          input: resizedIcon,
          top: padding,
          left: padding
        }])
        .png()
        .toBuffer();

      await sharp(buffer).toFile(join(__dirname, 'public', name));
    } else {
      // Icône normale sans padding
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(join(__dirname, 'public', name));
    }

    console.log(`✅ ${name} (${size}x${size}${maskable ? ' maskable' : ''})`);
  } catch (error) {
    console.error(`❌ Erreur pour ${name}:`, error.message);
  }
}

console.log('\n🎉 Génération des icônes terminée !');
