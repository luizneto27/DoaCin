import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// -------------------------
// GET /api/donations  (Histórico de Doações)
// -------------------------
export const getDonationHistory = async (req, res) => {
  const userId = req.userData.userId; // vem do authMiddleware

  try {
    const donations = await prisma.donation.findMany({
      where: { userId },
      orderBy: { donationDate: 'desc' },
      include: {
        pontoColeta: { select: { nome: true } }
      }
    });

    const formattedDonations = donations.map(donation => ({
      id: donation.id,
      donationDate: donation.donationDate,
      status: donation.status,
      pointsEarned: donation.pointsEarned,
      location: {
        name: donation.pontoColeta?.nome || 'Local não informado'
      }
    }));

    res.status(200).json(formattedDonations);

  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar histórico de doações",
      error: error.message
    });
  }
};

// -------------------------
// POST /api/donations/confirm  (Confirmação via QR Code)
// -------------------------
export const confirmDonation = async (req, res) => {
  try {
    const { donationId } = req.body; // o app envia o ID da doação lido pelo QR

    if (!donationId) {
      return res.status(400).json({ message: "donationId é obrigatório" });
    }

    // Atualiza doação para "confirmed"
    const updated = await prisma.donation.update({
      where: { id: donationId },
      data: {
        status: "confirmed",
        validatedByQR: true,
        pointsEarned: 10  // exemplo: dar 10 pontos
      }
    });

    return res.status(200).json({
      message: "Doação confirmada com sucesso!",
      donation: updated
    });

  } catch (error) {
    return res.status(500).json({
      message: "Erro ao confirmar doação",
      error: error.message
    });
  }
};

// Novo: POST /api/donations  → Criar uma nova doação
export const createDonation = async (req, res) => {
  try {
    const userId = req.userData?.userId;
    if (!userId || typeof userId !== "string") {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const { donationDate, hemocentro, observacoes, pontoColetaId } = req.body ?? {};

    // Determinar pontoColetaId como antes...
    let pontoId = pontoColetaId || null;

    if (!pontoId && hemocentro) {
      const existing = await prisma.pontoColeta.findFirst({
        where: { nome: hemocentro }
      });
      if (existing) {
        pontoId = existing.id;
      } else {
        const createdPonto = await prisma.pontoColeta.create({
          data: {
            nome: hemocentro,
            endereco: hemocentro || "",
          }
        });
        pontoId = createdPonto.id;
      }
    }

    if (!pontoId) {
      // cria um ponto genérico para satisfazer a FK (evita erro de not-null)
      const generic = await prisma.pontoColeta.create({
        data: {
          nome: "Local não informado",
          endereco: "",
        }
      });
      pontoId = generic.id;
    }

    // Valida e normaliza
    const parsedDate = donationDate ? new Date(donationDate) : new Date();
    if (!(parsedDate instanceof Date) || isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Data da doação inválida" });
    }
    if (typeof pontoId !== "string" || pontoId.trim() === "") {
      return res.status(400).json({ message: "pontoColetaId inválido" });
    }

    // Constrói objeto limpo apenas com campos permitidos (chaves garantidas)
    const dataToCreate = {
      ['userId']: String(userId),
      ['pontoColetaId']: String(pontoId),
      donationDate: parsedDate,
      hemocentro: hemocentro ? String(hemocentro) : null,
      observacoes: observacoes ? String(observacoes) : null,
      status: "pending",
      pointsEarned: 0,
      validatedByQR: false,
    };

    // Log para depuração (mostra chaves exatas e tipos)
    console.log(">>> createDonation payload keys:", Object.keys(dataToCreate));
    console.log(
      ">>> createDonation payload types:",
      Object.fromEntries(Object.entries(dataToCreate).map(([k, v]) => [k, v === null ? "null" : typeof v]))
    );
    console.log(">>> donationDate ISO:", dataToCreate.donationDate.toISOString());

    const newDonation = await prisma.donation.create({
      data: dataToCreate,
      include: { pontoColeta: { select: { nome: true } } },
    });

    const response = {
      id: newDonation.id,
      donationDate: newDonation.donationDate,
      status: newDonation.status,
      pointsEarned: newDonation.pointsEarned,
      location: { name: newDonation.pontoColeta?.nome || newDonation.hemocentro || "Local não informado" }
    };

    return res.status(201).json(response);

  } catch (error) {
    console.error("Erro ao criar doação (createDonation):", error);
    return res.status(500).json({
      message: "Erro ao criar doação",
      error: error.message || String(error)
    });
  }
};
