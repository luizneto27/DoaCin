import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getLocalsCampaign,
  createLocalCampaign,
} from "../../routes/controllers/campaignLocals.js";

// Mock do Prisma
vi.mock("../../config/database.js", () => ({
  default: {
    pontoColeta: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import prisma from "../../config/database.js";

describe("CampaignLocals Controller Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getLocalsCampaign", () => {
    it("deve retornar lista de locais de campanha", async () => {
      // Arrange
      const req = {};
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const mockLocals = [
        {
          id: "local-1",
          nome: "Hemope Recife",
          endereco: "Rua Joaquim Nabuco, 171",
          horarioAbertura: "08:00",
          horarioFechamento: "17:00",
          telefone: "8132224444",
          tipo: "fixed",
          latitude: -8.0476,
          longitude: -34.877,
          eventStartDate: null,
          eventEndDate: null,
        },
        {
          id: "local-2",
          nome: "Campanha Shopping",
          endereco: "Shopping Center",
          horarioAbertura: "10:00",
          horarioFechamento: "18:00",
          telefone: null,
          tipo: "mobile",
          latitude: -8.05,
          longitude: -34.88,
          eventStartDate: new Date("2024-06-01"),
          eventEndDate: new Date("2024-06-30"),
        },
      ];

      // Mock
      prisma.pontoColeta.findMany.mockResolvedValue(mockLocals);

      // Act
      await getLocalsCampaign(req, res);

      // Assert
      expect(prisma.pontoColeta.findMany).toHaveBeenCalledWith({
        where: {},
        select: {
          id: true,
          nome: true,
          endereco: true,
          horarioAbertura: true,
          horarioFechamento: true,
          telefone: true,
          tipo: true,
          latitude: true,
          longitude: true,
          eventStartDate: true,
          eventEndDate: true,
        },
        orderBy: { nome: "asc" },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: [
          {
            id: "local-1",
            name: "Hemope Recife",
            address: "Rua Joaquim Nabuco, 171",
            hours: "08:00 - 17:00",
            contact: "8132224444",
            type: "fixed",
            latitude: -8.0476,
            longitude: -34.877,
            eventStartDate: null,
            eventEndDate: null,
          },
          {
            id: "local-2",
            name: "Campanha Shopping",
            address: "Shopping Center",
            hours: "10:00 - 18:00",
            contact: null,
            type: "mobile",
            latitude: -8.05,
            longitude: -34.88,
            eventStartDate: new Date("2024-06-01"),
            eventEndDate: new Date("2024-06-30"),
          },
        ],
      });
    });

    it("deve retornar array vazio quando não há locais", async () => {
      // Arrange
      const req = {};
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      // Mock
      prisma.pontoColeta.findMany.mockResolvedValue([]);

      // Act
      await getLocalsCampaign(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: [] });
    });

    it("deve lidar com horários ausentes", async () => {
      // Arrange
      const req = {};
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const mockLocals = [
        {
          id: "local-1",
          nome: "Local sem horário",
          endereco: "Endereço",
          horarioAbertura: null,
          horarioFechamento: null,
          telefone: null,
          tipo: "fixed",
          latitude: null,
          longitude: null,
          eventStartDate: null,
          eventEndDate: null,
        },
      ];

      // Mock
      prisma.pontoColeta.findMany.mockResolvedValue(mockLocals);

      // Act
      await getLocalsCampaign(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        data: [
          expect.objectContaining({
            hours: "",
          }),
        ],
      });
    });

    it("deve retornar erro 500 em caso de falha", async () => {
      // Arrange
      const req = {};
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      // Mock: Erro
      prisma.pontoColeta.findMany.mockRejectedValue(
        new Error("Database error")
      );

      // Act
      await getLocalsCampaign(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erro ao buscar locais da campanha",
        error: "Database error",
      });
    });
  });

  describe("createLocalCampaign", () => {
    it("deve criar local de campanha com sucesso", async () => {
      // Arrange
      const req = {
        body: {
          name: "Novo Hemope",
          address: "Rua Nova, 123",
          hours: "08:00 - 16:00",
          contact: "8133334444",
          latitude: "-8.0500",
          longitude: "-34.8800",
          type: "fixed",
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const mockCreated = {
        id: "new-local-1",
        nome: "Novo Hemope",
        endereco: "Rua Nova, 123",
        horarioAbertura: "08:00",
        horarioFechamento: "16:00",
        telefone: "8133334444",
        tipo: "fixed",
        latitude: -8.05,
        longitude: -34.88,
        eventStartDate: null,
        eventEndDate: null,
      };

      // Mock
      prisma.pontoColeta.create.mockResolvedValue(mockCreated);

      // Act
      await createLocalCampaign(req, res);

      // Assert
      expect(prisma.pontoColeta.create).toHaveBeenCalledWith({
        data: {
          nome: "Novo Hemope",
          endereco: "Rua Nova, 123",
          horarioAbertura: "08:00",
          horarioFechamento: "16:00",
          telefone: "8133334444",
          tipo: "fixed",
          latitude: -8.05,
          longitude: -34.88,
          eventStartDate: null,
          eventEndDate: null,
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        data: {
          id: "new-local-1",
          name: "Novo Hemope",
          address: "Rua Nova, 123",
          hours: "08:00 - 16:00",
          contact: "8133334444",
          type: "fixed",
          latitude: -8.05,
          longitude: -34.88,
          eventStartDate: null,
          eventEndDate: null,
        },
      });
    });

    it("deve criar local móvel com datas de evento", async () => {
      // Arrange
      const req = {
        body: {
          name: "Campanha Mobile",
          address: "Praça Central",
          type: "mobile",
          eventStartDate: "2024-06-01",
          eventEndDate: "2024-06-30",
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const mockCreated = {
        id: "mobile-1",
        nome: "Campanha Mobile",
        endereco: "Praça Central",
        horarioAbertura: null,
        horarioFechamento: null,
        telefone: null,
        tipo: "mobile",
        latitude: null,
        longitude: null,
        eventStartDate: new Date("2024-06-01"),
        eventEndDate: new Date("2024-06-30"),
      };

      // Mock
      prisma.pontoColeta.create.mockResolvedValue(mockCreated);

      // Act
      await createLocalCampaign(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        data: expect.objectContaining({
          type: "mobile",
          eventStartDate: new Date("2024-06-01"),
          eventEndDate: new Date("2024-06-30"),
        }),
      });
    });

    it("deve retornar erro 400 sem nome", async () => {
      // Arrange
      const req = {
        body: {
          address: "Rua Nova, 123",
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      // Act
      await createLocalCampaign(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Nome e endereço são obrigatórios",
      });
    });

    it("deve retornar erro 400 sem endereço", async () => {
      // Arrange
      const req = {
        body: {
          name: "Novo Local",
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      // Act
      await createLocalCampaign(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Nome e endereço são obrigatórios",
      });
    });

    it("deve criar com dados mínimos (apenas nome e endereço)", async () => {
      // Arrange
      const req = {
        body: {
          name: "Local Mínimo",
          address: "Endereço Básico",
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const mockCreated = {
        id: "min-1",
        nome: "Local Mínimo",
        endereco: "Endereço Básico",
        horarioAbertura: null,
        horarioFechamento: null,
        telefone: null,
        tipo: "fixed",
        latitude: null,
        longitude: null,
        eventStartDate: null,
        eventEndDate: null,
      };

      // Mock
      prisma.pontoColeta.create.mockResolvedValue(mockCreated);

      // Act
      await createLocalCampaign(req, res);

      // Assert
      expect(prisma.pontoColeta.create).toHaveBeenCalledWith({
        data: {
          nome: "Local Mínimo",
          endereco: "Endereço Básico",
          horarioAbertura: null,
          horarioFechamento: null,
          telefone: null,
          tipo: "fixed",
          latitude: null,
          longitude: null,
          eventStartDate: null,
          eventEndDate: null,
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("deve retornar erro 500 em caso de falha", async () => {
      // Arrange
      const req = {
        body: {
          name: "Novo Local",
          address: "Endereço",
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      // Mock: Erro
      prisma.pontoColeta.create.mockRejectedValue(new Error("Database error"));

      // Act
      await createLocalCampaign(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erro ao criar local da campanha",
        error: "Database error",
      });
    });
  });
});
