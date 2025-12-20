import { describe, it, expect, vi, beforeEach } from "vitest";
import { getDashboardStats } from "../../routes/controllers/dashboardController.js";

// Mock do Prisma
vi.mock("../../config/database.js", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
    },
    donation: {
      aggregate: vi.fn(),
      findFirst: vi.fn(),
      count: vi.fn(),
    },
  },
}));

import prisma from "../../config/database.js";

describe("DashboardController Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getDashboardStats", () => {
    it("deve retornar estatísticas do dashboard com sucesso", async () => {
      // Arrange
      const req = {
        user: { userId: "user-123" },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const mockUser = {
        genero: "M",
        birthDate: new Date("1990-01-01"),
        weight: 75,
        nome: "João Silva",
        email: "joao@example.com",
        phone: "11999999999",
        bloodType: "O+",
      };

      const mockLastDonation = {
        donationDate: new Date("2024-06-01"),
      };

      // Mocks
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.donation.aggregate.mockResolvedValue({
        _sum: { pointsEarned: 250 },
      });
      prisma.donation.findFirst.mockResolvedValue(mockLastDonation);
      prisma.donation.count
        .mockResolvedValueOnce(5) // donationCountLastYear
        .mockResolvedValueOnce(10) // totalDonationCount
        .mockResolvedValueOnce(2); // pendingCount

      // Act
      await getDashboardStats(req, res);

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "user-123" },
        select: {
          genero: true,
          birthDate: true,
          weight: true,
          nome: true,
          email: true,
          phone: true,
          bloodType: true,
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        capibasBalance: 250,
        lastDonationDate: mockLastDonation.donationDate,
        genero: "M",
        birthDate: mockUser.birthDate,
        weight: 75,
        donationCountLastYear: 5,
        nome: "João Silva",
        email: "joao@example.com",
        bloodType: "O+",
        telefone: "11999999999",
        doacoes: 10,
        pendingDonations: 2,
      });
    });

    it("deve retornar 404 quando usuário não existe", async () => {
      // Arrange
      const req = {
        user: { userId: "user-invalid" },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      // Mock: Usuário não encontrado
      prisma.user.findUnique.mockResolvedValue(null);

      // Act
      await getDashboardStats(req, res);

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Usuário não encontrado.",
      });
    });

    it("deve retornar 0 capibas quando não há doações confirmadas", async () => {
      // Arrange
      const req = {
        user: { userId: "user-123" },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const mockUser = {
        genero: "F",
        birthDate: null,
        weight: null,
        nome: "Maria",
        email: "maria@example.com",
        phone: null,
        bloodType: null,
      };

      // Mocks
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.donation.aggregate.mockResolvedValue({
        _sum: { pointsEarned: null }, // Sem pontos
      });
      prisma.donation.findFirst.mockResolvedValue(null); // Sem doações
      prisma.donation.count
        .mockResolvedValueOnce(0) // donationCountLastYear
        .mockResolvedValueOnce(0) // totalDonationCount
        .mockResolvedValueOnce(0); // pendingCount

      // Act
      await getDashboardStats(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          capibasBalance: 0,
          lastDonationDate: null,
          doacoes: 0,
          pendingDonations: 0,
        })
      );
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

      // Mock: Erro no findUnique
      prisma.user.findUnique.mockRejectedValue(new Error("Database error"));

      // Act
      await getDashboardStats(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erro ao buscar dados do dashboard",
        error: "Database error",
      });
    });
  });
});
