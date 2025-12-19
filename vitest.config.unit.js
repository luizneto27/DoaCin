import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'unit',
    globals: true,
    environment: 'node',
    include: ['tests/unit/**/*.test.js'],
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      include: ['routes/controllers/**', 'services/**'],
    },
    testTimeout: 5000, // 5 segundos para testes de unidade
  },
});</content>
<parameter name="filePath">c:\Users\Luan Silva\Documents\GitHub\DoaCin\vitest.config.unit.js