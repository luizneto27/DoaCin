import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDonationHistory = async (req, res) => {
  const userId = req.userData.userId; //vem do  authmiddleware

  try {
    const donations = await prisma.donation.findMany({
      where: { userId: userId }, // 
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

// melhorias que se aplicam a esse arquivo:
  // 1. Paginação: findMany retirna todas as doacoes.  Melhor usar select para limitar o que o banco retorna.
  // fintragem: Suportar query params para filtrar por status, intervalo de datas, pontoColetaId, e ordenação asc/desc.