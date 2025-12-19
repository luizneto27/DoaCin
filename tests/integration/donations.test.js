import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from './testApp.js';
import { prisma } from './setup.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('Donations Integration Tests', () => {
  let authToken;
  let testUser;
  let pontoColeta;

  beforeEach(async () => {
    // Gera timestamp único para evitar conflitos
    const timestamp = Date.now();
    
    // Cria usuário de teste
    const hashedPassword = await bcrypt.hash('senha123', 10);
    testUser = await prisma.user.create({
      data: {
        nome: 'João Doador',
        email: `joao.doador.${timestamp}@test.com`,
        password: hashedPassword,
        cpf: `123${timestamp.toString().slice(-8)}`,
        birthDate: new Date('1990-01-01'),
        bloodType: 'O+',
        genero: 'masculino',
        weight: 70,
      },
    });

    // Cria ponto de coleta de teste
    pontoColeta = await prisma.pontoColeta.create({
      data: {
        nome: 'Hemocentro Central',
        endereco: 'Rua Teste, 123',
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

  describe('GET /api/donations - Histórico de doações', () => {
    it('deve retornar array vazio quando usuário não tem doações', async () => {
      const response = await request(app)
        .get('/api/donations')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(0);
    });

    it('deve retornar histórico de doações do usuário', async () => {
      // Cria doações de teste
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
            status: 'pending',
            pointsEarned: 100,
            validatedByQR: false,
          },
        ],
      });

      const response = await request(app)
        .get('/api/donations')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('donationDate');
      expect(response.body[0]).toHaveProperty('status');
      expect(response.body[0]).toHaveProperty('pointsEarned');
      expect(response.body[0]).toHaveProperty('location');
      expect(response.body[0].location).toHaveProperty('name');
      
      // Verifica ordenação (mais recente primeiro)
      expect(new Date(response.body[0].donationDate).getTime())
        .toBeGreaterThan(new Date(response.body[1].donationDate).getTime());
    });

    it('deve retornar 401 sem token de autenticação', async () => {
      await request(app)
        .get('/api/donations')
        .expect(401);
    });

    it('deve retornar 401 com token inválido', async () => {
      await request(app)
        .get('/api/donations')
        .set('Authorization', 'Bearer token-invalido')
        .expect(401);
    });
  });

  describe('POST /api/donations - Criar doação manual', () => {
    it('deve criar nova doação com sucesso', async () => {
      const donationData = {
        donationDate: '2024-06-15',
        hemocentro: 'Hemocentro Central',
        observacoes: 'Doação de teste',
      };

      const response = await request(app)
        .post('/api/donations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(donationData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('status', 'pending');
      expect(response.body).toHaveProperty('pointsEarned', 100);
      expect(response.body).toHaveProperty('location');
      expect(response.body.location.name).toBe(donationData.hemocentro);

      // Verifica no banco de dados
      const donationInDb = await prisma.donation.findUnique({
        where: { id: response.body.id },
      });
      expect(donationInDb).toBeTruthy();
      expect(donationInDb.status).toBe('pending');
      expect(donationInDb.validatedByQR).toBe(false);
    });

    it('deve criar ponto de coleta se não existir', async () => {
      const donationData = {
        donationDate: '2024-06-15',
        hemocentro: `Novo Hemocentro XYZ ${Date.now()}`, // Nome único
      };

      // Verifica que o ponto não existe antes
      const pontoAntes = await prisma.pontoColeta.findFirst({
        where: { nome: donationData.hemocentro },
      });
      expect(pontoAntes).toBeNull();

      const response = await request(app)
        .post('/api/donations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(donationData)
        .expect(201);

      // Verifica que o ponto foi criado
      const novoPonto = await prisma.pontoColeta.findFirst({
        where: { nome: donationData.hemocentro },
      });
      expect(novoPonto).toBeTruthy();
      expect(novoPonto.nome).toBe(donationData.hemocentro);
    });

    it('deve retornar 400 sem data da doação', async () => {
      const response = await request(app)
        .post('/api/donations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ hemocentro: 'Hemocentro Central' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('obrigatórios');
    });

    it('deve retornar 400 sem hemocentro', async () => {
      const response = await request(app)
        .post('/api/donations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ donationDate: '2024-06-15' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('obrigatórios');
    });

    it('deve retornar 401 sem token de autenticação', async () => {
      await request(app)
        .post('/api/donations')
        .send({
          donationDate: '2024-06-15',
          hemocentro: 'Hemocentro Central',
        })
        .expect(401);
    });
  });

  describe('POST /api/donations/confirm - Confirmar doação via QR Code', () => {
    it('deve confirmar doação pendente com sucesso', async () => {
      // Cria doação pendente
      const pendingDonation = await prisma.donation.create({
        data: {
          userId: testUser.id,
          pontoColetaId: pontoColeta.id,
          donationDate: new Date('2024-06-15'),
          status: 'pending',
          pointsEarned: 100,
          validatedByQR: false,
        },
      });

      const response = await request(app)
        .post('/api/donations/confirm')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('confirmada com sucesso');
      expect(response.body).toHaveProperty('donation');
      expect(response.body.donation.status).toBe('confirmed');
      expect(response.body.donation.validatedByQR).toBe(true);
      expect(response.body.donation.id).toBe(pendingDonation.id);
    });

    it('deve confirmar a doação pendente mais recente', async () => {
      // Cria múltiplas doações pendentes
      const donation1 = await prisma.donation.create({
        data: {
          userId: testUser.id,
          pontoColetaId: pontoColeta.id,
          donationDate: new Date('2024-05-01'),
          status: 'pending',
          pointsEarned: 100,
          validatedByQR: false,
          createdAt: new Date('2024-05-01'),
        },
      });

      const donation2 = await prisma.donation.create({
        data: {
          userId: testUser.id,
          pontoColetaId: pontoColeta.id,
          donationDate: new Date('2024-06-01'),
          status: 'pending',
          pointsEarned: 100,
          validatedByQR: false,
          createdAt: new Date('2024-06-01'),
        },
      });

      const response = await request(app)
        .post('/api/donations/confirm')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Deve confirmar a mais recente (donation2)
      expect(response.body.donation.id).toBe(donation2.id);

      // Verifica que donation1 ainda está pendente
      const donation1After = await prisma.donation.findUnique({
        where: { id: donation1.id },
      });
      expect(donation1After.status).toBe('pending');
    });

    it('deve retornar 400 quando não há doações pendentes', async () => {
      const response = await request(app)
        .post('/api/donations/confirm')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Nenhuma doação pendente');
    });

    it('deve retornar 401 sem token de autenticação', async () => {
      await request(app)
        .post('/api/donations/confirm')
        .expect(401);
    });
  });

  describe('Isolamento de dados entre usuários', () => {
    it('não deve retornar doações de outros usuários', async () => {
      // Cria outro usuário
      const timestamp2 = Date.now() + 1;
      const hashedPassword = await bcrypt.hash('senha456', 10);
      const otherUser = await prisma.user.create({
        data: {
          nome: 'Maria Doadora',
          email: `maria.doadora.${timestamp2}@test.com`,
          password: hashedPassword,
          cpf: `987${timestamp2.toString().slice(-8)}`,
          birthDate: new Date('1995-05-05'),
          bloodType: 'A+',
          genero: 'feminino',
          weight: 60,
        },
      });

      // Cria doação para outro usuário
      await prisma.donation.create({
        data: {
          userId: otherUser.id,
          pontoColetaId: pontoColeta.id,
          donationDate: new Date('2024-06-15'),
          status: 'confirmed',
          pointsEarned: 100,
          validatedByQR: true,
        },
      });

      // Busca doações do testUser (não deve ver doação de otherUser)
      const response = await request(app)
        .get('/api/donations')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(0);
    });

    it('não deve confirmar doações de outros usuários', async () => {
      // Cria outro usuário
      const timestamp3 = Date.now() + 2;
      const hashedPassword = await bcrypt.hash('senha456', 10);
      const otherUser = await prisma.user.create({
        data: {
          nome: 'Maria Doadora',
          email: `maria.doadora.${timestamp3}@test.com`,
          password: hashedPassword,
          cpf: `987${timestamp3.toString().slice(-8)}`,
          birthDate: new Date('1995-05-05'),
          bloodType: 'A+',
          genero: 'feminino',
          weight: 60,
        },
      });

      // Cria doação pendente para outro usuário
      await prisma.donation.create({
        data: {
          userId: otherUser.id,
          pontoColetaId: pontoColeta.id,
          donationDate: new Date('2024-06-15'),
          status: 'pending',
          pointsEarned: 100,
          validatedByQR: false,
        },
      });

      // testUser tenta confirmar (não deve encontrar doações pendentes)
      const response = await request(app)
        .post('/api/donations/confirm')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.error).toContain('Nenhuma doação pendente');
    });
  });
});
