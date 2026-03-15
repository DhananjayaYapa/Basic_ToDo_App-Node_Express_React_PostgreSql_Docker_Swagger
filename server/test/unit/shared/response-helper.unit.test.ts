import { describe, it, expect, jest } from '@jest/globals';
import {
    successResponse,
    createdResponse,
    noContentResponse,
    errorResponse,
} from '../../../src/shared/utils/responseHelper.js';

type MockResponse = {
    status: jest.Mock;
    json: jest.Mock;
    send: jest.Mock;
};

const createMockResponse = (): MockResponse => {
    const res = {
        status: jest.fn(),
        json: jest.fn(),
        send: jest.fn(),
    } as unknown as MockResponse;

    res.status.mockReturnValue(res);
    res.json.mockReturnValue(res);
    res.send.mockReturnValue(res);

    return res;
};

describe('responseHelper unit', () => {
    it('successResponse should return standard success payload', () => {
        const res = createMockResponse();

        successResponse(res as never, { id: 1 }, 'OK', 200);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true,
                message: 'OK',
                data: { id: 1 },
                timestamp: expect.any(String),
            }),
        );
    });

    it('createdResponse should return 201 status', () => {
        const res = createMockResponse();

        createdResponse(res as never, { id: 2 }, 'Created');

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true,
                message: 'Created',
                data: { id: 2 },
            }),
        );
    });

    it('noContentResponse should return 204 with no body', () => {
        const res = createMockResponse();

        noContentResponse(res as never);

        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalledWith();
    });

    it('errorResponse should include errors only when provided', () => {
        const res = createMockResponse();
        const details = [{ field: 'email', message: 'Invalid email' }];

        errorResponse(res as never, 'Validation failed', 400, details);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                message: 'Validation failed',
                errors: details,
                timestamp: expect.any(String),
            }),
        );
    });
});
