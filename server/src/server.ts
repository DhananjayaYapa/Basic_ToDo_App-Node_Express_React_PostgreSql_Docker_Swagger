import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import logger from './config/logger.js';
import prisma from './config/db.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';

//Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

//CORS
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
);

//Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

//HTTP Request Logging
if (process.env.NODE_ENV !== 'production') {
    app.use((_req, _res, next) => {
        const timestamp = new Date().toISOString();
        logger.info(`[${timestamp}] ${_req.method} ${_req.path}`);
        next();
    });
}

//Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//API Routes
app.use('/api/v1', routes);

//Root Endpoint
app.get('/', (_req, res) => {
    res.json({
        name: 'Todo App API',
        version: '1.0.0',
        description: 'RESTful API for Todo Task Management',
        documentation: '/api-docs',
        endpoints: {
            health: 'GET /api/v1/health',
            auth: {
                register: 'POST /api/v1/auth/register',
                login: 'POST /api/v1/auth/login',
                profile: 'GET /api/v1/auth/profile',
            },
            tasks: 'GET /api/v1/tasks',
            dashboard: 'GET /api/v1/dashboard/summary',
        },
    });
});

//Error Handling

app.use(notFoundHandler);
app.use(errorHandler);

//Start Server
let server: ReturnType<typeof app.listen>;
const startServer = async () => {
    try {
        await prisma.$connect();
        logger.info('Database connected successfully');

        server = app.listen(PORT, () => {
            logger.info('='.repeat(50));
            logger.info('TODO APP SERVER STARTED');
            logger.info('='.repeat(50));
            logger.info(`Server running on: http://localhost:${PORT}`);
            logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
            logger.info(`API Docs: http://localhost:${PORT}/api-docs`);
            logger.info('='.repeat(50));
        });
    } catch (error) {
        logger.fatal(error, 'Failed to start server');
        process.exit(1);
    }
};

//shutdown 
const gracefulShutdown = async (signal: string) => {
    logger.info(`${signal} received: shutting down gracefully`);
    server?.close(() => {
        logger.info('HTTP server closed');
    });
    await prisma.$disconnect();
    process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (error) => {
    logger.fatal(error, 'Uncaught Exception');
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    logger.fatal(reason, 'Unhandled Rejection');
    process.exit(1);
});

startServer();

export default app;
