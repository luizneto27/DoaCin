const api = require('./api');

class ConectaService {
  /**
   * Busca os dados do usuário autenticado na API.
   * @param {string} accessToken O token de acesso JWT.
   * @returns {Promise<object>} Retorna os dados do usuário, incluindo o saldo (balance).
   */
  async getUserData(accessToken) {
    try {
      const response = await api.get('/api/self', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário no Conecta:', error);
      throw new Error('Falha ao buscar dados do usuário no Conecta.');
    }
  }
}