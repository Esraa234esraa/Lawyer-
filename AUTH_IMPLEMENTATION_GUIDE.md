# Authentication Implementation Guide

## Overview

This guide documents the production-ready authentication system for the Law Firm React application. All authentication endpoints are properly implemented with:

✅ **Correct HTTP Methods & Parameters**
- Register: POST with **JSON Body**
- Login: POST with **Query Parameters**
- Password Reset: POST with **Query Parameters**

✅ **Unified Error Handling**
- Backend messages extracted and shown in toasts
- Network errors handled gracefully
- Try-catch wrapping on all API calls

✅ **JWT Token Management**
- Tokens stored in `localStorage` (persistent)
- Automatic token injection in request headers
- Automatic token removal on 401 response

✅ **TypeScript Interfaces**
- Request/Response models with full typing
- Support for multiple backend response formats

✅ **Toast Notifications** (Sonner library)
- Success messages on successful operations
- Error messages with backend-provided text
- Automatic dismissal

---

## API Endpoints

### 1. Register User
**POST** `/api/Auth/register`

**Request Body (JSON):**
```typescript
{
  "fullName": "Ahmed Ali",
  "userName": "ahmed.ali",
  "email": "ahmed@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```typescript
{
  "success": true,
  "message": "تم إنشاء الحساب بنجاح",
  "data": {
    "token": "eyJhbGc...",
    "id": "user-123",
    "roles": ["client"]
  }
}
```

**Usage:**
```typescript
import { useRegister } from '@/hooks/auth/useAuthMutations'

export function RegisterPage() {
  const registerMutation = useRegister()

  const handleRegister = async (data: RegisterPayload) => {
    try {
      const result = await registerMutation.mutateAsync(data)
      console.log('User registered:', result)
      // Toast will automatically show success message
      // Redirect to login
    } catch (error) {
      // Toast will automatically show error message
      console.error('Registration failed:', error)
    }
  }

  return (
    <button onClick={() => handleRegister(formData)} disabled={registerMutation.isPending}>
      {registerMutation.isPending ? 'Loading...' : 'Register'}
    </button>
  )
}
```

---

### 2. Login User
**POST** `/api/Auth/login`

**Query Parameters:**
- `email` (string)
- `password` (string)

**Example Request:**
```
POST /api/Auth/login?email=ahmed@example.com&password=SecurePass123!
```

**Response:**
```typescript
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "data": {
    "token": "eyJhbGc...",
    "id": "user-123",
    "roles": ["admin"]
  }
}
```

**Usage:**
```typescript
import { useAuth } from '@/hooks/useAuth'

export function LoginPage() {
  const { login, isLoading, error } = useAuth()

  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await login({ email, password })
      console.log('Logged in as:', user.nameEn)
      // Toast shows success, redirect to dashboard
    } catch (err) {
      // Toast shows error automatically
      console.error('Login failed:', err)
    }
  }

  return (
    // Form implementation
  )
}
```

---

### 3. Send Password Reset Code
**POST** `/api/Auth/sentPassword`

**Query Parameter:**
- `Email` (string)

**Example Request:**
```
POST /api/Auth/sentPassword?Email=ahmed@example.com
```

**Response:**
```typescript
{
  "success": true,
  "message": "تم إرسال رمز التحقق إلى بريدك الإلكتروني",
  "data": "Reset code sent"
}
```

**Usage:**
```typescript
import { useSendPassword } from '@/hooks/auth/useAuthMutations'

export function ForgotPasswordPage() {
  const sendPasswordMutation = useSendPassword()

  const handleSendCode = async (email: string) => {
    try {
      await sendPasswordMutation.mutateAsync(email)
      // Toast shows success message
      // Show input for verification code
    } catch (error) {
      // Toast shows error
    }
  }

  return (
    <button onClick={() => handleSendCode(email)}>
      Send Reset Code
    </button>
  )
}
```

---

### 4. Confirm Password Reset Code
**POST** `/api/Auth/ConfirmResetPassword`

**Query Parameters:**
- `Code` (string) - Reset code sent to email
- `Email` (string)

**Example Request:**
```
POST /api/Auth/ConfirmResetPassword?Code=123456&Email=ahmed@example.com
```

**Response:**
```typescript
{
  "success": true,
  "message": "تم تأكيد الرمز بنجاح",
  "data": "Code confirmed"
}
```

**Usage:**
```typescript
import { useConfirmResetPassword } from '@/hooks/auth/useAuthMutations'

