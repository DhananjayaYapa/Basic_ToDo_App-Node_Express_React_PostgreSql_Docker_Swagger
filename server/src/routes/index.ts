import express from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import taskRoutes from '../modules/tasks/task.routes.js';
import dashboardRoutes from '../modules/dashboard/dashboard.routes.js';

const router = express.Router();

//API Base Route
router.get('/', (_req, res) => {
    res.json({
        status: 'OK',
        message: 'Todo App API base route',
        timestamp: new Date().toISOString(),
        endpoints: {
            health: '/api/v1/health',
            auth: '/api/v1/auth',
            tasks: '/api/v1/tasks',
            dashboard: '/api/v1/dashboard',
        },
    });
});

//Mount Module Routes
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/dashboard', dashboardRoutes);

//Health Check
router.get('/health', (_req, res) => {
    res.json({
        status: 'OK',
        message: 'Todo App API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime(),
    });
});

export default router;
