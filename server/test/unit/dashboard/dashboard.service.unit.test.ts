import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MockFn = jest.Mock<(...args: any[]) => any>;

// Mock Prisma client
const mockPrisma = {
    task: {
        count: jest.fn() as MockFn,
        findMany: jest.fn() as MockFn,
    },
};

jest.unstable_mockModule('../../../src/config/db.js', () => ({
    default: mockPrisma,
}));

const { default: DashboardService } = await import('../../../src/modules/dashboard/dashboard.service.js');

describe('DashboardService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getSummary', () => {
        it('should return task counts and completion rate', async () => {
            mockPrisma.task.count
                .mockResolvedValueOnce(10)
                .mockResolvedValueOnce(7)
                .mockResolvedValueOnce(3);

            const result = await DashboardService.getSummary(1);

            expect(result).toEqual({
                total: 10,
                completed: 7,
                pending: 3,
                completionRate: 70,
            });
        });

        it('should return 0% completion rate when no tasks', async () => {
            mockPrisma.task.count
                .mockResolvedValueOnce(0)
                .mockResolvedValueOnce(0)
                .mockResolvedValueOnce(0);

            const result = await DashboardService.getSummary(1);

            expect(result.completionRate).toBe(0);
            expect(result.total).toBe(0);
        });
    });

    describe('getTasksByDay', () => {
        it('should group tasks by creation date', async () => {
            mockPrisma.task.findMany.mockResolvedValue([
                { createdAt: new Date('2026-03-01T10:00:00Z') },
                { createdAt: new Date('2026-03-01T15:00:00Z') },
                { createdAt: new Date('2026-03-02T08:00:00Z') },
            ]);

            const result = await DashboardService.getTasksByDay(1, { days: 30 });

            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({ date: '2026-03-01', count: 2 });
            expect(result[1]).toEqual({ date: '2026-03-02', count: 1 });
        });
    });

    describe('getCompletionOverTime', () => {
        it('should group completed tasks by completion date', async () => {
            mockPrisma.task.findMany.mockResolvedValue([
                { completedAt: new Date('2026-03-10T12:00:00Z') },
                { completedAt: new Date('2026-03-10T18:00:00Z') },
                { completedAt: new Date('2026-03-12T09:00:00Z') },
            ]);

            const result = await DashboardService.getCompletionOverTime(1, { days: 30 });

            expect(result).toHaveLength(2);
            expect(result[0].date).toBe('2026-03-10');
            expect(result[0].count).toBe(2);
        });
    });

    describe('getStatusBreakdown', () => {
        it('should return PENDING and COMPLETED counts', async () => {
            mockPrisma.task.count
                .mockResolvedValueOnce(5)
                .mockResolvedValueOnce(8);

            const result = await DashboardService.getStatusBreakdown(1);

            expect(result).toEqual([
                { status: 'PENDING', count: 5 },
                { status: 'COMPLETED', count: 8 },
            ]);
        });
    });
});
