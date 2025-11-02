// Conteúdo para: routes/controllers/donationsController.js

// 1. COMENTE A IMPORTAÇÃO DO PRISMA
// import { PrismaClient } from '../../src/generated/prisma/index.js';
// const prisma = new PrismaClient();

// 2. MODIFIQUE A FUNÇÃO
export const getDonationHistory = async (req, res) => {
  // const userId = req.userData.userId; 

  console.log('API /api/donations chamada (placeholder)');
  // 3. RETORNE UM ARRAY VAZIO
  res.status(200).json([]);

  /*
  // O CÓDIGO DO PRISMA FICA COMENTADO:
  try {
    const donations = await prisma.donation.findMany({
      where: { userId: userId },
      orderBy: { donationDate: 'desc' },
      include: {
        location: { select: { name: true } }
      }
    });
    
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar histórico de doações", error: error.message });
  }
  */
};