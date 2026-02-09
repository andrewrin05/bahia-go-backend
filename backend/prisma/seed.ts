import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
    },
  });

  await prisma.listing.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      title: 'Habitación luminosa en Madrid Centro',
      description: 'Habitación amueblada en Lavapiés, cerca de metro.',
      price: 550,
      city: 'Madrid',
      neighborhood: 'Lavapiés',
      availableFrom: new Date('2024-02-01'),
      rooms: 1,
      hasBillsIncluded: true,
      userId: user.id,
    },
  });

  await prisma.listing.upsert({
    where: { id: '2' },
    update: {},
    create: {
      id: '2',
      title: 'Piso 2 hab en Barcelona',
      description: 'Piso reformado en Gràcia, ideal para parejas.',
      price: 1200,
      city: 'Barcelona',
      neighborhood: 'Gràcia',
      availableFrom: new Date('2024-02-15'),
      rooms: 2,
      hasBillsIncluded: false,
      allowsPets: true,
      userId: user.id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });