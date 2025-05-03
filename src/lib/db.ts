import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function initializeDb() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

// User operations
export async function findOrCreateUser(email: string) {
  return await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email }
  });
}

export async function updateUserTheme(userId: string, theme: {
  backgroundColor: string;
  textColor: string;
  linkColor: string;
  backgroundImage?: string;
}) {
  return await prisma.theme.upsert({
    where: { userId },
    update: theme,
    create: {
      ...theme,
      userId
    }
  });
}

// Link operations
export async function getUserLinks(userId: string) {
  return await prisma.link.findMany({
    where: { userId },
    orderBy: { sortOrder: 'asc' }
  });
}

export async function createLink(userId: string, link: {
  title: string;
  url: string;
  sortOrder: number;
}) {
  return await prisma.link.create({
    data: {
      ...link,
      userId
    }
  });
}

// Agent operations
export async function updateAgentConfig(userId: string, prompt: string) {
  return await prisma.agentConfig.upsert({
    where: { userId },
    update: { prompt },
    create: {
      userId,
      prompt
    }
  });
}

// Payment operations
export async function recordPayment(userId: string, payment: {
  amount: number;
  zapritePaymentId: string;
}) {
  return await prisma.payment.create({
    data: {
      ...payment,
      userId
    }
  });
}

export async function getUserPayments(userId: string) {
  return await prisma.payment.findMany({
    where: { userId },
    orderBy: { date: 'desc' }
  });
}