import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MockFn = jest.Mock<(...args: any[]) => any>;

// Mock Prisma client
const mockPrisma = {
    user: {
        findUnique: jest.fn() as MockFn,
        create: jest.fn() as MockFn,
        update: jest.fn() as MockFn,
    },
};

jest.unstable_mockModule('../../../src/config/db.js', () => ({
    default: mockPrisma,
}));

// Mock bcrypt
const mockBcrypt = {
    hash: jest.fn() as MockFn,
    compare: jest.fn() as MockFn,
};

jest.unstable_mockModule('bcryptjs', () => ({
    default: mockBcrypt,
}));

// Mock auth middleware
jest.unstable_mockModule('../../../src/middleware/auth.js', () => ({
    generateToken: jest.fn().mockReturnValue('mock-jwt-token'),
}));

// Import after mocks
const { default: AuthService } = await import('../../../src/modules/auth/auth.service.js');

describe('AuthService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        const registerData = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'Password123',
        };

        it('should register a new user successfully', async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null);
            mockBcrypt.hash.mockResolvedValue('hashed-password');
            mockPrisma.user.create.mockResolvedValue({
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                createdAt: new Date('2026-01-01'),
            });

            const result = await AuthService.register(registerData);

            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('token', 'mock-jwt-token');
            expect(result.user.email).toBe('john@example.com');
            expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
                where: { email: 'john@example.com' },
            });
            expect(mockBcrypt.hash).toHaveBeenCalledWith('Password123', 10);
        });

        it('should throw ConflictError if email already exists', async () => {
            mockPrisma.user.findUnique.mockResolvedValue({ id: 1, email: 'john@example.com' });

            await expect(AuthService.register(registerData)).rejects.toThrow('Email already registered');
        });
    });

    describe('login', () => {
        const loginData = {
            email: 'john@example.com',
            password: 'Password123',
        };

        it('should login successfully with valid credentials', async () => {
            mockPrisma.user.findUnique.mockResolvedValue({
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                passwordHash: 'hashed-password',
            });
            mockBcrypt.compare.mockResolvedValue(true);

            const result = await AuthService.login(loginData);

            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('token', 'mock-jwt-token');
            expect(result.user.email).toBe('john@example.com');
        });

        it('should throw UnauthorizedError for non-existent email', async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null);

            await expect(AuthService.login(loginData)).rejects.toThrow('Invalid email or password');
        });

        it('should throw UnauthorizedError for wrong password', async () => {
            mockPrisma.user.findUnique.mockResolvedValue({
                id: 1,
                email: 'john@example.com',
                passwordHash: 'hashed-password',
            });
            mockBcrypt.compare.mockResolvedValue(false);

            await expect(AuthService.login(loginData)).rejects.toThrow('Invalid email or password');
        });
    });

    describe('getProfile', () => {
        it('should return user profile', async () => {
            const mockUser = {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockPrisma.user.findUnique.mockResolvedValue(mockUser);

            const result = await AuthService.getProfile(1);

            expect(result).toEqual(mockUser);
        });

        it('should throw NotFoundError for non-existent user', async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null);

            await expect(AuthService.getProfile(999)).rejects.toThrow('User not found');
        });
    });

    describe('updateProfile', () => {
        it('should update user name', async () => {
            mockPrisma.user.findUnique.mockResolvedValue({ id: 1 });
            mockPrisma.user.update.mockResolvedValue({
                id: 1,
                name: 'Updated Name',
                email: 'john@example.com',
                updatedAt: new Date(),
            });

            const result = await AuthService.updateProfile(1, { name: 'Updated Name' });

            expect(result.name).toBe('Updated Name');
        });

        it('should throw NotFoundError for non-existent user', async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null);

            await expect(AuthService.updateProfile(999, { name: 'Test' })).rejects.toThrow('User not found');
        });
    });
});
