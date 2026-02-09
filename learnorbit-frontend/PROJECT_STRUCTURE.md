# LearnOrbit Frontend - Project Structure

## 📁 Folder Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes (grouped layout)
│   │   ├── login/                # Login page
│   │   └── register/             # Registration page
│   ├── (public)/                 # Public routes (grouped layout)
│   │   └── courses/              # Public course catalog
│   ├── (dashboard)/              # Protected dashboard routes (grouped layout)
│   │   ├── student/              # Student dashboard
│   │   ├── instructor/           # Instructor dashboard
│   │   └── admin/                # Admin dashboard
│   ├── layout.tsx                # Root layout with Sonner Toaster
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── layout/                   # Layout components (Navbar, Footer, Sidebar)
│   ├── courses/                  # Course-related components
│   └── dashboard/                # Dashboard-specific components
│
├── lib/                          # Utility libraries
│   ├── api.ts                    # Axios instance with interceptors
│   ├── auth.ts                   # Authentication helpers
│   ├── utils.ts                  # shadcn/ui utils (cn helper)
│   └── validators/               # Zod validation schemas
│       └── index.ts              # All form validation schemas
│
├── hooks/                        # Custom React hooks
│   └── .gitkeep
│
└── types/                        # TypeScript type definitions
    └── index.ts                  # Shared types (User, Course, etc.)
```

## 🔧 Core Files

### `lib/api.ts`
Centralized Axios API client with:
- Base URL configuration from environment variables
- Request interceptor for automatic JWT token attachment
- Response interceptor for error handling (401, 403, 500)
- Helper functions for GET, POST, PUT, PATCH, DELETE requests

**Usage:**
```typescript
import { get, post } from '@/lib/api';

// GET request
const courses = await get<Course[]>('/courses');

// POST request
const newCourse = await post<Course>('/courses', courseData);
```

### `lib/auth.ts`
Authentication utilities for:
- Token management (access & refresh tokens)
- User data management in localStorage
- Role-based access control helpers
- JWT token decoding and validation
- Logout functionality

**Usage:**
```typescript
import { setTokens, getCurrentUser, hasRole, logout } from '@/lib/auth';

// After login
setTokens(accessToken, refreshToken);
setCurrentUser(userData);

// Check authentication
const user = getCurrentUser();
const isInstructor = hasRole('instructor');

// Logout
logout();
```

### `lib/validators/index.ts`
Zod validation schemas for:
- Authentication (login, register)
- Courses (create, update)
- Lessons (create, update)
- Contact forms
- Profile updates
- Password changes

**Usage:**
```typescript
import { loginSchema } from '@/lib/validators';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm({
  resolver: zodResolver(loginSchema),
  defaultValues: { email: '', password: '' }
});
```

### `types/index.ts`
TypeScript type definitions for:
- User, Course, Lesson, Enrollment, Progress
- API responses (ApiResponse, PaginatedResponse)
- Form data types
- Dashboard statistics

**Usage:**
```typescript
import type { User, Course, ApiResponse } from '@/types';

const user: User = getCurrentUser();
const response: ApiResponse<Course[]> = await get('/courses');
```

### `app/layout.tsx`
Root layout with:
- Inter font configuration
- SEO metadata (title, description, Open Graph)
- Sonner Toaster for global toast notifications

**Toast Usage:**
```typescript
import { toast } from 'sonner';

toast.success('Course created successfully!');
toast.error('Failed to create course');
toast.info('Processing your request...');
```

## 🌐 Environment Variables

Create `.env.local` in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:65000/api

# Application Configuration
NEXT_PUBLIC_APP_NAME=LearnOrbit
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🎨 Route Groups Explained

### `(auth)` - Authentication Routes
- **Purpose**: Login and registration pages
- **Layout**: Can have a custom layout without navbar/footer
- **Access**: Public (unauthenticated users)

### `(public)` - Public Routes
- **Purpose**: Publicly accessible content (course catalog)
- **Layout**: Standard layout with navbar and footer
- **Access**: Public (all users)

### `(dashboard)` - Protected Dashboard Routes
- **Purpose**: Role-based dashboards
- **Layout**: Dashboard layout with sidebar navigation
- **Access**: Protected (authenticated users only)
- **Roles**:
  - `/student` - Student dashboard
  - `/instructor` - Instructor dashboard
  - `/admin` - Admin dashboard

## 🚀 Next Steps

1. **Create layout files for route groups:**
   - `app/(auth)/layout.tsx` - Auth pages layout
   - `app/(public)/layout.tsx` - Public pages layout
   - `app/(dashboard)/layout.tsx` - Dashboard layout with sidebar

2. **Build reusable components:**
   - `components/layout/Navbar.tsx`
   - `components/layout/Footer.tsx`
   - `components/layout/Sidebar.tsx`
   - `components/courses/CourseCard.tsx`

3. **Create custom hooks:**
   - `hooks/useAuth.ts` - Authentication state management
   - `hooks/useCourses.ts` - Course data fetching
   - `hooks/useEnrollment.ts` - Enrollment management

4. **Implement pages:**
   - Login page with form validation
   - Registration page with role selection
   - Course catalog with filtering
   - Dashboard pages for each role

## 📚 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Notifications**: Sonner

## 🔐 Authentication Flow

1. User submits login form
2. Form validated with Zod schema
3. API request sent via Axios
4. Tokens stored in localStorage
5. User data cached
6. Redirect to appropriate dashboard based on role
7. Subsequent requests automatically include JWT token
8. 401 responses trigger automatic logout and redirect

---

**Built with ❤️ by the LearnOrbit Team**
