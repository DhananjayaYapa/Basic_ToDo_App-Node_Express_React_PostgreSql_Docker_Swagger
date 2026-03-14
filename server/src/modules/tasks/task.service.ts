import prisma from '../../config/db.js';
import { NotFoundError } from '../../middleware/errorHandler.js';
import { TASK_DEFAULTS } from '../../shared/constants/index.js';
import type { CreateTaskInput, UpdateTaskInput, TaskQueryInput } from './task.schema.js';
import type { TaskStatus } from '../../generated/prisma/client.js';

//Task Service
class TaskService {
    //Create
    static async create(userId: number, data: CreateTaskInput) {
        return prisma.task.create({
            data: {
                title: data.title,
                description: data.description || null,
                userId,
            },
        });
    }

    //Get Recent (5 most recent PENDING tasks for UI)
    static async getRecent(userId: number) {
        return prisma.task.findMany({
            where: {
                userId,
                status: 'PENDING',
            },
            orderBy: { createdAt: 'desc' },
            take: TASK_DEFAULTS.RECENT_LIMIT,
        });
    }

    //Get All (with filters + pagination)
    static async getAll(userId: number, query: TaskQueryInput) {
        const { status, startDate, endDate, sortBy, sortOrder, page, limit } = query;

        const where: Record<string, unknown> = { userId };

        if (status) where.status = status;

        if (startDate || endDate) {
            const dateFilter: Record<string, Date> = {};
            if (startDate) dateFilter.gte = new Date(startDate);
            if (endDate) dateFilter.lte = new Date(endDate);
            where.createdAt = dateFilter;
        }

        const skip = (page - 1) * limit;

        const [tasks, total] = await Promise.all([
            prisma.task.findMany({
                where,
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: limit,
            }),
            prisma.task.count({ where }),
        ]);

        return {
            tasks,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    //Get By ID
    static async getById(userId: number, id: number) {
        const task = await prisma.task.findFirst({
            where: { id, userId },
        });

        if (!task) {
            throw new NotFoundError('Task not found');
        }

        return task;
    }

    //Update
    static async update(userId: number, id: number, data: UpdateTaskInput) {
        const task = await prisma.task.findFirst({
            where: { id, userId },
        });

        if (!task) {
            throw new NotFoundError('Task not found');
        }

        return prisma.task.update({
            where: { id },
            data: {
                ...(data.title !== undefined && { title: data.title }),
                ...(data.description !== undefined && { description: data.description }),
            },
        });
    }

    //Mark as Done
    static async markDone(userId: number, id: number) {
        const task = await prisma.task.findFirst({
            where: { id, userId },
        });

        if (!task) {
            throw new NotFoundError('Task not found');
        }

        if (task.status === 'COMPLETED') {
            return task;
        }

        return prisma.task.update({
            where: { id },
            data: {
                status: 'COMPLETED' as TaskStatus,
                completedAt: new Date(),
            },
        });
    }

    //Delete
    static async delete(userId: number, id: number) {
        const task = await prisma.task.findFirst({
            where: { id, userId },
        });

        if (!task) {
            throw new NotFoundError('Task not found');
        }

        await prisma.task.delete({ where: { id } });
    }

    //Get For Export (no pagination — returns all matching)
    static async getForExport(userId: number, query: TaskQueryInput) {
        const { status, startDate, endDate, sortBy, sortOrder } = query;

        const where: Record<string, unknown> = { userId };

        if (status) where.status = status;

        if (startDate || endDate) {
            const dateFilter: Record<string, Date> = {};
            if (startDate) dateFilter.gte = new Date(startDate);
            if (endDate) dateFilter.lte = new Date(endDate);
            where.createdAt = dateFilter;
        }

        const tasks = await prisma.task.findMany({
            where,
            orderBy: { [sortBy]: sortOrder },
        });

        return tasks.map((t) => ({
            id: t.id,
            title: t.title,
            description: t.description,
            status: t.status,
            completedAt: t.completedAt ? t.completedAt.toISOString() : null,
            createdAt: t.createdAt.toISOString(),
        }));
    }
}

export default TaskService;
