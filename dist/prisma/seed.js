"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    const adminEmail = 'admin@bahiago.com';
    const adminPassword = 'Demo123!';
    let admin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!admin) {
        const hash = await bcrypt.hash(adminPassword, 10);
        admin = await prisma.user.create({
            data: {
                email: adminEmail,
                passwordHash: hash,
                role: 'ADMIN',
            },
        });
        console.log(`Admin user created: ${adminEmail} / ${adminPassword}`);
    }
    else {
        console.log(`Admin user already exists: ${adminEmail}`);
    }
    if (admin && admin.id) {
        const daytrips = [
            {
                title: 'Islas del Rosario Full Day',
                description: 'Tour de día completo a las Islas del Rosario con almuerzo y snorkel.',
                price: 350000,
                duration: '8 horas',
                published: true,
                images: [
                    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80',
                ],
            },
            {
                title: 'Cholon Party',
                description: 'Fiesta en Cholon con música, bebidas y amigos.',
                price: 450000,
                duration: '6 horas',
                published: true,
                images: [
                    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80',
                ],
            },
            {
                title: 'Atardecer en Barú',
                description: 'Disfruta de un atardecer inolvidable en Barú con cóctel incluido.',
                price: 250000,
                duration: '4 horas',
                published: true,
                images: [
                    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80',
                ],
            },
        ];
        for (const trip of daytrips) {
            await prisma.daytrip.create({
                data: {
                    title: trip.title,
                    description: trip.description,
                    price: trip.price,
                    duration: trip.duration,
                    published: trip.published,
                    ownerId: admin.id,
                    images: JSON.stringify(trip.images),
                },
            });
        }
    }
    const userEmail = 'user@bahiago.com';
    const userPassword = 'User123!';
    let user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
        const hash = await bcrypt.hash(userPassword, 10);
        user = await prisma.user.create({
            data: {
                email: userEmail,
                passwordHash: hash,
                role: 'USER',
            },
        });
        console.log(`Test user created: ${userEmail} / ${userPassword}`);
    }
    else {
        console.log(`Test user already exists: ${userEmail}`);
    }
    const boats = [
        {
            name: 'Yate de Lujo',
            type: 'yacht',
            description: 'Yate elegante para eventos especiales',
            price: 500.0,
            pricePerDay: 500.0,
            location: 'Cartagena',
            capacity: 10,
            imageUrl: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
            ]),
            published: true,
        },
        {
            name: 'Lancha Rápida',
            type: 'speedboat',
            description: 'Lancha deportiva para aventuras',
            price: 150.0,
            pricePerDay: 150.0,
            location: 'Cartagena',
            capacity: 6,
            imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
            ]),
            published: true,
        },
        {
            name: 'Jetski Azul',
            type: 'jetski',
            description: 'Jetski para diversión acuática',
            price: 50.0,
            pricePerDay: 50.0,
            location: 'Cartagena',
            capacity: 1,
            imageUrl: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=1200&q=80',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
            ]),
            published: true,
        },
    ];
    for (const boat of boats) {
        await prisma.boat.create({
            data: {
                ...boat,
                owner: { connect: { id: admin.id } },
            },
        });
    }
    console.log('Database seeded successfully');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map