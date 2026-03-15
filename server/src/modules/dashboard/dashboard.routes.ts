import express from 'express';
import DashboardController from './dashboard.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { dashboardQuerySchema } from './dashboard.schema.js';

const router = express.Router();

router.use(authenticate);

//Dashboard Routes
/**
 * @swagger
 * /api/v1/dashboard/summary:
 *   get:
 *     summary: Get task summary (total, completed, pending, completion rate)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary retrieved
 */
router.get('/summary', asyncHandler(DashboardController.getSummary));

/**
 * @swagger
 * /api/v1/dashboard/tasks-by-day:
 *   get:
 *     summary: Get tasks created per day (for bar/line chart)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days to look back
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Tasks per day data
 */
router.get(
    '/tasks-by-day',
    validate({ query: dashboardQuerySchema }),
    asyncHandler(DashboardController.getTasksByDay),
);

/**
 * @swagger
 * /api/v1/dashboard/completion-over-time:
 *   get:
 *     summary: Get tasks completed per day (for line chart)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Completion over time data
 */
router.get(
    '/completion-over-time',
    validate({ query: dashboardQuerySchema }),
    asyncHandler(DashboardController.getCompletionOverTime),
);

/**
 * @swagger
 * /api/v1/dashboard/status-breakdown:
 *   get:
 *     summary: Get PENDING vs COMPLETED counts (for pie chart)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Status breakdown data
 */
router.get('/status-breakdown', asyncHandler(DashboardController.getStatusBreakdown));

export default router;
