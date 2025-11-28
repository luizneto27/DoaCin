import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDonationHistory = async (req, res) => {
  const userId = req.userData.userId; //vem do  authmiddleware

  try {
    const donations = await prisma.donation.findMany({
      where: { userId: userId }, 
      orderBy: { donationDate: 'desc' }, // ordena por data da doação, mais recente primeiro
      include: {
        pontoColeta: { select: { nome: true } }
      }
    });

    //mapeando os dados para corresponder ao que o frontend espera (location.name)
    const formattedDonations = donations.map(donation => {
      return {
        id: donation.id,
        donationDate: donation.donationDate,
        status: donation.status,
        pointsEarned: donation.pointsEarned,
        //propriedade 'location' que o frontend espera
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

// --- NOVA FUNÇÃO: Confirmar Doação (Simulação via QR Code) ---
export const confirmDonation = async (req, res) => {
  const userId = req.userData.userId;

  try {
    // 1. Para simular, pegamos o primeiro Ponto de Coleta disponível no banco
    // Na vida real, o QR Code conteria o ID específico do local
    const ponto = await prisma.pontoColeta.findFirst();

    if (!ponto) {
      return res.status(400).json({ message: "Nenhum ponto de coleta encontrado para vincular a doação." });
    }

    // 2. Criar a doação já com status 'confirmed' e os pontos
    const newDonation = await prisma.donation.create({
      data: {
        userId: userId,
        pontoColetaId: ponto.id,
        donationDate: new Date(),
        status: 'confirmed',
        pointsEarned: 100, // Valor fixo de recompensa
        validatedByQR: true
      }
    });

    res.status(201).json({ 
      message: "Doação confirmada com sucesso!", 
      donation: newDonation 
    });

  } catch (error) {
    console.error("Erro ao confirmar doação:", error);
    res.status(500).json({ message: "Erro ao confirmar doação", error: error.message });
  }
};