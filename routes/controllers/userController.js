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
  
  const { telefone, dataNascimento, tipoRed, peso } = req.body;

  try {
    // 3. Convertemos os dados para o formato do banco
    const dataParaAtualizar = {
      phone: telefone,
      bloodType: tipoRed,
      weight: peso ? parseFloat(peso) : null, 
      birthDate: parseDate(dataNascimento)   
    };

    // 4. Usamos o Prisma para atualizar o usuário
    const userAtualizado = await prisma.user.update({
      where: {
        id: userId,
      },
      data: dataParaAtualizar,
    });

    // 5. Enviamos a resposta de sucesso
    res.status(200).json({ 
      message: "Perfil atualizado com sucesso!",
      user: userAtualizado 
    });

  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).json({ message: "Erro ao atualizar perfil", error: error.message });
  }
};