import { PrismaClient } from '@prisma/client';
import conectaService from '../../services/conectaService.js';

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
      orderBy: { donationDate: 'desc' },
      include: {
        pontoColeta: { select: { nome: true } }
      }
    });

    const formattedDonations = donations.map(donation => {
      return {
        id: donation.id,
        donationDate: donation.donationDate,
        status: donation.status,
        pointsEarned: donation.pointsEarned,
        location: {
          name: donation.pontoColeta ? donation.pontoColeta.nome : 'Local não informado'
        }
      };
    });

    res.status(200).json(formattedDonations);
    
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar histórico de doações", error: error.message });
  }
};

// --- CONFIRMAR DOAÇÃO (Simulação via Botão QR Code) ---
export const confirmDonation = async (req, res) => {
  const userId = req.userData.userId;

  try {
    // 1. Pega um ponto de coleta qualquer para simular
    const ponto = await prisma.pontoColeta.findFirst();

    if (!ponto) {
      return res.status(400).json({ message: "Nenhum ponto de coleta encontrado para vincular a doação." });
    }

    // 2. Cria a doação local
    const newDonation = await prisma.donation.create({
      data: {
        userId: userId,
        pontoColetaId: ponto.id,
        donationDate: new Date(),
        status: 'confirmed',
        pointsEarned: 100,
        validatedByQR: true
      },
      include: { user: true } // Necessário para pegar o CPF
    });

    // 3. Chama a integração usando as coordenadas do ponto encontrado
    await registrarGamificacao(
      newDonation.user.cpf, 
      ponto.latitude, 
      ponto.longitude
    );

    res.status(201).json({ 
      message: "Doação confirmada com sucesso!", 
      donation: newDonation 
    });

  } catch (error) {
    console.error("Erro ao confirmar doação:", error);
    res.status(500).json({ message: "Erro ao confirmar doação", error: error.message });
  }
};