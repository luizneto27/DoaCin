import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getLocalsCampaign = async (req, res) => {
  // Returns campaign locals. If ?campaignId= is provided, filter by it.
  // no campaignId filtering for now; can be extended with ?campaignId=

  try {
    const where = {};
    const locals = await prisma.pontoColeta.findMany({
      where,
      select: {
        id: true,
        nome: true,
        endereco: true,
        horarioAbertura: true,
        horarioFechamento: true,
        telefone: true,
        tipo: true,
      },
      orderBy: { nome: "asc" },
    });

    const normalized = locals.map((l) => ({
      id: l.id,
      name: l.nome,
      address: l.endereco,
      hours:
        l.horarioAbertura && l.horarioFechamento
          ? `${l.horarioAbertura} - ${l.horarioFechamento}`
          : l.horarioAbertura || l.horarioFechamento || "",
      contact: l.telefone || null,
      type: l.tipo || "fixed",
    }));

    return res.status(200).json({ data: normalized });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar locais da campanha",
      error: error.message,
    });
  }
};

export const createLocalCampaign = async (req, res) => {
  // Expects body: { name, address, hours, contact }
  const { name, address, hours, contact } = req.body;

  if (!name || !address) {
    return res
      .status(400)
      .json({ message: "Nome e endereço são obrigatórios" });
  }

  try {
    const created = await prisma.pontoColeta.create({
      data: {
        nome: name,
        endereco: address,
        horarioAbertura: hours || null,
        telefone: contact || null,
        tipo: "fixed",
      },
    });

    const normalized = {
      id: created.id,
      name: created.nome,
      address: created.endereco,
      hours:
        created.horarioAbertura && created.horarioFechamento
          ? `${created.horarioAbertura} - ${created.horarioFechamento}`
          : created.horarioAbertura || created.horarioFechamento || "",
      contact: created.telefone || null,
      type: created.tipo || "fixed",
    };
    return res.status(201).json({ data: normalized });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao criar local da campanha",
      error: error.message,
    });
  }
};

// melhorias que se aplicam a esse arquivo:

  // 1. filtragem por campaignId

  // 2. implementar checagem de role (ex.: apenas admins/gestores podem criar locais) ou um fluxo de aprovação para novos locais.

  // 3. separar horarioAbertura e horarioFechamento no backend para facilitar buscas e filtragens futuras