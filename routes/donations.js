import express from 'express';
import { PrismaClient } from '@prisma/client';
import authenticateUser from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/donations - Buscar doações do usuário logado
router.get('/', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id; // ID do usuário vem do middleware de auth

    const donations = await prisma.donation.findMany({
      where: {
        userId: userId
      },
      include: {
        location: true, // Inclui dados do hemocentro/local
      },
      orderBy: {
        donationDate: 'desc'
      }
    });

    res.json(donations);
  } catch (error) {
    console.error('Erro ao buscar doações:', error);
    res.status(500).json({ error: 'Erro ao buscar doações' });
  }
});

// POST /api/donations - Criar nova doação
router.post('/', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id; // ID do usuário vem do middleware de auth
    const { donationDate, hemocentro, observacoes } = req.body;

    // Validação dos campos obrigatórios
    if (!donationDate) {
      return res.status(400).json({ error: 'Data da doação é obrigatória' });
    }

    if (!hemocentro || !hemocentro.trim()) {
      return res.status(400).json({ error: 'Hemocentro é obrigatório' });
    }

    // Criar a doação no banco de dados
    const newDonation = await prisma.donation.create({
      data: {
        userId: req.user.id, // ← do token JWT
        donationDate: new Date(donationDate),
        hemocentro: hemocentro.trim(),
        observacoes: observacoes?.trim() || null,
        status: 'pendente',
        pointsEarned: 0,
      }
    });

    res.status(201).json(newDonation);
  } catch (error) {
    console.error('Erro ao criar doação:', error);
    res.status(500).json({ error: 'Erro ao criar doação' });
  }
});

// PUT /api/donations/:id - Atualizar status da doação (para validação pelo hemocentro)
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, pointsEarned } = req.body;
    const userId = req.user.id;

    // Verificar se a doação pertence ao usuário
    const donation = await prisma.donation.findFirst({
      where: {
        id: parseInt(id),
        userId: userId
      }
    });

    if (!donation) {
      return res.status(404).json({ error: 'Doação não encontrada' });
    }

    // Atualizar a doação
    const updatedDonation = await prisma.donation.update({
      where: { id: parseInt(id) },
      data: {
        status: status || donation.status,
        pointsEarned: pointsEarned || donation.pointsEarned,
      },
      include: {
        location: true,
      }
    });

    res.json(updatedDonation);
  } catch (error) {
    console.error('Erro ao atualizar doação:', error);
    res.status(500).json({ error: 'Erro ao atualizar doação' });
  }
});

export default router;

// Código do lado do cliente para criar uma nova doação
authFetch("/api/donations", {
  method: "POST",
  body: JSON.stringify({
    donationDate: "2025-12-02",
    hemocentro: "Hemocentro ABC",
    observacoes: "Primeira doação"
  })
})