import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


function parseDate(dateString) {
  if (!dateString || typeof dateString !== 'string') return null;
  
  const parts = dateString.split('/');
  if (parts.length === 3) {

    const date = new Date(parts[2], parts[1] - 1, parts[0]);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
  }
  
  return null;
}



export const updateUserProfile = async (req, res) => {
  const userId = req.userData.userId;
  
  // 1. ADICIONAMOS 'genero' AQUI
  const { telefone, dataNascimento, tipoRed, peso, genero } = req.body;

  try {
    const dataParaAtualizar = {
      phone: telefone,
      bloodType: tipoRed,
      weight: peso ? parseFloat(peso) : null,
      birthDate: parseDate(dataNascimento),
      genero: genero // 2. ADICIONAMOS AO OBJETO DO PRISMA
    };

    const userAtualizado = await prisma.user.update({
      where: {
        id: userId,
      },
      data: dataParaAtualizar,
    });

    res.status(200).json({ 
      message: "Perfil atualizado com sucesso!",
      user: userAtualizado 
    });

  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).json({ message: "Erro ao atualizar perfil", error: error.message });
  }
};