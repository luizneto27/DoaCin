import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from './testApp.js';
import { prisma } from './setup.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('Campaigns Integration Tests', () => {
  let authToken;
  let testUser;

  beforeEach(async () => {
    // Gera timestamp único para evitar conflitos
    const timestamp = Date.now();
    
    // Cria usuário de teste
    const hashedPassword = await bcrypt.hash('senha123', 10);
    testUser = await prisma.user.create({
      data: {
        nome: 'Campanha User',
        email: `campanha.user.${timestamp}@test.com`,
        password: hashedPassword,
        cpf: `555${timestamp.toString().slice(-8)}`,
        birthDate: new Date('1990-01-01'),
        bloodType: 'A+',
        genero: 'masculino',
        weight: 70,
      },
    });

    // Gera token JWT
    authToken = jwt.sign(
      { userId: testUser.id, email: testUser.email },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  describe('GET /api/campaigns/locals - Listar locais de campanha', () => {
    it('deve retornar array de locais cadastrados', async () => {
      const response = await request(app)
        .get('/api/campaigns/locals')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toBeInstanceOf(Array);
    });

    it('deve retornar lista de locais fixos cadastrados', async () => {
      // Cria locais de teste
      await prisma.pontoColeta.createMany({
        data: [
          {
            nome: 'Hemocentro Principal',
            endereco: 'Rua Principal, 100',
            tipo: 'fixed',
            horarioAbertura: '08:00',
            horarioFechamento: '18:00',
            telefone: '11987654321',
            latitude: -23.5505,
            longitude: -46.6333,
          },
          {
            nome: 'Posto de Coleta Centro',
            endereco: 'Av. Central, 500',
            tipo: 'fixed',
            horarioAbertura: '09:00',
            horarioFechamento: '17:00',
            telefone: '11912345678',
            latitude: -23.5489,
            longitude: -46.6388,
          },
        ],
      });

      const response = await request(app)
        .get('/api/campaigns/locals')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThanOrEqual(2);
      
      // Verifica estrutura do primeiro local
      const firstLocal = response.body.data[0];
      expect(firstLocal).toHaveProperty('id');
      expect(firstLocal).toHaveProperty('name');
      expect(firstLocal).toHaveProperty('address');
      expect(firstLocal).toHaveProperty('hours');
      expect(firstLocal).toHaveProperty('contact');
      expect(firstLocal).toHaveProperty('type');
      expect(firstLocal).toHaveProperty('latitude');
      expect(firstLocal).toHaveProperty('longitude');
    });

    it('deve retornar locais ordenados por nome', async () => {
      // Cria locais em ordem diferente
      await prisma.pontoColeta.createMany({
        data: [
          {
            nome: 'Zeta Local',
            endereco: 'Rua Z, 100',
            tipo: 'fixed',
          },
          {
            nome: 'Alpha Local',
            endereco: 'Rua A, 200',
            tipo: 'fixed',
          },
          {
            nome: 'Beta Local',
            endereco: 'Rua B, 300',
            tipo: 'fixed',
          },
        ],
      });

      const response = await request(app)
        .get('/api/campaigns/locals')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.length).toBeGreaterThanOrEqual(3);
      
      // Verifica se está ordenado alfabeticamente
      const names = response.body.data.map(l => l.name);
      const sortedNames = [...names].sort();
      expect(names).toEqual(sortedNames);
    });

    it('deve retornar locais com evento (mobile)', async () => {
      const eventStart = new Date('2025-12-25');
      const eventEnd = new Date('2025-12-26');

      await prisma.pontoColeta.create({
        data: {
          nome: 'Campanha Móvel Natal',
          endereco: 'Praça Central',
          tipo: 'mobile',
          eventStartDate: eventStart,
          eventEndDate: eventEnd,
          latitude: -23.5505,
          longitude: -46.6333,
        },
      });

      const response = await request(app)
        .get('/api/campaigns/locals')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const mobileLocal = response.body.data.find(l => l.type === 'mobile');
      expect(mobileLocal).toBeTruthy();
      expect(mobileLocal.eventStartDate).toBeTruthy();
      expect(mobileLocal.eventEndDate).toBeTruthy();
    });

    it('deve retornar 401 sem token de autenticação', async () => {
      await request(app)
        .get('/api/campaigns/locals')
        .expect(401);
    });

    it('deve retornar 401 com token inválido', async () => {
      await request(app)
        .get('/api/campaigns/locals')
        .set('Authorization', 'Bearer token-invalido')
        .expect(401);
    });
  });

  describe('POST /api/campaigns/locals - Criar local de campanha', () => {
    it('deve criar novo local fixo com sucesso', async () => {
      const localData = {
        name: 'Novo Hemocentro',
        address: 'Rua Nova, 123',
        hours: '08:00 - 17:00',
        contact: '11999887766',
        type: 'fixed',
        latitude: -23.5505,
        longitude: -46.6333,
      };

      const response = await request(app)
        .post('/api/campaigns/locals')
        .set('Authorization', `Bearer ${authToken}`)
        .send(localData)
        .expect(201);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(localData.name);
      expect(response.body.data.address).toBe(localData.address);
      expect(response.body.data.hours).toBe(localData.hours);
      expect(response.body.data.contact).toBe(localData.contact);
      expect(response.body.data.type).toBe(localData.type);
      expect(response.body.data.latitude).toBe(localData.latitude);
      expect(response.body.data.longitude).toBe(localData.longitude);

      // Verifica no banco de dados
      const localInDb = await prisma.pontoColeta.findUnique({
        where: { id: response.body.data.id },
      });
      expect(localInDb).toBeTruthy();
      expect(localInDb.nome).toBe(localData.name);
    });

    it('deve criar local móvel com datas de evento', async () => {
      const localData = {
        name: 'Campanha Shopping',
        address: 'Shopping Center, Piso 2',
        type: 'mobile',
        eventStartDate: '2025-12-20',
        eventEndDate: '2025-12-22',
        latitude: -23.5489,
        longitude: -46.6388,
      };

      const response = await request(app)
        .post('/api/campaigns/locals')
        .set('Authorization', `Bearer ${authToken}`)
        .send(localData)
        .expect(201);

      expect(response.body.data.type).toBe('mobile');
      expect(response.body.data.eventStartDate).toBeTruthy();
      expect(response.body.data.eventEndDate).toBeTruthy();

      // Verifica no banco
      const localInDb = await prisma.pontoColeta.findUnique({
        where: { id: response.body.data.id },
      });
      expect(localInDb.tipo).toBe('mobile');
      expect(localInDb.eventStartDate).toBeInstanceOf(Date);
      expect(localInDb.eventEndDate).toBeInstanceOf(Date);
    });

    it('deve criar local com dados mínimos (nome e endereço)', async () => {
      const localData = {
        name: 'Local Básico',
        address: 'Endereço Básico',
      };

      const response = await request(app)
        .post('/api/campaigns/locals')
        .set('Authorization', `Bearer ${authToken}`)
        .send(localData)
        .expect(201);

      expect(response.body.data.name).toBe(localData.name);
      expect(response.body.data.address).toBe(localData.address);
      expect(response.body.data.type).toBe('fixed'); // Tipo padrão
    });

    it('deve retornar 400 sem nome', async () => {
      const response = await request(app)
        .post('/api/campaigns/locals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ address: 'Rua Teste' })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('obrigatórios');
    });

    it('deve retornar 400 sem endereço', async () => {
      const response = await request(app)
        .post('/api/campaigns/locals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Local Teste' })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('obrigatórios');
    });

    it('deve processar horários corretamente', async () => {
      const localData = {
        name: 'Local com Horário',
        address: 'Rua Teste',
        hours: '10:00 - 16:00',
      };

      const response = await request(app)
        .post('/api/campaigns/locals')
        .set('Authorization', `Bearer ${authToken}`)
        .send(localData)
        .expect(201);

      const localInDb = await prisma.pontoColeta.findUnique({
        where: { id: response.body.data.id },
      });
      
      expect(localInDb.horarioAbertura).toBe('10:00');
      expect(localInDb.horarioFechamento).toBe('16:00');
    });

    it('deve retornar 401 sem token de autenticação', async () => {
      await request(app)
        .post('/api/campaigns/locals')
        .send({
          name: 'Local Teste',
          address: 'Endereço Teste',
        })
        .expect(401);
    });

    it('deve retornar 401 com token inválido', async () => {
      await request(app)
        .post('/api/campaigns/locals')
        .set('Authorization', 'Bearer token-invalido')
        .send({
          name: 'Local Teste',
          address: 'Endereço Teste',
        })
        .expect(401);
    });
  });

  describe('Validação de dados', () => {
    it('deve aceitar coordenadas válidas', async () => {
      const localData = {
        name: 'Local com GPS',
        address: 'Rua GPS',
        latitude: -23.5505,
        longitude: -46.6333,
      };

      const response = await request(app)
        .post('/api/campaigns/locals')
        .set('Authorization', `Bearer ${authToken}`)
        .send(localData)
        .expect(201);

      expect(response.body.data.latitude).toBe(localData.latitude);
      expect(response.body.data.longitude).toBe(localData.longitude);
    });

    it('deve aceitar contato opcional', async () => {
      const localData = {
        name: 'Local Sem Telefone',
        address: 'Rua Teste',
      };

      const response = await request(app)
        .post('/api/campaigns/locals')
        .set('Authorization', `Bearer ${authToken}`)
        .send(localData)
        .expect(201);

      expect(response.body.data.contact).toBeNull();
    });

    it('deve retornar tipos de dados corretos', async () => {
      const response = await request(app)
        .get('/api/campaigns/locals')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      if (response.body.data.length > 0) {
        const local = response.body.data[0];
        expect(local).toHaveProperty('id');
        expect(typeof local.name).toBe('string');
        expect(typeof local.address).toBe('string');
        expect(typeof local.type).toBe('string');
      }
    });
  });
});
