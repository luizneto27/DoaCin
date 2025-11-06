import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getDashboardStats = async (req, res) => {
  const userId = req.userData.userId; 

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
};