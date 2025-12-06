import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDonationHistory = async (req, res) => {
  const userId = req.userData.userId; //vem do  authmiddleware

  try {
    const donations = await prisma.donation.findMany({
      where: { userId: userId },
      orderBy: { donationDate: "desc" }, // ordena por data da doação, mais recente primeiro
      include: {
        pontoColeta: { select: { nome: true } },
      },
    });

    //mapeando os dados para corresponder ao que o frontend espera (location.name)
    const formattedDonations = donations.map((donation) => {
      return {
        id: donation.id,
        donationDate: donation.donationDate,
        status: donation.status,
        pointsEarned: donation.pointsEarned,
        //propriedade 'location' que o frontend espera
        location: {
          name: donation.pontoColeta
            ? donation.pontoColeta.nome
            : "Local não informado",
        },
      };
    });

    res.status(200).json(formattedDonations);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar histórico de doações",
      error: error.message,
    });
  }
};

// --- Criar Doação Manual ---
export const createDonation = async (req, res) => {
  const userId = req.userData.userId;
  const { donationDate, hemocentro, observacoes } = req.body;

  try {
    // Validar campos obrigatórios
    if (!donationDate || !hemocentro) {
      return res
        .status(400)
        .json({ error: "Data da doação e hemocentro são obrigatórios" });
    }

    // Procurar o ponto de coleta pelo nome
    let pontoColeta = await prisma.pontoColeta.findFirst({
      where: {
        nome: {
          contains: hemocentro,
          mode: "insensitive",
        },
      },
    });

    // Se não encontrar, criar um novo ponto de coleta
    if (!pontoColeta) {
      pontoColeta = await prisma.pontoColeta.create({
        data: {
          nome: hemocentro,
          endereco: "Endereço não informado",
          tipo: "fixed",
        },
      });
    }

    // Criar a doação com status 'pending' até confirmação
    const newDonation = await prisma.donation.create({
      data: {
        userId: userId,
        pontoColetaId: pontoColeta.id,
        donationDate: new Date(donationDate),
        status: "pending",
        pointsEarned: 100, // 100 Capibas por doação
        validatedByQR: false,
      },
      include: {
        pontoColeta: { select: { nome: true } },
      },
    });

    // Formatar resposta
    const formattedDonation = {
      id: newDonation.id,
      donationDate: newDonation.donationDate,
      status: newDonation.status,
      pointsEarned: newDonation.pointsEarned,
      location: {
        name: newDonation.pontoColeta.nome,
      },
    };

    res.status(201).json(formattedDonation);
  } catch (error) {
    console.error("Erro ao criar doação:", error);
    res
      .status(500)
      .json({ error: "Erro ao registrar doação", message: error.message });
  }
};

// --- FUNÇÃO: Confirmar Doação via QR Code ---
export const confirmDonation = async (req, res) => {
  const userId = req.userData.userId;

  try {
    // 1. Buscar a primeira doação com status 'pending' do usuário
    const pendingDonation = await prisma.donation.findFirst({
      where: {
        userId: userId,
        status: "pending",
      },
      orderBy: { createdAt: "desc" }, // Pega a mais recente
    });

    if (!pendingDonation) {
      return res.status(400).json({
        error:
          "Nenhuma doação pendente para confirmar. Registre uma doação primeiro.",
      });
    }

    // 2. Atualizar a doação de 'pending' para 'confirmed'
    const confirmedDonation = await prisma.donation.update({
      where: { id: pendingDonation.id },
      data: {
        status: "confirmed",
        validatedByQR: true,
      },
      include: {
        pontoColeta: { select: { nome: true } },
      },
    });

    res.status(200).json({
      message: "Doação confirmada com sucesso!",
      donation: confirmedDonation,
    });
  } catch (error) {
    console.error("Erro ao confirmar doação:", error);
    res
      .status(500)
      .json({ error: "Erro ao confirmar doação", message: error.message });
  }
};
