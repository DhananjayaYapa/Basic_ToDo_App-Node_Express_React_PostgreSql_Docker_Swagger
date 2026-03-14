import prisma from '../../config/db.js';
import type { DashboardQueryInput } from './dashboard.schema.js';

//Dashboard Service
class DashboardService {
    //Summary (total, completed, pending, completion rate)
    static async getSummary(userId: number) {
        const [total, completed, pending] = await Promise.all([
            prisma.task.count({ where: { userId } }),
            prisma.task.count({ where: { userId, status: 'COMPLETED' } }),
            prisma.task.count({ where: { userId, status: 'PENDING' } }),
        ]);

        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
            total,
            completed,
            pending,
            completionRate,
        };
    }

    //Tasks Created Per Day (for bar/line chart)
    static async getTasksByDay(userId: number, query: DashboardQueryInput) {
        const dateRange = this.getDateRange(query);

        const tasks = await prisma.task.findMany({
            where: {
                userId,
                createdAt: {
                    gte: dateRange.start,
                    lte: dateRange.end,
                },
            },
            select: {
                createdAt: true,
            },
            orderBy: { createdAt: 'asc' },
        });

        const groupedByDay = new Map<string, number>();
        tasks.forEach((task) => {
            const dateKey = task.createdAt.toISOString().split('T')[0];
            groupedByDay.set(dateKey, (groupedByDay.get(dateKey) || 0) + 1);
        });

        return Array.from(groupedByDay.entries()).map(([date, count]) => ({
            date,
            count,
        }));
    }

    //Tasks Completed Over Time (for line chart)
    static async getCompletionOverTime(userId: number, query: DashboardQueryInput) {
        const dateRange = this.getDateRange(query);

        const tasks = await prisma.task.findMany({
            where: {
                userId,
                status: 'COMPLETED',
                completedAt: {
                    not: null,
                    gte: dateRange.start,
                    lte: dateRange.end,
                },
            },
            select: {
                completedAt: true,
            },
            orderBy: { completedAt: 'asc' },
        });

        const groupedByDay = new Map<string, number>();
        tasks.forEach((task) => {
            if (task.completedAt) {
                const dateKey = task.completedAt.toISOString().split('T')[0];
                groupedByDay.set(dateKey, (groupedByDay.get(dateKey) || 0) + 1);
            }
        });

        return Array.from(groupedByDay.entries()).map(([date, count]) => ({
            date,
            count,
        }));
    }

    //Status Breakdown (for pie/donut chart)
    static async getStatusBreakdown(userId: number) {
        const [pending, completed] = await Promise.all([
            prisma.task.count({ where: { userId, status: 'PENDING' } }),
            prisma.task.count({ where: { userId, status: 'COMPLETED' } }),
        ]);

        return [
            { status: 'PENDING', count: pending },
            { status: 'COMPLETED', count: completed },
        ];
    }

    //Helper: Calculate Date Range
    private static getDateRange(query: DashboardQueryInput): { start: Date; end: Date } {
        if (query.startDate && query.endDate) {
            return {
                start: new Date(query.startDate),
                end: new Date(query.endDate),
            };
        }

        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - query.days);

        return { start, end };
    }
}

export default DashboardService;
