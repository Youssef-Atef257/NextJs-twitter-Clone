import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Create test users
    const user1 = await prisma.user.upsert({
        where: { email: 'user1@example.com' },
        update: {},
        create: {
            name: 'User One',
            email: 'user1@example.com',
            image: 'https://randomuser.me/api/portraits/men/1.jpg',
        },
    });

    const user2 = await prisma.user.upsert({
        where: { email: 'user2@example.com' },
        update: {},
        create: {
            name: 'User Two',
            email: 'user2@example.com',
            image: 'https://randomuser.me/api/portraits/women/2.jpg',
        },
    });

    // Create some tweets
    const tweet1 = await prisma.tweet.create({
        data: {
            content: 'Hello Twitter! #FirstTweet',
            userId: user1.id,
        },
    });

    const tweet2 = await prisma.tweet.create({
        data: {
            content: 'This is a test tweet from User Two.',
            userId: user2.id,
        },
    });

    // Add likes
    await prisma.like.create({
        data: {
            userId: user2.id,
            tweetId: tweet1.id,
        },
    });

    await prisma.like.create({
        data: {
            userId: user1.id,
            tweetId: tweet2.id,
        },
    });

    console.log('Dummy data added successfully! ✅');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
