import { PrismaClient, ReceiptCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const coupleId = 'a0000000-0000-0000-0000-000000000001';

  const couple = await prisma.couple.upsert({
    where: { id: coupleId },
    update: {},
    create: {
      id: coupleId,
      name: 'Yaseru & Partner',
    },
  });

  console.log(`Couple ready: ${couple.name} (${couple.id})`);

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  // Flashback 1 year ago for "On This Day" showcase
  const oneYearAgoDate = new Date(`${year - 1}-${month}-${day}`);
  const twoYearsAgoDate = new Date(`${year - 2}-${month}-${day}`);

  await prisma.receipt.createMany({
    data: [
      {
        couple_id: coupleId,
        created_by: 'Yaseru',
        title: 'Tiket Nonton La La Land',
        event_date: oneYearAgoDate,
        category: ReceiptCategory.movie,
        image_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
        amount: 110000,
        notes: 'Kencan pertama kita! Romantis banget.',
      },
      {
        couple_id: coupleId,
        created_by: 'Partner',
        title: 'Kopi Kenangan Dago',
        event_date: twoYearsAgoDate,
        category: ReceiptCategory.food,
        image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
        amount: 84000,
        notes: 'Ngobrol berjam-jam tentang rencana masa depan.',
      },
    ],
    skipDuplicates: true,
  });

  await prisma.scrapbook.create({
    data: {
      couple_id: coupleId,
      title: 'Our First Road Trip',
      event_date: oneYearAgoDate,
      bg_color: '#FFFDF5',
      canvas_json: {
        version: '6.0.0',
        objects: [
          {
            type: 'textbox',
            text: 'First Road Trip Memory!',
            fontSize: 28,
            left: 50,
            top: 50,
            fill: '#121212',
          },
        ],
      },
      thumbnail_url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
    },
  });

  console.log('Seeded sample receipts and scrapbook page successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
