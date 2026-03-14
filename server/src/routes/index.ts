import express from 'express';

const router = express.Router();

// ─── Mount Module Routes ────────────────────────────────────────────────────
// Module routes will be added here as modules are implemented:
// router.use('/auth', authRoutes);
// router.use('/tasks', taskRoutes);
// router.use('/dashboard', dashboardRoutes);

// ─── Health Check ───────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API is running
 */
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
