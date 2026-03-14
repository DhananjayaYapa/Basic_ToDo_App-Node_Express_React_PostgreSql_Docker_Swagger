import { Request, Response, NextFunction } from 'express';
import DashboardService from './dashboard.service.js';
import { successResponse } from '../../shared/utils/responseHelper.js';

//Dashboard Controller
class DashboardController {
    static async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const summary = await DashboardService.getSummary(req.user!.userId);
            successResponse(res, summary, 'Dashboard summary retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    static async getTasksByDay(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await DashboardService.getTasksByDay(req.user!.userId, req.query as never);
            successResponse(res, data, 'Tasks by day retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    static async getCompletionOverTime(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await DashboardService.getCompletionOverTime(req.user!.userId, req.query as never);
            successResponse(res, data, 'Completion over time retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    static async getStatusBreakdown(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await DashboardService.getStatusBreakdown(req.user!.userId);
            successResponse(res, data, 'Status breakdown retrieved successfully');
        } catch (error) {
            next(error);
        }
    }
}

export default DashboardController;
