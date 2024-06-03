import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { hashRounding } from '../src/users/users.service';

const prisma = new PrismaClient({
  log: [
    {
      emit: 'stdout',
      level: 'query',
    },
  ],
});

async function main() {
  const hashedPassword1 = await bcrypt.hash('123123', hashRounding);
  const hashedPassword2 = await bcrypt.hash('111111', hashRounding);

  const user1 = await prisma.user.upsert({
    where: { email: 'tonysoul@foxmail.com' },
    update: {},
    create: {
      name: 'tony',
      email: 'tonysoul@foxmail.com',
      password: hashedPassword1,
    },
  });
  const user2 = await prisma.user.upsert({
    where: { email: 'tom@163.com' },
    update: {},
    create: {
      name: 'tom',
      email: 'tom@163.com',
      password: hashedPassword2,
    },
  });

  const post1 = await prisma.article.upsert({
    where: { title: 'Prisma Adds Support for MongoDB' },
    update: {
      authorId: user1.id,
    },
    create: {
      title: 'Prisma Adds Support for MongoDB',
      body: 'Support for MongoDB has been one of the most requested features since the initial release of...',
      description:
        "We are excited to share that today's Prisma ORM release adds stable support for MongoDB!",
      published: false,
      authorId: user1.id,
    },
  });

  const post2 = await prisma.article.upsert({
    where: { title: "What's new in Prisma? (Q1/22)" },
    update: {
      authorId: user2.id,
    },
    create: {
      title: "What's new in Prisma? (Q1/22)",
      body: 'Our engineers have been working hard, issuing new releases with many improvements...',
      description:
        'Learn about everything in the Prisma ecosystem and community from January to March 2022.',
      published: true,
      authorId: user2.id,
    },
  });

  console.log({ post1, post2, user1, user2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
