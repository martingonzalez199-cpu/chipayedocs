#!/usr/bin/env node

/**
 * Script para generar iconos PNG a partir del SVG del logo
 * Uso: node scripts/generate-icons.js
 * Requiere: npm install sharp
 */

const fs = require('fs');
const path = require('path');

// Verificar si sharp está instalado
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('❌ Error: sharp no está instalado');
  console.error('\nInstálalo con:');
  console.error('  npm install --save-dev sharp');
  console.error('\nO descarga los iconos manualmente de: https://www.favicon-generator.org/');
  process.exit(1);
}

const svgPath = path.join(__dirname, '..', 'public', 'logo.svg');
const publicDir = path.join(__dirname, '..', 'public');

// Verificar que el SVG existe
if (!fs.existsSync(svgPath)) {
  console.error(`❌ Error: No se encontró ${svgPath}`);
  process.exit(1);
}

const icons = [
  { name: 'logo-192x192.png', size: 192 },
  { name: 'logo-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 }
];

console.log('🎨 Generando iconos...\n');

// Generar cada icono
Promise.all(
  icons.map(icon => {
    const outputPath = path.join(publicDir, icon.name);

    return sharp(svgPath)
      .resize(icon.size, icon.size, {
        fit: 'contain',
        background: { r: 251, g: 243, b: 231 } // Color de fondo #FBF3E7
      })
      .png()
      .toFile(outputPath)
      .then(() => {
        console.log(`✅ ${icon.name} (${icon.size}x${icon.size})`);
        return true;
      })
      .catch(error => {
        console.error(`❌ Error generando ${icon.name}: ${error.message}`);
        return false;
      });
  })
).then(results => {
  if (results.every(r => r)) {
    console.log('\n✨ ¡Iconos generados exitosamente!');
    console.log('   Los archivos están en: public/');
  } else {
    console.log('\n⚠️  Algunos iconos no se generaron correctamente');
    process.exit(1);
  }
});
