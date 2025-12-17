import prisma from "../../config/database.js";

export const getLocalsCampaign = async (req, res) => {
  // Retorna os locais.
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
        latitude: true, 
        longitude: true,
        eventStartDate: true, 
        eventEndDate: true,
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
      latitude: l.latitude,
      longitude: l.longitude,
      
      eventStartDate: l.eventStartDate,
      eventEndDate: l.eventEndDate,
      // --------------------------------
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

  const { name, address, hours, contact, latitude, longitude, type, eventStartDate, eventEndDate } = req.body;

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
        horarioAbertura: hours ? hours.split(' - ')[0] : null,
        horarioFechamento: hours ? hours.split(' - ')[1] : null,
        telefone: contact || null,
        tipo: type || "fixed",
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        

        eventStartDate: eventStartDate ? new Date(eventStartDate) : null,
        eventEndDate: eventEndDate ? new Date(eventEndDate) : null,
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
      latitude: created.latitude,
      longitude: created.longitude,
    
      eventStartDate: created.eventStartDate,
      eventEndDate: created.eventEndDate,
    };
    return res.status(201).json({ data: normalized });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao criar local da campanha",
      error: error.message,
    });
  }
};