const prisma = require('../prisma/prismaClient');
const conectaService = require('./conectaService');

/**
 * Sincroniza o saldo de capibas de um usuário com a API externa do Conecta.
 * @param {number} userId O ID do usuário no banco de dados local.
 * @param {string} accessToken O token de acesso JWT para autenticação na API externa.
 */
async function syncCapibas(userId, accessToken) {
  try {
    // Busca os dados do usuário na API externa
    const conectaUserData = await conectaService.getUserData(accessToken);

    // Verifica se o saldo (balance) foi retornado e é um número
    if (conectaUserData && typeof conectaUserData.balance === 'number') {
      // Atualiza o campo 'capibas' do usuário no banco de dados local
      await prisma.user.update({
        where: { id: userId },
        data: { capibas: conectaUserData.balance },
      });
      console.log(`Saldo de capibas do usuário ${userId} sincronizado para: ${conectaUserData.balance}`);
    } else {
      // Lança um erro se o saldo não for encontrado ou for inválido
      throw new Error('O campo "balance" não foi encontrado ou é inválido nos dados da API externa.');
    }
  } catch (error) {
    // Captura, loga e relança o erro para que a função chamadora possa tratá-lo
    console.error(`Erro ao sincronizar capibas para o usuário ${userId}:`, error.message);
    throw new Error('Falha ao sincronizar o saldo de capibas.');
  }
}

module.exports = {
  syncCapibas,
};