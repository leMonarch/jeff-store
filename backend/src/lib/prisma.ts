import { PrismaClient } from '@prisma/client';

// Créer une seule instance de Prisma Client
// Cette instance sera réutilisée dans toute l'application
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Fermer la connexion proprement lorsque l'application se termine
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;


