import prisma from '../../config/database.js';

export const getDashboardStats = async (req, res) => {
  const userId = req.user.userId; 

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
        phone: true,      
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

    // 7. Contar doações pendentes
    const pendingDonations = await prisma.donation.count({
      where: {
        userId: userId,
        status: 'pending',
      },
    });

    // 8. Retornar todos os dados para o frontend
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
      doacoes: totalDonations,
      pendingDonations: pendingDonations
    });
    
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar dados do dashboard", error: error.message });
  }
};

// melhorias que se aplicam a esse arquivo:
  // 1.findFirst para lastDonation retorna todo o objeto — melhor selecionar apenas donationDate.

  // 2. Normalização e formatação de datas: Converter datas para ISO e/ou especificar timezone (ou adicionar campo lastDonationDateUtc) para evitar ambiguidade no frontend

  // 3. Paralelizar queries independentes: user, aggregate, lastDonation e count podem ser executados em paralelo (Promise.all) para reduzir latência total:
    // Ex.: fetchUserPromise + fetchAggregatePromise + fetchLastDonationPromise + fetchCountPromise.

  // 4. Revisar quais campos realmente precisam ser enviados (mostrar email/birthDate só quando necessário)