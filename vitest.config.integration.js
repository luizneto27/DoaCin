import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carrega .env.test ANTES de configurar qualquer coisa
dotenv.config({ path: resolve(__dirname, '.env.test') });

export default defineConfig({
  test: {
    name: 'integration',
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/integration/setup.js'],
    include: ['tests/integration/**/*.test.js'],
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      include: ['routes/**', 'services/**', 'config/**'],
    },
    testTimeout: 10000, // 10 segundos para testes de integração
    hookTimeout: 10000,
    env: {
      // Garante que DATABASE_URL está disponível
      DATABASE_URL: process.env.DATABASE_URL || 'postgresql://test_user:test_pass@localhost:5433/doacin_test',
    },
  },
});
