import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MockFn = jest.Mock<(...args: any[]) => any>;

// Mock Prisma client
const mockPrisma = {
    task: {
        create: jest.fn() as MockFn,
        findMany: jest.fn() as MockFn,
        findFirst: jest.fn() as MockFn,
        update: jest.fn() as MockFn,
        delete: jest.fn() as MockFn,
        count: jest.fn() as MockFn,
    },
};

jest.unstable_mockModule('../../config/db.js', () => ({
    default: mockPrisma,
}));

const { default: TaskService } = await import('./task.service.js');

describe('TaskService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a task with correct data', async () => {
            const mockTask = {
                id: 1,
                title: 'Test task',
                description: 'A description',
                priority: 'MEDIUM',
                status: 'PENDING',
                userId: 1,
                createdAt: new Date(),
            };
            mockPrisma.task.create.mockResolvedValue(mockTask);

            const result = await TaskService.create(1, {
                title: 'Test task',
                description: 'A description',
                priority: 'MEDIUM',
            });

            expect(result).toEqual(mockTask);
            expect(mockPrisma.task.create).toHaveBeenCalledWith({
                data: {
                    title: 'Test task',
                    description: 'A description',
                    priority: 'MEDIUM',
                    dueDate: null,
                    userId: 1,
                },
            });
        });

        it('should handle dueDate when provided', async () => {
            mockPrisma.task.create.mockResolvedValue({ id: 1 });

            await TaskService.create(1, {
                title: 'Test',
                priority: 'HIGH',
                dueDate: '2026-04-01',
            });

            expect(mockPrisma.task.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    dueDate: new Date('2026-04-01'),
                }),
            });
        });
    });

    describe('getRecent', () => {
        it('should return 5 most recent PENDING tasks', async () => {
            const mockTasks = Array.from({ length: 5 }, (_, i) => ({
                id: i + 1,
                title: `Task ${i + 1}`,
                status: 'PENDING',
            }));
            mockPrisma.task.findMany.mockResolvedValue(mockTasks);

            const result = await TaskService.getRecent(1);

            expect(result).toHaveLength(5);
            expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
                where: { userId: 1, status: 'PENDING' },
                orderBy: { createdAt: 'desc' },
                take: 5,
            });
        });
    });

    describe('getAll', () => {
        it('should return paginated tasks with filters', async () => {
            mockPrisma.task.findMany.mockResolvedValue([{ id: 1 }]);
            mockPrisma.task.count.mockResolvedValue(1);

            const result = await TaskService.getAll(1, {
                status: 'PENDING',
                sortBy: 'createdAt',
                sortOrder: 'desc',
                page: 1,
                limit: 20,
            });

            expect(result).toHaveProperty('tasks');
            expect(result).toHaveProperty('pagination');
            expect(result.pagination.total).toBe(1);
            expect(result.pagination.totalPages).toBe(1);
        });

        it('should apply date range filters', async () => {
            mockPrisma.task.findMany.mockResolvedValue([]);
            mockPrisma.task.count.mockResolvedValue(0);

            await TaskService.getAll(1, {
                startDate: '2026-01-01',
                endDate: '2026-12-31',
                sortBy: 'createdAt',
                sortOrder: 'desc',
                page: 1,
                limit: 20,
            });

            expect(mockPrisma.task.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        createdAt: {
                            gte: new Date('2026-01-01'),
                            lte: new Date('2026-12-31'),
                        },
                    }),
                }),
            );
        });
    });

    describe('getById', () => {
        it('should return a task by id and userId', async () => {
            const mockTask = { id: 1, title: 'Test', userId: 1 };
            mockPrisma.task.findFirst.mockResolvedValue(mockTask);

            const result = await TaskService.getById(1, 1);

            expect(result).toEqual(mockTask);
        });

        it('should throw NotFoundError if task not found', async () => {
            mockPrisma.task.findFirst.mockResolvedValue(null);

            await expect(TaskService.getById(1, 999)).rejects.toThrow('Task not found');
        });
    });

    describe('markDone', () => {
        it('should mark a pending task as completed', async () => {
            mockPrisma.task.findFirst.mockResolvedValue({ id: 1, status: 'PENDING', userId: 1 });
            mockPrisma.task.update.mockResolvedValue({ id: 1, status: 'COMPLETED' });

            const result = await TaskService.markDone(1, 1);

            expect(result.status).toBe('COMPLETED');
            expect(mockPrisma.task.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    status: 'COMPLETED',
                    completedAt: expect.any(Date),
                },
            });
        });

        it('should return task as-is if already completed (idempotent)', async () => {
            const completedTask = { id: 1, status: 'COMPLETED', userId: 1 };
            mockPrisma.task.findFirst.mockResolvedValue(completedTask);

            const result = await TaskService.markDone(1, 1);

            expect(result).toEqual(completedTask);
            expect(mockPrisma.task.update).not.toHaveBeenCalled();
        });

        it('should throw NotFoundError if task not found', async () => {
            mockPrisma.task.findFirst.mockResolvedValue(null);

            await expect(TaskService.markDone(1, 999)).rejects.toThrow('Task not found');
        });
    });

    describe('delete', () => {
        it('should delete a task', async () => {
            mockPrisma.task.findFirst.mockResolvedValue({ id: 1, userId: 1 });
            mockPrisma.task.delete.mockResolvedValue({});

            await TaskService.delete(1, 1);

            expect(mockPrisma.task.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('should throw NotFoundError if task not found', async () => {
            mockPrisma.task.findFirst.mockResolvedValue(null);

            await expect(TaskService.delete(1, 999)).rejects.toThrow('Task not found');
        });
    });

    describe('getForExport', () => {
        it('should return flattened tasks for export', async () => {
            const mockTasks = [
                {
                    id: 1,
                    title: 'Task 1',
                    description: 'Desc',
                    status: 'COMPLETED',
                    priority: 'HIGH',
                    dueDate: new Date('2026-04-01'),
                    completedAt: new Date('2026-03-15'),
                    createdAt: new Date('2026-03-01'),
                },
            ];
            mockPrisma.task.findMany.mockResolvedValue(mockTasks);

            const result = await TaskService.getForExport(1, {
                sortBy: 'createdAt',
                sortOrder: 'desc',
                page: 1,
                limit: 20,
            });

            expect(result[0]).toHaveProperty('id', 1);
            expect(result[0]).toHaveProperty('dueDate', '2026-04-01');
            expect(typeof result[0].completedAt).toBe('string');
            expect(typeof result[0].createdAt).toBe('string');
        });
    });
});
