// @ts-expect-error - json2csv v6 alpha has no type declarations
import { Parser } from 'json2csv';

// ─── Task Export Interface ──────────────────────────────────────────────────

interface TaskExportRow {
    id: number;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    dueDate: string | null;
    completedAt: string | null;
    createdAt: string;
}

// ─── Export Tasks to CSV ────────────────────────────────────────────────────
// Single Responsibility: transforms task data into CSV format.

export const exportTasksToCSV = (tasks: TaskExportRow[]): string => {
    if (!tasks || tasks.length === 0) {
        return 'No data to export';
    }

    const fields = [
        { label: 'Task ID', value: 'id' },
        { label: 'Title', value: 'title' },
        { label: 'Description', value: 'description' },
        { label: 'Status', value: 'status' },
        { label: 'Priority', value: 'priority' },
        { label: 'Due Date', value: 'dueDate' },
        { label: 'Completed At', value: 'completedAt' },
        { label: 'Created At', value: 'createdAt' },
    ];

    const parser = new Parser({ fields });
    return parser.parse(tasks);
};

// ─── Export Tasks to JSON ───────────────────────────────────────────────────

export const exportTasksToJSON = (tasks: TaskExportRow[]) => {
    return {
        exportDate: new Date().toISOString(),
        totalCount: tasks.length,
        tasks: tasks.map((t) => ({
            id: t.id,
            title: t.title,
            description: t.description,
            status: t.status,
            priority: t.priority,
            dueDate: t.dueDate,
            completedAt: t.completedAt,
            createdAt: t.createdAt,
        })),
    };
};

// ─── Filename Helper ────────────────────────────────────────────────────────

export const getExportFilename = (format: string): string => {
    const date = new Date().toISOString().split('T')[0];
    return `tasks-export-${date}.${format}`;
};
