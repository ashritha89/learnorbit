/**
 * Common TypeScript Type Definitions
 * 
 * Shared types used across the application
 */

/**
 * User Types
 */
export type UserRole = 'student' | 'instructor' | 'admin';

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    created_at?: string;
    updated_at?: string;
}

/**
 * Course Types
 */
export interface Course {
    id: number;
    title: string;
    description: string;
    instructor_id: number;
    instructor_name?: string;
    thumbnail_url?: string;
    is_published: boolean;
    is_free: boolean;
    price?: number;
    created_at: string;
    updated_at: string;
}

/**
 * Lesson Types
 */
export interface Lesson {
    id: number;
    course_id: number;
    title: string;
    content: string;
    video_url?: string;
    order_index: number;
    duration_minutes?: number;
    created_at: string;
    updated_at: string;
}

/**
 * Enrollment Types
 */
export type EnrollmentStatus = 'pending' | 'approved' | 'rejected';

export interface Enrollment {
    id: number;
    student_id: number;
    course_id: number;
    status: EnrollmentStatus;
    enrolled_at: string;
    approved_at?: string;
}

/**
 * Progress Types
 */
export interface Progress {
    id: number;
    student_id: number;
    lesson_id: number;
    completed: boolean;
    completed_at?: string;
}

/**
 * API Response Types
 */
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

/**
 * Form Types
 */
export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: UserRole;
}

/**
 * Dashboard Stats Types
 */
export interface DashboardStats {
    totalCourses?: number;
    totalStudents?: number;
    totalInstructors?: number;
    totalEnrollments?: number;
    pendingEnrollments?: number;
    completedLessons?: number;
}
