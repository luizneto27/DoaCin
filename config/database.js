import { PrismaClient } from '@prisma/client';

// Singleton do PrismaClient para evitar múltiplas instâncias e esgotamento de conexões
const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Armazena a instância no global para reutilização em desenvolvimento
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
