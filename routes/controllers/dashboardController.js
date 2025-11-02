// Conteúdo para: routes/controllers/dashboardController.js

// 1. COMENTE A IMPORTAÇÃO DO PRISMA
// import { PrismaClient } from '../../src/generated/prisma/index.js';
// const prisma = new PrismaClient();

// 2. MODIFIQUE A FUNÇÃO
export const getDashboardStats = async (req, res) => {
  // const userId = req.userData.userId; 

  console.log('API /api/dashboard chamada (placeholder)');
  // 3. RETORNE UM JSON VAZIO OU DE EXEMPLO
  // O frontend não vai usar isso agora, mas impede que a API quebre.
  res.status(200).json({
    capibasBalance: 0,
    lastDonationDate: null
  });

  /*
  // O CÓDIGO DO PRISMA FICA COMENTADO:
  try {
    const { _sum } = await prisma.donation.aggregate({
      _sum: { pointsEarned: true },
      where: { userId: userId, status: 'confirmed' },
    });
    const capibasBalance = _sum.pointsEarned || 0;

    const lastDonation = await prisma.donation.findFirst({
      where: { userId: userId, status: 'confirmed' },
      orderBy: { donationDate: 'desc' },
    });

    res.status(200).json({
      capibasBalance: capibasBalance,
      lastDonationDate: lastDonation ? lastDonation.donationDate : null
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar dados do dashboard", error: error.message });
  }
  */
};