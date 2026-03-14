import { Request, Response, NextFunction } from 'express';
import TaskService from './task.service.js';
import { successResponse, createdResponse } from '../../shared/utils/responseHelper.js';
import { exportTasksToCSV, exportTasksToJSON, getExportFilename } from '../../shared/utils/exportHelper.js';

//Task Controller
class TaskController {
    static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const task = await TaskService.create(req.user!.userId, req.body);
            createdResponse(res, task, 'Task created successfully');
        } catch (error) {
            next(error);
        }
    }

    static async getRecent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const tasks = await TaskService.getRecent(req.user!.userId);
            successResponse(res, tasks, 'Recent tasks retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await TaskService.getAll(req.user!.userId, req.query as never);
            successResponse(res, result, 'Tasks retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return next(new Error('Invalid task ID'));
            }
            const task = await TaskService.getById(req.user!.userId, id);
            successResponse(res, task, 'Task retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            const task = await TaskService.update(req.user!.userId, id, req.body);
            successResponse(res, task, 'Task updated successfully');
        } catch (error) {
            next(error);
        }
    }

    static async markDone(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            const task = await TaskService.markDone(req.user!.userId, id);
            successResponse(res, task, 'Task marked as completed');
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            await TaskService.delete(req.user!.userId, id);
            successResponse(res, null, 'Task deleted successfully');
        } catch (error) {
            next(error);
        }
    }

    //Export CSV
    static async exportCSV(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const tasks = await TaskService.getForExport(req.user!.userId, req.query as never);
            const csv = exportTasksToCSV(tasks);
            const filename = getExportFilename('csv');

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.send(csv);
        } catch (error) {
            next(error);
        }
    }

    //Export JSON
    static async exportJSON(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const tasks = await TaskService.getForExport(req.user!.userId, req.query as never);
            const data = exportTasksToJSON(tasks);
            const filename = getExportFilename('json');

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
}

export default TaskController;
