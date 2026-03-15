import express from 'express';
import request from 'supertest';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { z } from 'zod';
import { validate } from '../../../src/middleware/validate.js';
import { errorHandler, notFoundHandler } from '../../../src/middleware/errorHandler.js';

describe('validate + errorHandler integration', () => {
    let app: ReturnType<typeof express>;

    beforeEach(() => {
        app = express();
        app.use(express.json());

        app.post(
            '/api/v1/test/echo',
            validate({
                body: z.object({
                    name: z.string().min(1),
                }),
            }),
            (req, res) => {
                res.status(200).json({
                    success: true,
                    data: req.body,
                });
            },
        );

        app.use(notFoundHandler);
        app.use(errorHandler);
    });

    it('should return 200 for valid request body', async () => {
        const response = await request(app).post('/api/v1/test/echo').send({ name: 'Alice' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            data: { name: 'Alice' },
        });
    });

    it('should return 400 for invalid request body', async () => {
        const response = await request(app).post('/api/v1/test/echo').send({ name: '' });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Validation failed');
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    field: 'name',
                }),
            ]),
        );
    });

    it('should return 404 for unknown routes', async () => {
        const response = await request(app).get('/api/v1/unknown');

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('Route not found: GET /api/v1/unknown');
    });
});
