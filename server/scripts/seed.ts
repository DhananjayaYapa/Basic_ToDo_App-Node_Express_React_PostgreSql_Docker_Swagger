import 'dotenv/config';
import prisma from '../src/config/db.js';
import bcrypt from 'bcryptjs';
import { SALT_ROUNDS } from '../src/shared/constants/index.js';
import logger from '../src/config/logger.js';

//Seed Script - Populates the database with demo data
async function seed() {
    logger.info('Seeding database...');

    // Clean existing data
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
    logger.info('Cleared existing data');

    // Create demo users
    const passwordHash = await bcrypt.hash('Password123', SALT_ROUNDS);

    const user1 = await prisma.user.create({
        data: {
            name: 'John Doe',
            email: 'john@example.com',
            passwordHash,
        },
    });

    const user2 = await prisma.user.create({
        data: {
            name: 'Jane Smith',
            email: 'jane@example.com',
            passwordHash,
        },
    });

    logger.info('Created 2 users');

    // Create tasks for User 1
    const now = new Date();
    const tasks = [
        {
            title: 'Complete project setup',
            description: 'Set up the basic project structure with TypeScript and Express',
            status: 'COMPLETED' as const,
            completedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
            userId: user1.id,
            createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        },
        {
            title: 'Design database schema',
            description: 'Create the Prisma schema with proper relationships and indexes',
            status: 'COMPLETED' as const,
            completedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
            userId: user1.id,
            createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
        },
        {
            title: 'Implement authentication',
            description: 'Add JWT-based auth with register and login endpoints',
            status: 'COMPLETED' as const,
            completedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
            userId: user1.id,
            createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        },
        {
            title: 'Write unit tests',
            description: 'Add Jest tests for all service methods',
            status: 'PENDING' as const,
            userId: user1.id,
            createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        },
        {
            title: 'Set up Docker',
            description: 'Create Dockerfile and docker-compose.yml for containerization',
            status: 'PENDING' as const,
            userId: user1.id,
            createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
        },
        {
            title: 'Add API documentation',
            description: 'Complete Swagger/OpenAPI docs for all endpoints',
            status: 'PENDING' as const,
            userId: user1.id,
            createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        },
        {
            title: 'Build frontend SPA',
            description: 'Create React frontend with task list and create form',
            status: 'PENDING' as const,
            userId: user1.id,
            createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        },
        {
            title: 'Deploy to production',
            description: 'Deploy the application using Docker on a cloud provider',
            status: 'PENDING' as const,
            userId: user1.id,
            createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
        },
    ];

    // Tasks for User 2
    const user2Tasks = [
        {
            title: 'Grocery shopping',
            description: 'Buy milk, bread, eggs, and vegetables',
            status: 'PENDING' as const,
            userId: user2.id,
            createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        },
        {
            title: 'Read TypeScript handbook',
            description: 'Finish chapters on generics and utility types',
            status: 'COMPLETED' as const,
            completedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
            userId: user2.id,
            createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        },
        {
            title: 'Schedule dentist appointment',
            description: null,
            status: 'PENDING' as const,
            userId: user2.id,
            createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        },
    ];

    const allTasks = [...tasks, ...user2Tasks];

    for (const task of allTasks) {
        await prisma.task.create({ data: task });
    }

    logger.info(`Created ${allTasks.length} tasks (${tasks.length} for John, ${user2Tasks.length} for Jane)`);

    // Summary
    const totalUsers = await prisma.user.count();
    const totalTasks = await prisma.task.count();
    const completedTasks = await prisma.task.count({ where: { status: 'COMPLETED' } });
    const pendingTasks = await prisma.task.count({ where: { status: 'PENDING' } });

    logger.info({ users: totalUsers, tasks: totalTasks, completed: completedTasks, pending: pendingTasks }, 'Seed summary');
    logger.info('Demo credentials: john@example.com / Password123, jane@example.com / Password123');
    logger.info('Database seeded successfully!');
}

seed()
    .catch((error) => {
        logger.error(error, 'Seed failed');
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
