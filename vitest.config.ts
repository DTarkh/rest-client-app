import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    passWithNoTests: true,
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/app/_/setupTest.ts'],
  },
  resolve: {
    alias: [
      { find: /^@\/src(\/|$)/, replacement: path.resolve(__dirname, './src') + '$1' },
      { find: /^@\//, replacement: path.resolve(__dirname, './src/') },
      { find: '@', replacement: path.resolve(__dirname, './src') },
    ],
  },
});
