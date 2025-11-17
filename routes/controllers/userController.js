import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Função para converter dd/mm/yyyy para o formato ISO (que o banco aceita)
function parseDate(dateString) {
  if (!dateString || typeof dateString !== 'string') return null;
  
  const parts = dateString.split('/');
  if (parts.length === 3) {
    // Formato: dia, mês, ano
    // Note: Mês no JavaScript é 0-11, por isso parts[1] - 1
    const date = new Date(parts[2], parts[1] - 1, parts[0]);
    // Checa se a data é válida
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
  }
  // Se o formato já for ISO ou inválido, retorna null ou a string (mas vamos forçar null)
  return null;
}

export const updateUserProfile = async (req, res) => {
  // 1. Pegamos o ID do usuário (que o authMiddleware nos deu)
  const userId = req.userData.userId;
  
  // 2. Pegamos os dados que o frontend enviou no "body"
  const { telefone, dataNascimento, tipoRed, peso } = req.body;

  try {
    // 3. Convertemos os dados para o formato do banco
    const dataParaAtualizar = {
      phone: telefone,
      bloodType: tipoRed,
      weight: peso ? parseFloat(peso) : null, // Converte peso para número
      birthDate: parseDate(dataNascimento)   // Converte a data
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
      user: userAtualizado // Opcional: enviar o usuário atualizado de volta
    });

  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).json({ message: "Erro ao atualizar perfil", error: error.message });
  }
};