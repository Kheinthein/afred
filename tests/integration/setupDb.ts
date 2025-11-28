import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

export const prisma = new PrismaClient();
let schemaReady = false;

const defaultStyles = [
  {
    name: 'Roman',
    description: "Récit long avec développement approfondi des personnages et de l'intrigue",
  },
  {
    name: 'Nouvelle',
    description: 'Récit court, concis avec un impact immédiat',
  },
  {
    name: 'Poésie',
    description: "Texte en vers ou en prose poétique, jouant avec les sonorités et les images",
  },
  {
    name: 'Essai',
    description: 'Texte argumentatif présentant une réflexion personnelle sur un sujet',
  },
  {
    name: 'Thriller',
    description: 'Récit rythmé avec suspense, tension et rebondissements',
  },
  {
    name: 'Science-Fiction',
    description: 'Récit spéculatif basé sur des avancées scientifiques ou technologiques',
  },
  {
    name: 'Fantasy',
    description: "Récit d'aventure dans un monde imaginaire avec magie et créatures fantastiques",
  },
];

beforeAll(() => {
  if (!schemaReady) {
    execSync('npx prisma db push --skip-generate --accept-data-loss', {
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL ?? 'file:./test.db',
      },
    });
    schemaReady = true;
  }
});

beforeEach(async () => {
  await prisma.aIAnalysis.deleteMany();
  await prisma.document.deleteMany();
  await prisma.user.deleteMany();
  await prisma.writingStyle.deleteMany();
  await prisma.writingStyle.createMany({ data: defaultStyles });
});

afterAll(async () => {
  await prisma.$disconnect();
});

export async function getAnyStyleId(): Promise<string> {
  const style = await prisma.writingStyle.findFirst();
  if (!style) {
    throw new Error('No writing style found');
  }
  return style.id;
}