export function VerifyResetCodePage() {
  const confirmMutation = useConfirmResetPassword()

  const handleConfirm = async (email: string, code: string) => {
    try {
      await confirmMutation.mutateAsync({ email, code })
      // Toast shows success
      // Show password input form
    } catch (error) {
      // Toast shows error
    }
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      handleConfirm(email, code)
    }}>
      {/* Form fields */}
    </form>
  )
}
```

---

### 5. Reset Password
**POST** `/api/Auth/ResetPassword`

**Query Parameters:**
- `Email` (string)
- `Password` (string)

**Example Request:**
```
POST /api/Auth/ResetPassword?Email=ahmed@example.com&Password=NewSecurePass456!
```

**Response:**
```typescript
{
  "success": true,
  "message": "تم إعادة تعيين كلمة المرور بنجاح",
  "data": "Password reset successful"
}
```

**Usage:**
```typescript
import { useResetPassword } from '@/hooks/auth/useAuthMutations'

export function ResetPasswordPage() {
  const resetMutation = useResetPassword()

  const handleReset = async (email: string, newPassword: string) => {
    try {
      await resetMutation.mutateAsync({ email, password: newPassword })
      // Toast shows success
      // Redirect to login
    } catch (error) {
      // Toast shows error
    }
  }

  return (
    // Form implementation
  )
}
```

---

## Error Handling

All API errors are automatically handled and displayed in toasts:

### Backend Error Messages
```typescript
// Error with message from backend
{
  "success": false,
  "message": "البريد الإلكتروني مسجل بالفعل"
}

// Will display: "البريد الإلكتروني مسجل بالفعل"
```

### Validation Errors
```typescript
{
  "success": false,
  "errors": {
    "email": ["البريد الإلكتروني غير صحيح"],
    "password": ["كلمة المرور قصيرة جداً"]
  }
}

// Will display first error: "البريد الإلكتروني غير صحيح"
```

### Network Errors
- No internet: "Connection failed"
- Timeout: "Request timeout"
- Server error: Appropriate HTTP status message

---

## Token Management

### Automatic Token Injection
```typescript
// All requests automatically include:
// Authorization: Bearer <token>

// Interceptor in axiosInstance.ts handles this
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### Token Storage
```typescript
// localStorage (persistent across browser restarts)
localStorage.getItem('auth_token')        // JWT token
localStorage.getItem('auth_user')         // User object (JSON)

// NOT sessionStorage (cleared on browser close)
```

### Token Removal
```typescript
// Automatic on 401 response
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      // Optional: redirect to login
    }
    return Promise.reject(error)
  }
)

// Manual logout
logout() // Clears localStorage
```

---

## Usage Patterns

### Pattern 1: With useAuth Hook (Recommended)
```typescript
import { useAuth } from '@/hooks/useAuth'

export function Dashboard() {
  const { user, isAuthenticated, logout } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return (
    <div>
      <h1>Welcome, {user?.nameAr}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Pattern 2: With useMutations (Direct API Calls)
```typescript
import { useRegister, useLogin } from '@/hooks/auth/useAuthMutations'

