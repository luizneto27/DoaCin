import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function registrarGamificacao(userCpf, latitude, longitude) {
  try {
    const CHALLENGE_ID = process.env.CONECTA_CHALLENGE_ID;
    const REQUIREMENT_ID = process.env.CONECTA_REQUIREMENT_ID;

    // Verifica se temos todos os dados necessários
    if (userCpf && CHALLENGE_ID && REQUIREMENT_ID && latitude != null && longitude != null) {
      console.log(`[GAMIFICAÇÃO] Iniciando check-in para CPF: ${userCpf} nas coordenadas (${latitude}, ${longitude})...`);

      await conectaService.post(
        `/check-in/location/challenge/${CHALLENGE_ID}/requirement/${REQUIREMENT_ID}`,
        { 
          document: userCpf,
          latitude: latitude,
          longitude: longitude
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
    if (gamificationError.response) {
      console.error('Detalhes do erro:', JSON.stringify(gamificationError.response.data, null, 2));
    }
    return false;
  }
}

// --- CRIAR DOAÇÃO (Formulário Manual) ---
export const createDonation = async (req, res) => {
  // CORREÇÃO: Pegar userId do token para segurança, em vez do body
  const userId = req.userData.userId; 
  const { pontoColetaId, donationDate } = req.body;

  try {
    // 1. Cria a doação local
    const newDonation = await prisma.donation.create({
      data: {
        userId: userId,
        pontoColetaId: pontoColetaId,
        donationDate: new Date(donationDate),
        status: 'confirmed', 
        pointsEarned: 10,
      },
      include: { 
        user: true,
        pontoColeta: true
      } 
    });

    // 2. Chama a integração
    await registrarGamificacao(
      newDonation.user.cpf,
      newDonation.pontoColeta.latitude,
      newDonation.pontoColeta.longitude
    );

    res.status(201).json({ 
      message: "Doação registrada com sucesso!", 
      donation: newDonation 
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao registrar doação.', error: error.message });
  }
};

// --- HISTÓRICO ---
export const getDonationHistory = async (req, res) => {
  const userId = req.userData.userId;

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
