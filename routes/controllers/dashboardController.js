import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getDashboardStats = async (req, res) => {
  const userId = req.userData.userId; 

  try {
    // 1. Buscar dados do usuário (gênero, peso, data de nascimento)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { genero: true, birthDate: true, weight: true }
    });

    // 2. Buscar dados de agregação de doação (pontos)
    const { _sum } = await prisma.donation.aggregate({
      _sum: { pointsEarned: true },
      where: { userId: userId, status: 'confirmed' },
    });

    const capibasBalance = _sum.pointsEarned || 0;

    // 3. Buscar última doação confirmada
    const lastDonation = await prisma.donation.findFirst({
      where: { userId: userId, status: 'confirmed' },
      orderBy: { donationDate: 'desc' },
    });

    // 4. Contar doações confirmadas no último ano
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const donationCountLastYear = await prisma.donation.count({
      where: {
        userId: userId,
        status: 'confirmed',
        donationDate: {
          gte: oneYearAgo,
        },
      },
    });

    // 5. Retornar todos os dados para o frontend
    res.status(200).json({
      capibasBalance: capibasBalance,
      lastDonationDate: lastDonation ? lastDonation.donationDate : null,
      genero: user ? user.genero : null,
      birthDate: user ? user.birthDate : null,
      weight: user ? user.weight : null,
      donationCountLastYear: donationCountLastYear,
    });
    
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar dados do dashboard", error: error.message });
  }
};