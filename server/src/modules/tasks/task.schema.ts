import { z } from 'zod';

//Create Task Schema
export const createTaskSchema = z.object({
    title: z
        .string({ required_error: 'Title is required' })
        .trim()
        .min(1, 'Title is required')
        .max(255, 'Title must be at most 255 characters'),
    description: z
        .string({ required_error: 'Description is required' })
        .trim()
        .min(1, 'Description is required')
        .max(5000, 'Description must be at most 5000 characters'),
});

//Update Task Schema
export const updateTaskSchema = z.object({
    title: z.string().trim().min(1).max(255).optional(),
    description: z
        .string({ required_error: 'Description is required' })
        .trim()
        .min(1, 'Description is required')
        .max(5000, 'Description must be at most 5000 characters'),
});

//Task Query Schema (filtering + sorting + pagination)
export const taskQuerySchema = z.object({
    status: z.enum(['PENDING', 'COMPLETED']).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    sortBy: z.enum(['createdAt', 'title']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});

//Inferred Types
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;
