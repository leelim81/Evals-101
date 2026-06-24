// Assembles the final GitHub Pages bundle into ./dist:
//   dist/index.html   -> root landing page (from site/index.html)
//   dist/slides/*     -> built Slidev deck (from slides/dist)
//   dist/demo/*       -> built Astro site (from demo/dist)
//   dist/exports/*    -> committed PDF/PPTX hand-outs (from exports/, if present)
import { existsSync, mkdirSync, rmSync, cpSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

function copyInto(src, destSub) {
  if (!existsSync(src)) {
    console.warn(`! skipped: ${src} does not exist (build it first?)`);
    return false;
  }
  const dest = join(dist, destSub);
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest, { recursive: true });
  console.log(`✓ ${src} -> ${dest}`);
  return true;
}

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

// Root landing page
copyInto(join(root, 'site', 'index.html'), 'index.html');
// .nojekyll so GitHub Pages serves _astro/ and underscored dirs untouched
cpSync(join(root, 'site', '.nojekyll'), join(dist, '.nojekyll'));

// Built sub-apps
copyInto(join(root, 'slides', 'dist'), 'slides');
copyInto(join(root, 'demo', 'dist'), 'demo');

// Optional committed exports (PDF / PPTX)
if (existsSync(join(root, 'exports'))) copyInto(join(root, 'exports'), 'exports');

console.log('\nFinal dist/:');
for (const e of readdirSync(dist)) console.log('  ', e);
