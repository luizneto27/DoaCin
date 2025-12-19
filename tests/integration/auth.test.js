import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from './testApp.js';
import { prisma } from './setup.js';

describe('Auth Integration Tests', () => {
  // Limpa usuários antes de cada teste
  beforeEach(async () => {
    // Limpa na ordem correta (tabelas dependentes primeiro)
    await prisma.donation.deleteMany();
    await prisma.agendamento.deleteMany();
    await prisma.userQuizAttempt.deleteMany();
    await prisma.user.deleteMany();
    await prisma.pontoColeta.deleteMany();
  });

  describe('POST /api/auth/register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      const userData = {
        nome: 'João Silva',
        email: 'joao@example.com',
        cpf: '12345678901',
        password: 'senha123',
        phone: '81999999999'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Verifica resposta (API retorna message, não token no registro)
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Usuário registrado com sucesso!');

      // Verifica no banco de dados
      const userInDb = await prisma.user.findUnique({
        where: { email: userData.email.toLowerCase() }
      });
      expect(userInDb).toBeTruthy();
      expect(userInDb.nome).toBe(userData.nome);
      // Verifica se a senha está criptografada (hash bcrypt começa com $2b$)
      expect(userInDb.password).toMatch(/^\$2[aby]\$/);
      expect(userInDb.password).not.toBe(userData.password); // Não deve ser texto puro
    });

    it('não deve permitir registro com email duplicado', async () => {
      const userData = {
        nome: 'Maria Santos',
        email: 'maria@example.com',
        cpf: '98765432100',
        password: 'senha123',
        phone: '81988888888'
      };

      // Primeiro registro
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Tentativa de registro duplicado com CPF diferente
      const duplicateData = {
        ...userData,
        cpf: '11111111111' // CPF diferente
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(duplicateData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('já cadastrado');
    });
  });

  describe('POST /api/auth/login', () => {
    it('deve fazer login com credenciais válidas', async () => {
      // Cria usuário primeiro
      const userData = {
        nome: 'Ana Costa',
        email: 'ana@example.com',
        cpf: '11122233344',
        password: 'senha123',
        phone: '81977777777'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Tenta fazer login
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(userData.email);
    });

    it('não deve fazer login com senha incorreta', async () => {
      // Cria usuário
      const userData = {
        nome: 'Carlos Lima',
        email: 'carlos@example.com',
        cpf: '55566677788',
        password: 'senhaCorreta',
        phone: '81966666666'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Tenta login com senha errada
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: 'senhaErrada'
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('inválidos');
    });

    it('não deve fazer login com email não cadastrado', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'naoexiste@example.com',
          password: 'qualquersenha'
        })
        .expect(401); // API retorna 401 por segurança (não revela se email existe)

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('inválidos');
    });
  });
});
