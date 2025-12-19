import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from './testApp.js';
import { prisma } from './setup.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('Dashboard Integration Tests', () => {
  let authToken;
  let testUser;
  let pontoColeta;

  beforeEach(async () => {
    // Gera timestamp único para evitar conflitos
    const timestamp = Date.now();
    
    // Cria usuário de teste com todos os campos
    const hashedPassword = await bcrypt.hash('senha123', 10);
    testUser = await prisma.user.create({
      data: {
        nome: 'Carlos Dashboard',
        email: `carlos.dashboard.${timestamp}@test.com`,
        password: hashedPassword,
        cpf: `111${timestamp.toString().slice(-8)}`,
        birthDate: new Date('1988-03-15'),
        bloodType: 'AB+',
        genero: 'masculino',
        weight: 75,
        phone: '11987654321',
      },
    });

    // Cria ponto de coleta de teste
    pontoColeta = await prisma.pontoColeta.create({
      data: {
        nome: 'Hemocentro Principal',
        endereco: 'Av. Principal, 456',
        tipo: 'fixed',
        latitude: -23.5505,
        longitude: -46.6333,
      },
    });

    // Gera token JWT
    authToken = jwt.sign(
      { userId: testUser.id, email: testUser.email },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  describe('GET /api/dashboard - Estatísticas do dashboard', () => {
    it('deve retornar estatísticas básicas quando usuário não tem doações', async () => {
      const response = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Campos obrigatórios do usuário
      expect(response.body).toHaveProperty('nome', testUser.nome);
      expect(response.body).toHaveProperty('email', testUser.email);
      expect(response.body).toHaveProperty('bloodType', testUser.bloodType);
      expect(response.body).toHaveProperty('genero', testUser.genero);
      expect(response.body).toHaveProperty('weight', testUser.weight);
      expect(response.body).toHaveProperty('telefone', testUser.phone);

      // Estatísticas de doação (devem ser 0/null quando não há doações)
      expect(response.body).toHaveProperty('capibasBalance', 0);
      expect(response.body).toHaveProperty('lastDonationDate', null);
      expect(response.body).toHaveProperty('donationCountLastYear', 0);
      expect(response.body).toHaveProperty('doacoes', 0);
      expect(response.body).toHaveProperty('pendingDonations', 0);

      // Verifica birthDate
      expect(response.body).toHaveProperty('birthDate');
      expect(new Date(response.body.birthDate).toISOString())
        .toBe(testUser.birthDate.toISOString());
    });

    it('deve calcular corretamente saldo de capibas com múltiplas doações', async () => {
      // Cria doações confirmadas
      await prisma.donation.createMany({
        data: [
          {
            userId: testUser.id,
            pontoColetaId: pontoColeta.id,
            donationDate: new Date('2024-01-15'),
            status: 'confirmed',
            pointsEarned: 100,
            validatedByQR: true,
          },
          {
            userId: testUser.id,
            pontoColetaId: pontoColeta.id,
            donationDate: new Date('2024-03-20'),
            status: 'confirmed',
            pointsEarned: 150,
            validatedByQR: true,
          },
          {
            userId: testUser.id,
            pontoColetaId: pontoColeta.id,
            donationDate: new Date('2024-05-10'),
            status: 'pending', // Pendente não deve contar
            pointsEarned: 100,
            validatedByQR: false,
          },
        ],
      });

      const response = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.capibasBalance).toBe(250); // 100 + 150
      expect(response.body.doacoes).toBe(2); // Apenas confirmadas
      expect(response.body.pendingDonations).toBe(1);
    });

    it('deve retornar data da última doação confirmada', async () => {
      const lastDonationDate = new Date('2024-06-15');
      
      await prisma.donation.createMany({
        data: [
          {
            userId: testUser.id,
            pontoColetaId: pontoColeta.id,
            donationDate: new Date('2024-01-15'),
            status: 'confirmed',
            pointsEarned: 100,
            validatedByQR: true,
          },
          {
            userId: testUser.id,
            pontoColetaId: pontoColeta.id,
            donationDate: lastDonationDate,
            status: 'confirmed',
            pointsEarned: 100,
            validatedByQR: true,
          },
          {
            userId: testUser.id,
            pontoColetaId: pontoColeta.id,
            donationDate: new Date('2024-07-01'),
            status: 'pending', // Mais recente, mas pendente
            pointsEarned: 100,
            validatedByQR: false,
          },
        ],
      });

      const response = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.lastDonationDate).not.toBeNull();
      expect(new Date(response.body.lastDonationDate).toISOString())
        .toBe(lastDonationDate.toISOString());
    });

    it('deve contar doações do último ano corretamente', async () => {
      const now = new Date();
      const oneYearAgo = new Date(now);
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      const twoYearsAgo = new Date(now);
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

      await prisma.donation.createMany({
        data: [
          {
            userId: testUser.id,
            pontoColetaId: pontoColeta.id,
            donationDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
            status: 'confirmed',
            pointsEarned: 100,
            validatedByQR: true,
          },
          {
            userId: testUser.id,
            pontoColetaId: pontoColeta.id,
            donationDate: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000), // 180 dias atrás
            status: 'confirmed',
            pointsEarned: 100,
            validatedByQR: true,
          },
          {
            userId: testUser.id,
            pontoColetaId: pontoColeta.id,
            donationDate: twoYearsAgo, // Há 2 anos (não deve contar)
            status: 'confirmed',
            pointsEarned: 100,
            validatedByQR: true,
          },
        ],
      });

      const response = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.donationCountLastYear).toBe(2);
      expect(response.body.doacoes).toBe(3); // Total de todas as doações confirmadas
    });

    it('deve retornar 401 sem token de autenticação', async () => {
      await request(app)
        .get('/api/dashboard')
        .expect(401);
    });

    it('deve retornar 401 com token inválido', async () => {
      await request(app)
        .get('/api/dashboard')
        .set('Authorization', 'Bearer token-invalido')
        .expect(401);
    });

    it('deve retornar erro quando usuário não existe (token com userId inválido)', async () => {
      // Cria token para usuário inexistente
      const fakeToken = jwt.sign(
        { userId: 99999, email: 'fake@test.com' },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      // O controller atual retorna 500, mas idealmente deveria ser 404
      const response = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${fakeToken}`)
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });

    it('deve contar apenas doações pendentes, não confirmadas', async () => {
      await prisma.donation.createMany({
        data: [
          {
            userId: testUser.id,
            pontoColetaId: pontoColeta.id,
            donationDate: new Date('2024-01-15'),
            status: 'confirmed',
            pointsEarned: 100,
            validatedByQR: true,
          },
          {
            userId: testUser.id,
            pontoColetaId: pontoColeta.id,
            donationDate: new Date('2024-02-15'),
            status: 'pending',
            pointsEarned: 100,
            validatedByQR: false,
          },
          {
            userId: testUser.id,
            pontoColetaId: pontoColeta.id,
            donationDate: new Date('2024-03-15'),
            status: 'pending',
            pointsEarned: 100,
            validatedByQR: false,
          },
        ],
      });

      const response = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.pendingDonations).toBe(2);
      expect(response.body.doacoes).toBe(1); // Apenas confirmadas
    });
  });

  describe('Isolamento de dados entre usuários', () => {
    it('não deve retornar estatísticas de outros usuários', async () => {
      // Cria outro usuário com doações
      const timestamp2 = Date.now() + 1;
      const hashedPassword = await bcrypt.hash('senha456', 10);
      const otherUser = await prisma.user.create({
        data: {
          nome: 'Ana Outra',
          email: `ana.outra.${timestamp2}@test.com`,
          password: hashedPassword,
          cpf: `999${timestamp2.toString().slice(-8)}`,
          birthDate: new Date('1992-07-20'),
          bloodType: 'O-',
          genero: 'feminino',
          weight: 65,
          phone: '11912345678',
        },
      });

      // Cria doação para outro usuário
      await prisma.donation.create({
        data: {
          userId: otherUser.id,
          pontoColetaId: pontoColeta.id,
          donationDate: new Date('2024-06-15'),
          status: 'confirmed',
          pointsEarned: 500, // Muitos pontos
          validatedByQR: true,
        },
      });

      // testUser busca seu dashboard (não deve ver dados de otherUser)
      const response = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.nome).toBe(testUser.nome);
      expect(response.body.email).toBe(testUser.email);
      expect(response.body.capibasBalance).toBe(0); // Não deve ter os 500 pontos do outro
      expect(response.body.doacoes).toBe(0);
    });
  });

  describe('Validação de campos retornados', () => {
    it('deve retornar todos os campos esperados pelo frontend', async () => {
      const response = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verifica que todos os campos esperados estão presentes
      const expectedFields = [
        'capibasBalance',
        'lastDonationDate',
        'genero',
        'birthDate',
        'weight',
        'donationCountLastYear',
        'nome',
        'email',
        'bloodType',
        'telefone',
        'doacoes',
        'pendingDonations'
      ];

      expectedFields.forEach(field => {
        expect(response.body).toHaveProperty(field);
      });
    });

    it('deve retornar tipos de dados corretos', async () => {
      const response = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(typeof response.body.capibasBalance).toBe('number');
      expect(typeof response.body.donationCountLastYear).toBe('number');
      expect(typeof response.body.doacoes).toBe('number');
      expect(typeof response.body.pendingDonations).toBe('number');
      expect(typeof response.body.nome).toBe('string');
      expect(typeof response.body.email).toBe('string');
      expect(typeof response.body.bloodType).toBe('string');
      expect(typeof response.body.genero).toBe('string');
      expect(typeof response.body.weight).toBe('number');
      expect(typeof response.body.telefone).toBe('string');
    });
  });
});