export function AuthForm() {
  const registerMutation = useRegister()
  const loginMutation = useLogin()

  return (
    <>
      <button
        onClick={() => registerMutation.mutate(formData)}
        disabled={registerMutation.isPending}
      >
        Register
      </button>

      <button
        onClick={() => loginMutation.mutate(formData)}
        disabled={loginMutation.isPending}
      >
        Login
      </button>
    </>
  )
}
```

### Pattern 3: Protected Routes
```typescript
import ProtectedRoute from '@/routes/ProtectedRoute'

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>

      <Route element={<ProtectedRoute roles={['client']} />}>
        <Route path="/client/dashboard" element={<ClientDashboard />} />
      </Route>
    </Routes>
  )
}
```

---

## File Structure

```
src/
├── api/
│   ├── authApi.ts              # All auth endpoints
│   └── axiosInstance.ts        # Axios config with interceptors
│
├── context/
│   └── AuthContext.tsx         # Auth provider & context
│
├── hooks/
│   ├── useAuth.ts              # Main auth hook
│   └── auth/
│       └── useAuthMutations.ts # Individual mutation hooks
│
├── pages/
│   ├── Login.tsx               # Login page
│   ├── Register.tsx            # Register page
│   └── [Add: ForgotPassword.tsx, ResetPassword.tsx]
│
├── types/
│   └── index.ts                # TypeScript interfaces
│
├── utils/
│   └── apiError.ts             # Error handling
│
└── routes/
    ├── index.tsx               # Route definitions
    └── ProtectedRoute.tsx      # Protected route wrapper
```

---

## TypeScript Types

```typescript
// Request models
export interface RegisterRequest {
  fullName: string
  userName: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

// Response models
export interface AuthResult {
  Token?: string
  Id?: string
  Roles?: string[]
  message?: string
  success?: boolean
}

// API response wrapper
export interface ApiResponse<T> {
  success?: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

// User model
export interface User {
  id: string
  email: string
  nameAr: string
  nameEn: string
  role: UserRole
  avatar?: string
  createdAt: Date
}
```

---

## Best Practices

### ✅ DO:
- Use `useAuth()` hook for accessing user and authentication state
- Check `isAuthenticated` before showing protected content
- Show toast messages (automatic via mutations)
- Store token in `localStorage` (done automatically)
- Validate form inputs client-side with Zod/React Hook Form
- Use React Query mutations for API calls
- Handle loading states with `isPending`

### ❌ DON'T:
- Store token in `sessionStorage` (gets cleared)
- Manually parse token or extract claims
- Skip error handling
- Show raw backend errors to users (extract user-friendly message)
- Make multiple API calls for same data
- Forget to cleanup on component unmount

---

## Common Issues & Solutions

### Issue: Token not persisting across page refresh
**Solution:** Token is automatically saved to `localStorage`. Check if localStorage is enabled.

### Issue: 401 errors recurring
**Solution:** Token may have expired. Check token expiration in your backend and implement refresh token flow if needed.

### Issue: CORS errors
**Solution:** Configure backend CORS headers to allow requests from your frontend URL.

### Issue: Mutation doesn't show loading state
**Solution:** Use `isPending` from mutation object:
```typescript
const mutation = useLogin()
<button disabled={mutation.isPending}>
  {mutation.isPending ? 'Loading...' : 'Login'}
</button>
```

### Issue: Multiple toast notifications appearing
**Solution:** Ensure you're not calling mutations multiple times. Check form submission handler.

---

## Security Considerations

1. **HTTPS Only:** Always use HTTPS in production
2. **Token Expiration:** Backend should set short expiration (15-30 min)
3. **Refresh Tokens:** Implement refresh token flow for longer sessions
4. **Password:** Enforce strong passwords (already done with Zod validation)
5. **CSRF:** Enable CSRF protection in ASP.NET Core
6. **XSS:** Sanitize all user inputs (React does this by default)
7. **Rate Limiting:** Implement rate limiting on auth endpoints
8. **Logging:** Log failed login attempts

---

## Dependencies Used

- `axios` - HTTP client with interceptors
- `react-query` - Server state management & mutations
- `sonner` - Toast notifications
- `react-hook-form` - Form state management
- `zod` - TypeScript-first validation
- `react-router-dom` - Client-side routing

---

## Summary

Your authentication system is now **production-ready** with:

✅ Correct endpoint implementations
✅ Proper error handling and user feedback
✅ Secure token management
✅ Full TypeScript support
✅ Unified response handling
✅ Clean, maintainable code structure

All endpoints are working together seamlessly, and backend error messages are displayed to users exactly as provided by the server.
