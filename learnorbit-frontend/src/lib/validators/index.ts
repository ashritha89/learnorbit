/**
 * Zod Validation Schemas
 * 
 * Centralized validation schemas for forms using Zod
 */

import { z } from 'zod';

/**
 * Authentication Schemas
 */

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters'),
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password must not exceed 100 characters'),
    confirmPassword: z
        .string()
        .min(1, 'Please confirm your password'),
    role: z.enum(['student', 'instructor'], {
        message: 'Please select a role',
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

/**
 * Course Schemas
 */

export const courseSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .min(3, 'Title must be at least 3 characters')
        .max(200, 'Title must not exceed 200 characters'),
    description: z
        .string()
        .min(1, 'Description is required')
        .min(10, 'Description must be at least 10 characters')
        .max(2000, 'Description must not exceed 2000 characters'),
    thumbnail_url: z
        .union([z.string().url('Invalid URL'), z.literal('')])
        .optional(),
    is_free: z.boolean().default(true),
    price: z
        .number()
        .min(0, 'Price must be a positive number')
        .optional()
        .nullable(),
});

/**
 * Lesson Schemas
 */

export const lessonSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .min(3, 'Title must be at least 3 characters')
        .max(200, 'Title must not exceed 200 characters'),
    content: z
        .string()
        .min(1, 'Content is required')
        .min(10, 'Content must be at least 10 characters'),
    video_url: z
        .union([z.string().url('Invalid URL'), z.literal('')])
        .optional(),
    duration_minutes: z
        .number()
        .min(1, 'Duration must be at least 1 minute')
        .optional()
        .nullable(),
    order_index: z
        .number()
        .min(0, 'Order index must be a positive number'),
});

/**
 * Contact/Support Schemas
 */

export const contactSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .min(2, 'Name must be at least 2 characters'),
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address'),
    message: z
        .string()
        .min(1, 'Message is required')
        .min(10, 'Message must be at least 10 characters')
        .max(1000, 'Message must not exceed 1000 characters'),
});

/**
 * Profile Update Schema
 */

export const profileUpdateSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters'),
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address'),
});

/**
 * Password Change Schema
 */

export const passwordChangeSchema = z.object({
    currentPassword: z
        .string()
        .min(1, 'Current password is required'),
    newPassword: z
        .string()
        .min(1, 'New password is required')
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password must not exceed 100 characters'),
    confirmPassword: z
        .string()
        .min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

/**
 * Type Exports (inferred from schemas)
 */

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CourseFormData = z.infer<typeof courseSchema>;
export type LessonFormData = z.infer<typeof lessonSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
