import { defineConfig } from 'vitest/config';

// Les services sont du TypeScript pur (pas de React) : testés en environnement node,
// sans jsdom. Fichiers de tests hors src/ (tests/) pour rester invisibles au tsc -b.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
