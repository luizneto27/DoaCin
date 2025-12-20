import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateUserProfile } from "../../routes/controllers/userController.js";

// Mock do Prisma
vi.mock("../../config/database.js", () => ({
  default: {
    user: {
      update: vi.fn(),
    },
  },
}));

import prisma from "../../config/database.js";

describe("UserController Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("updateUserProfile", () => {
    it("deve atualizar o perfil do usuário com sucesso", async () => {
      // Arrange
      const req = {
        user: { userId: "user-123" },
        body: {
          telefone: "11999999999",
          dataNascimento: "15/05/1990",
          tipoRed: "O+",
          peso: "75",
          genero: "M",
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const mockUpdatedUser = {
        id: "user-123",
        phone: "11999999999",
        birthDate: new Date("1990-05-15"),
        bloodType: "O+",
        weight: 75,
        genero: "M",
      };

      // Mock
      prisma.user.update.mockResolvedValue(mockUpdatedUser);

      // Act
      await updateUserProfile(req, res);

      // Assert
      const callArgs = prisma.user.update.mock.calls[0][0];
      expect(callArgs.where).toEqual({ id: "user-123" });
      expect(callArgs.data.phone).toBe("11999999999");
      expect(callArgs.data.bloodType).toBe("O+");
      expect(callArgs.data.weight).toBe(75);
      expect(callArgs.data.genero).toBe("M");
      // Verifica se a data foi convertida (sem verificar timezone exato)
      expect(callArgs.data.birthDate).toContain("1990-05-15");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Perfil atualizado com sucesso!",
        user: mockUpdatedUser,
      });
    });

    it("deve aceitar campos nulos ou vazios", async () => {
      // Arrange
      const req = {
        user: { userId: "user-123" },
        body: {
          telefone: null,
          dataNascimento: "",
          tipoRed: null,
          peso: null,
          genero: null,
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const mockUpdatedUser = {
        id: "user-123",
        phone: null,
        birthDate: null,
        bloodType: null,
        weight: null,
        genero: null,
      };

      // Mock
      prisma.user.update.mockResolvedValue(mockUpdatedUser);

      // Act
      await updateUserProfile(req, res);

      // Assert
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-123" },
        data: {
          phone: null,
          bloodType: null,
          weight: null,
          birthDate: null,
          genero: null,
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("deve converter peso string para número", async () => {
      // Arrange
      const req = {
        user: { userId: "user-123" },
        body: {
          peso: "80.5",
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const mockUpdatedUser = { id: "user-123", weight: 80.5 };

      // Mock
      prisma.user.update.mockResolvedValue(mockUpdatedUser);

      // Act
      await updateUserProfile(req, res);

      // Assert
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-123" },
        data: expect.objectContaining({
          weight: 80.5,
        }),
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("deve processar data no formato DD/MM/YYYY", async () => {
      // Arrange
      const req = {
        user: { userId: "user-123" },
        body: {
          dataNascimento: "25/12/1995",
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const mockUpdatedUser = {
        id: "user-123",
        birthDate: new Date("1995-12-25"),
      };

      // Mock
      prisma.user.update.mockResolvedValue(mockUpdatedUser);

      // Act
      await updateUserProfile(req, res);

      // Assert
      const callArgs = prisma.user.update.mock.calls[0][0];
      const birthDateArg = callArgs.data.birthDate;

      // Verifica se a data foi convertida corretamente
      expect(new Date(birthDateArg).getFullYear()).toBe(1995);
      expect(new Date(birthDateArg).getMonth()).toBe(11); // Dezembro é mês 11
      expect(new Date(birthDateArg).getDate()).toBe(25);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("deve retornar erro 500 em caso de falha", async () => {
      // Arrange
      const req = {
        user: { userId: "user-123" },
        body: {
          telefone: "11999999999",
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      // Mock: Erro no update
      prisma.user.update.mockRejectedValue(new Error("Database error"));

      // Spy no console.error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Act
      await updateUserProfile(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erro ao atualizar perfil",
        error: "Database error",
      });
      expect(consoleErrorSpy).toHaveBeenCalled();

      // Restore
      consoleErrorSpy.mockRestore();
    });
  });
});
