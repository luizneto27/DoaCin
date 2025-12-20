import { describe, it, expect, vi, beforeEach } from 'vitest';
import { register } from '../../routes/controllers/authController.js';

// Mock do Prisma
vi.mock('../../config/database.js', () => ({
  default: {
    user: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
}));

// Mock do bcrypt
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
  },
}));

// Mock do jwt (se usado, mas no register não é)
vi.mock('jsonwebtoken', () => ({
  default: {},
}));

import prisma from '../../config/database.js';
import bcrypt from 'bcryptjs';

describe('AuthController Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('deve registrar um usuário com sucesso', async () => {
      // Arrange
      const req = {
        body: {
          nome: 'João Silva',
          email: 'joao@example.com',
          cpf: '12345678901',
          password: 'senha123',
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      // Mocks
      prisma.user.findFirst.mockResolvedValue(null); // Usuário não existe
      bcrypt.hash.mockResolvedValue('hashedPassword');
      prisma.user.create.mockResolvedValue({
        id: '1',
        nome: 'João Silva',
        email: 'joao@example.com',
        cpf: '12345678901',
        password: 'hashedPassword',
      });

      // Act
      await register(req, res);

      // Assert
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [{ email: 'joao@example.com' }, { cpf: '12345678901' }],
        },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('senha123', 12);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          nome: 'João Silva',
          email: 'joao@example.com',
          cpf: '12345678901',
          password: 'hashedPassword',
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Usuário registrado com sucesso!' });
    });

    it('deve retornar erro se usuário já existe', async () => {
      // Arrange
      const req = {
        body: {
          nome: 'João Silva',
          email: 'joao@example.com',
          cpf: '12345678901',
          password: 'senha123',
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      // Mock: Usuário já existe
      prisma.user.findFirst.mockResolvedValue({ id: '1', email: 'joao@example.com' });

      // Act
      await register(req, res);

      // Assert
      expect(prisma.user.findFirst).toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(prisma.user.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Usuário já cadastrado' });
    });

    it('deve retornar erro 500 em caso de falha', async () => {
      // Arrange
      const req = {
        body: {
          nome: 'João Silva',
          email: 'joao@example.com',
          cpf: '12345678901',
          password: 'senha123',
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      // Mock: Erro no findFirst
      prisma.user.findFirst.mockRejectedValue(new Error('DB Error'));

      // Act
      await register(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Erro ao registrar usuário',
        error: 'DB Error',
      });
    });
  });
});