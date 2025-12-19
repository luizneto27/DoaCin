import prisma from "../../config/database.js";
import conectaService from "../../services/conectaService.js";

async function registrarGamificacao(userCpf, latitude, longitude) {
  try {
    const CHALLENGE_ID = process.env.CONECTA_CHALLENGE_ID;
    const REQUIREMENT_ID = process.env.CONECTA_REQUIREMENT_ID;

    // Verifica se temos todos os dados necessários
    if (userCpf && CHALLENGE_ID && REQUIREMENT_ID && latitude != null && longitude != null) {
      console.log(`[GAMIFICAÇÃO] Iniciando check-in para CPF: ${userCpf} nas coordenadas (${latitude}, ${longitude})...`);

      // Endpoint baseado na documentação (Página 16 do PDF)
      // POST /api/check-in/location/challenge/{challengeId}/requirement/{requirementId}
      await conectaService.post(
        `/check-in/location/challenge/${CHALLENGE_ID}/requirement/${REQUIREMENT_ID}`,
        { 
          document: userCpf,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        }
      );

      console.log(`[GAMIFICAÇÃO] Sucesso! Pontos computados no Conecta.`);
      return true;
    } else {
      console.warn('[GAMIFICAÇÃO] Check-in ignorado: Faltou CPF, IDs de configuração ou coordenadas.');
      return false;
    }
  } catch (gamificationError) {
    console.error('[GAMIFICAÇÃO ERRO] Falha ao pontuar no sistema externo:', gamificationError.message);
    return false;
  }
}

// Histórico de Doações
export const getDonationHistory = async (req, res) => {
  const userId = req.user.userId;

  try {
    const donations = await prisma.donation.findMany({
      where: { userId: userId },
      orderBy: { donationDate: "desc" }, // ordena por data da doação, mais recente primeiro
      include: {
        pontoColeta: { select: { nome: true } },
      },
    });


    const formattedDonations = donations.map((donation) => {
      return {
        id: donation.id,
        donationDate: donation.donationDate,
        status: donation.status,
        pointsEarned: donation.pointsEarned,
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

// Criar Doação Manual
export const createDonation = async (req, res) => {
  const userId = req.user.userId;
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

export const confirmDonation = async (req, res) => {
  const userId = req.user.userId;

  try {
    // Buscar a doação pendente mais recente do usuário
    const pendingDonation = await prisma.donation.findFirst({
      where: {
        userId: userId,
        status: "pending",
      },
      orderBy: { createdAt: "desc" },
    });

    if (!pendingDonation) {
      return res.status(400).json({
        error:
          "Nenhuma doação pendente para confirmar. Registre uma doação primeiro.",
      });
    }

    // Atualizar a doação de 'pending' para 'confirmed'
    const confirmedDonation = await prisma.donation.update({
      where: { id: pendingDonation.id },
      data: {
        status: "confirmed",
        validatedByQR: true,
      },
      include: {
        pontoColeta: { select: { nome: true, latitude: true, longitude: true } },
        user: { select: { cpf: true } },
      },
    });

    // Registrar pontos no sistema de gamificação Conecta
    await registrarGamificacao(
      confirmedDonation.user.cpf,
      confirmedDonation.pontoColeta.latitude,
      confirmedDonation.pontoColeta.longitude
    );

    res.status(200).json({
      message: "Doação confirmada com sucesso!",
      donation: confirmedDonation,
    });
  } catch (error) {
    console.error("Erro ao confirmar doação:", error);
    res
      .status(500)
      .json({ error: "Erro interno do servidor ao confirmar a doação." });
  }
};
