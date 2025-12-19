import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './testApp.js';

describe('Basic Integration Tests', () => {
  describe('Health Check', () => {
    it('aplicação deve responder a requisições', () => {
      expect(app).toBeDefined();
    });

    it('deve retornar 404 para rotas inexistentes', async () => {
      const response = await request(app)
        .get('/api/rota-que-nao-existe')
        .expect(404);
    });
  });
});
