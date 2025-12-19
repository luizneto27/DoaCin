import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega variáveis de ambiente do arquivo .env.test
dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

// Importação dinâmica do Prisma para garantir que as variáveis estejam carregadas
const { PrismaClient } = await import('@prisma/client');

// Instância global do Prisma para testes - passando a URL diretamente
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://test_user:test_pass@localhost:5433/doacin_test',
    },
  },
});

// Limpa o banco de dados antes de cada suite de testes
export async function cleanDatabase() {
  // Remove registros respeitando as foreign keys
  await prisma.$transaction([
    prisma.donation.deleteMany(),
    prisma.agendamento.deleteMany(),
    prisma.userQuizAttempt.deleteMany(),
    prisma.pontoColeta.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}

// Configura ambiente antes de executar todos os testes
beforeAll(async () => {
  console.log('Configurando ambiente de testes...');
  await cleanDatabase();
});

// Limpa ambiente após execução de todos os testes
afterAll(async () => {
  console.log('Limpando ambiente de testes...');
  await cleanDatabase();
  await prisma.$disconnect();
});
