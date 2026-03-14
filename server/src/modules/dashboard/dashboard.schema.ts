import { z } from 'zod';

//Dashboard Date Range Query
export const dashboardQuerySchema = z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    days: z.coerce.number().int().positive().max(365).default(30),
});

//Inferred Types
export type DashboardQueryInput = z.infer<typeof dashboardQuerySchema>;
