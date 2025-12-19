// Helpers úteis para testes de integração

/**
 * Cria um usuário de teste e retorna dados + token
 */
export async function createTestUser(app, request, userData = {}) {
  const defaultData = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    cpf: String(Math.floor(Math.random() * 100000000000)),
    password: 'senha123',
    phone: '81999999999',
    ...userData
  };

  const response = await request(app)
    .post('/api/auth/register')
    .send(defaultData);

  return {
    user: response.body.user,
    token: response.body.token,
    credentials: defaultData
  };
}

/**
 * Cria uma campanha de teste
 */
export async function createTestCampaign(prisma, campaignData = {}) {
  const defaultData = {
    name: 'Campanha Teste',
    description: 'Descrição da campanha de teste',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true,
    ...campaignData
  };

  return await prisma.campaign.create({
    data: defaultData
  });
}

/**
 * Cria uma doação de teste
 */
export async function createTestDonation(prisma, userId, campaignId, donationData = {}) {
  const defaultData = {
    userId,
    campaignId,
    localId: 1,
    quantity: 1,
    date: new Date(),
    ...donationData
  };

  return await prisma.donation.create({
    data: defaultData
  });
}

/**
 * Gera CPF válido para testes
 */
export function generateValidCPF() {
  const randomDigits = () => Math.floor(Math.random() * 10);
  let cpf = '';
  for (let i = 0; i < 11; i++) {
    cpf += randomDigits();
  }
  return cpf;
}

/**
 * Aguarda um tempo específico (útil para testar cooldowns)
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Extrai token de resposta de autenticação
 */
export function extractToken(response) {
  return response.body.token || 
         response.headers.authorization?.replace('Bearer ', '') ||
         null;
}
