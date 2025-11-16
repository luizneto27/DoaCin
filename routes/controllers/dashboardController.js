import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getDashboardStats = async (req, res) => {
  const userId = req.userData.userId; 

  try {
    // 1. Buscar dados do usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        genero: true, 
        birthDate: true, 
        weight: true,
        nome: true,
        email: true,
        phone: true,      // <-- CORREÇÃO AQUI (era 'telefone')
        bloodType: true 
      }
    });

    // 2. Checar se o usuário existe
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // 3. Buscar dados de agregação de doação (pontos)
    const { _sum } = await prisma.donation.aggregate({
      _sum: { pointsEarned: true },
      where: { userId: userId, status: 'confirmed' },
    });

    const capibasBalance = _sum.pointsEarned || 0;

    // 4. Buscar última doação confirmada
    const lastDonation = await prisma.donation.findFirst({
      where: { userId: userId, status: 'confirmed' },
      orderBy: { donationDate: 'desc' },
    });

    // 5. Contar doações confirmadas no último ano
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

    // 6. Contar o TOTAL de doações (para o card da sidebar)
    const totalDonations = await prisma.donation.count({
      where: {
        userId: userId,
        status: 'confirmed',
      },
    });

    // 7. Retornar todos os dados para o frontend
    res.status(200).json({
      capibasBalance: capibasBalance,
      lastDonationDate: lastDonation ? lastDonation.donationDate : null,
      genero: user ? user.genero : null,
      birthDate: user ? user.birthDate : null,
      weight: user ? user.weight : null,
      donationCountLastYear: donationCountLastYear,
      nome: user ? user.nome : null,
      email: user ? user.email : null,
      bloodType: user ? user.bloodType : null,
      telefone: user ? user.phone : null, 
      doacoes: totalDonations
    });
    
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar dados do dashboard", error: error.message });
  }
};