import { z } from 'zod';

//Register Schema
export const registerSchema = z.object({
    name: z
        .string({ required_error: 'Name is required' })
        .trim()
        .min(1, 'Name is required')
        .max(100, 'Name must be at most 100 characters'),
    email: z
        .string({ required_error: 'Email is required' })
        .trim()
        .email('Invalid email address')
        .max(255, 'Email must be at most 255 characters'),
    password: z
        .string({ required_error: 'Password is required' })
        .min(6, 'Password must be at least 6 characters')
        .max(128, 'Password must be at most 128 characters'),
});

//Login Schema
export const loginSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .trim()
        .email('Invalid email address'),
    password: z
        .string({ required_error: 'Password is required' })
        .min(1, 'Password is required'),
});

//Update Profile Schema
export const updateProfileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Name cannot be empty')
        .max(100, 'Name must be at most 100 characters'),
});

//Inferred Types
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
