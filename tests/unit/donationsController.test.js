import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getDonationHistory,
  createDonation,
} from "../../routes/controllers/donationsController.js";

// Mock do Prisma
vi.mock("../../config/database.js", () => ({
  default: {
    donation: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
    pontoColeta: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
}));

// Mock do ConectaService
vi.mock("../../services/conectaService.js", () => ({
  default: {
    post: vi.fn(),
  },
}));

import prisma from "../../config/database.js";

describe("DonationsController Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getDonationHistory", () => {
    it("deve retornar histórico de doações do usuário", async () => {
      // Arrange
      const req = {
        user: { userId: "user-123" },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const mockDonations = [
        {
          id: "donation-1",
          donationDate: new Date("2024-06-01"),
          status: "confirmed",
          pointsEarned: 100,
          pontoColeta: { nome: "Hemope Recife" },
        },
        {
          id: "donation-2",
          donationDate: new Date("2024-03-15"),
          status: "pending",
          pointsEarned: 0,
          pontoColeta: { nome: "Hemocentro Centro" },
        },
      ];

      // Mock
      prisma.donation.findMany.mockResolvedValue(mockDonations);

      // Act
      await getDonationHistory(req, res);

      // Assert
      expect(prisma.donation.findMany).toHaveBeenCalledWith({
        where: { userId: "user-123" },
        orderBy: { donationDate: "desc" },
        include: {
          pontoColeta: { select: { nome: true } },
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        {
          id: "donation-1",
          donationDate: new Date("2024-06-01"),
          status: "confirmed",
          pointsEarned: 100,
          location: { name: "Hemope Recife" },
        },
        {
          id: "donation-2",
          donationDate: new Date("2024-03-15"),
          status: "pending",
          pointsEarned: 0,
          location: { name: "Hemocentro Centro" },
        },
      ]);
    });

    it("deve retornar array vazio quando não há doações", async () => {
      // Arrange
      const req = {
        user: { userId: "user-123" },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      // Mock
      prisma.donation.findMany.mockResolvedValue([]);

      // Act
      await getDonationHistory(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('deve retornar "Local não informado" quando não há pontoColeta', async () => {
      // Arrange
      const req = {
        user: { userId: "user-123" },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const mockDonations = [
        {
          id: "donation-1",
          donationDate: new Date("2024-06-01"),
          status: "confirmed",
          pointsEarned: 100,
          pontoColeta: null,
        },
      ];

      // Mock
      prisma.donation.findMany.mockResolvedValue(mockDonations);

      // Act
      await getDonationHistory(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith([
        expect.objectContaining({
          location: { name: "Local não informado" },
        }),
      ]);
    });

    it("deve retornar erro 500 em caso de falha", async () => {
      // Arrange
      const req = {
        user: { userId: "user-123" },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      // Mock: Erro
      prisma.donation.findMany.mockRejectedValue(new Error("Database error"));

      // Act
      await getDonationHistory(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erro ao buscar histórico de doações",
        error: "Database error",
      });
    });
  });

  describe("createDonation", () => {
    it("deve criar uma doação com sucesso", async () => {
      // Arrange
      const req = {
        user: { userId: "user-123" },
        body: {
          donationDate: "2024-06-15",
          hemocentro: "Hemope Recife",
          observacoes: "Primeira doação",
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const mockPontoColeta = {
        id: "ponto-1",
        nome: "Hemope Recife",
      };

      const mockDonation = {
        id: "donation-1",
        userId: "user-123",
        pontoColetaId: "ponto-1",
        donationDate: new Date("2024-06-15"),
        status: "pending",
        pointsEarned: 100,
        pontoColeta: { nome: "Hemope Recife" },
      };

      // Mocks
      prisma.pontoColeta.findFirst.mockResolvedValue(mockPontoColeta);
      prisma.donation.create.mockResolvedValue(mockDonation);

      // Act
      await createDonation(req, res);

      // Assert
      expect(prisma.pontoColeta.findFirst).toHaveBeenCalledWith({
        where: {
          nome: {
            contains: "Hemope Recife",
            mode: "insensitive",
          },
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "donation-1",
          status: "pending",
          pointsEarned: 100,
        })
      );
    });

    it("deve criar ponto de coleta se não existir", async () => {
      // Arrange
      const req = {
        user: { userId: "user-123" },
        body: {
          donationDate: "2024-06-15",
          hemocentro: "Novo Hemocentro",
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const mockNewPontoColeta = {
        id: "ponto-new",
        nome: "Novo Hemocentro",
      };

      const mockDonation = {
        id: "donation-1",
        userId: "user-123",
        pontoColetaId: "ponto-new",
        donationDate: new Date("2024-06-15"),
        status: "pending",
        pointsEarned: 100,
        pontoColeta: { nome: "Novo Hemocentro" },
      };

      // Mocks
      prisma.pontoColeta.findFirst.mockResolvedValue(null); // Não encontra
      prisma.pontoColeta.create.mockResolvedValue(mockNewPontoColeta);
      prisma.donation.create.mockResolvedValue(mockDonation);

      // Act
      await createDonation(req, res);

      // Assert
      expect(prisma.pontoColeta.create).toHaveBeenCalledWith({
        data: {
          nome: "Novo Hemocentro",
          endereco: "Endereço não informado",
          tipo: "fixed",
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("deve retornar erro 400 sem data da doação", async () => {
      // Arrange
      const req = {
        user: { userId: "user-123" },
        body: {
          hemocentro: "Hemope Recife",
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      // Act
      await createDonation(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Data da doação e hemocentro são obrigatórios",
      });
    });

    it("deve retornar erro 400 sem hemocentro", async () => {
      // Arrange
      const req = {
        user: { userId: "user-123" },
        body: {
          donationDate: "2024-06-15",
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      // Act
      await createDonation(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Data da doação e hemocentro são obrigatórios",
      });
    });

    it("deve retornar erro 500 em caso de falha", async () => {
      // Arrange
      const req = {
        user: { userId: "user-123" },
        body: {
          donationDate: "2024-06-15",
          hemocentro: "Hemope Recife",
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      // Mock: Erro
      prisma.pontoColeta.findFirst.mockRejectedValue(
        new Error("Database error")
      );

      // Act
      await createDonation(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erro ao registrar doação",
        message: "Database error",
      });
    });
  });
});
