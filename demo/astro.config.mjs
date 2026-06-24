// @ts-check
import { defineConfig } from 'astro/config';

// Deployed under https://<user>.github.io/Evals-101/demo/
// Internal page links are RELATIVE, so the deck + site work regardless of host;
// `base` only needs to be right so bundled asset URLs resolve on GitHub Pages.
export default defineConfig({
  base: '/Evals-101/demo',
  build: { format: 'directory' },
  trailingSlash: 'ignore',
});
