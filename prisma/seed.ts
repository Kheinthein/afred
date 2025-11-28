import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Starting seed...');

  // Seed Writing Styles
  const styles = [
    {
      name: 'Roman',
      description:
        'Récit long avec développement approfondi des personnages et de l\'intrigue',
    },
    {
      name: 'Nouvelle',
      description: 'Récit court, concis avec un impact immédiat',
    },
    {
      name: 'Poésie',
      description:
        'Texte en vers ou en prose poétique, jouant avec les sonorités et les images',
    },
    {
      name: 'Essai',
      description:
        'Texte argumentatif présentant une réflexion personnelle sur un sujet',
    },
    {
      name: 'Thriller',
      description: 'Récit rythmé avec suspense, tension et rebondissements',
    },
    {
      name: 'Science-Fiction',
      description:
        'Récit spéculatif basé sur des avancées scientifiques ou technologiques',
    },
    {
      name: 'Fantasy',
      description:
        'Récit d\'aventure dans un monde imaginaire avec magie et créatures fantastiques',
    },
  ];

  for (const style of styles) {
    await prisma.writingStyle.upsert({
      where: { name: style.name },
      update: {},
      create: style,
    });
    console.log(`✅ Style créé: ${style.name}`);
  }

  console.log('✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

