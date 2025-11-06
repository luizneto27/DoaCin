import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getDonationHistory = async (req, res) => {
  const userId = req.userData.userId; //vem do  authmiddleware

  try {
    const donations = await prisma.donation.findMany({
      where: { userId: userId },
      orderBy: { donationDate: 'desc' },
      include: {
        pontoColeta: { select: { name: true } }
      }
    });

    //mapeando os dados para corresponder ao que o frontend espera (location.name)
    const formattedDonations = donations.map(d => ({
      ...d,
      location: { name: d.pontoColeta.nome } 
    }));

    res.status(200).json(formattedDonations);
    
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar histórico de doações", error: error.message });
  }

};