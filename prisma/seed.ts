import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const post1 = await prisma.article.upsert({
    where: { title: 'Prisma adds support for MongoDB' },
    update: {},
    create: {
      title: 'Prisma adds support for MongoDB',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dignissim lobortis sagittis. Sed gravida, ligula vitae suscipit cursus, elit tortor vulputate lectus, non lacinia ipsum turpis eget libero. Ut rhoncus dapibus arcu eget lacinia. Mauris finibus, magna a mollis suscipit, augue odio hendrerit nisl, vitae scelerisque urna ligula sit amet orci. Sed facilisis urna mauris, at bibendum nibh commodo a. Ut iaculis accumsan magna at rhoncus. Nulla ultrices viverra orci id aliquam. Fusce vehicula ex quis nulla tempor faucibus ut tincidunt risus. Proin luctus risus sapien. In feugiat dui quis imperdiet porttitor.',
      description:
        "We are excited to share that today's Prisma ORM release adds stable for MongoDB!",
      published: false,
    },
  });

  const post2 = await prisma.article.upsert({
    where: { title: "What's new in Prisma? (Q1 / 22)" },
    update: {},
    create: {
      title: "What's new in Prisma? (Q1 / 22)",
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dignissim lobortis sagittis. Sed gravida, ligula vitae suscipit cursus, elit tortor vulputate lectus, non lacinia ipsum turpis eget libero. Ut rhoncus dapibus arcu eget lacinia. Mauris finibus, magna a mollis suscipit, augue odio hendrerit nisl, vitae scelerisque urna ligula sit amet orci. Sed facilisis urna mauris, at bibendum nibh commodo a. Ut iaculis accumsan magna at rhoncus. Nulla ultrices viverra orci id aliquam. Fusce vehicula ex quis nulla tempor faucibus ut tincidunt risus. Proin luctus risus sapien. In feugiat dui quis imperdiet porttitor.',
      description:
        'Learn about everything in the Prisma ecosystem and community fro mJanuary to March 2022.',
      published: true,
    },
  });

  await prisma.article.create({
    data: {
      title: 'Title',
      body: 'body',
    },
  });

  console.log({ post1, post2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
