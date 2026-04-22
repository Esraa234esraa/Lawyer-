/**
 * Complete Example: Authentication Usage Patterns
 * This file demonstrates all recommended ways to use the authentication system
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useRegister, useLogin } from '@/hooks/auth/useAuthMutations'
import { LoginPayload, RegisterPayload } from '@/api/authApi'

// ============================================================================
// Pattern 1: Using useAuth Hook (Recommended for Components)
// ============================================================================

/**
 * Best for:
 * - Checking if user is authenticated
 * - Getting current user data
 * - Accessing login/logout functions
 * - Showing conditional UI based on user role
 */
export function AuthStatusComponent() {
  const { user, isAuthenticated, isAdmin, isClient, logout } = useAuth()

  if (!isAuthenticated) {
    return <div>Not authenticated</div>
  }

  return (
    <div>
      <h1>Welcome, {user?.nameAr || user?.nameEn}</h1>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>

      {isAdmin && <div>Admin Panel Available</div>}
      {isClient && <div>Client Dashboard Available</div>}

      <button onClick={logout}>Logout</button>
    </div>
  )
}

// ============================================================================
// Pattern 2: Login Component with Form
// ============================================================================

/**
 * Best for:
 * - Login page
 * - Handling login flow with error states
 * - Redirecting after login
 */
export function LoginFormComponent() {
  const navigate = useNavigate()
  const { login, isLoading, error } = useAuth()
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // login() expects LoginInput { email, password }
      const user = await login({
        email: formData.email,
        password: formData.password,
      })

      // Toast shown automatically via mutation
      console.log('Logged in user:', user)

      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/client/dashboard')
      }
    } catch (err) {
      // Error already shown in toast
      console.error('Login failed:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        disabled={isLoading}
      />

      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Password"
        disabled={isLoading}
      />

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}

// ============================================================================
// Pattern 3: Register Component with React Hook Form
// ============================================================================

/**
 * Best for:
 * - Registration page
 * - Form validation with Zod
 * - Handling registration flow
 */
export function RegisterFormComponent() {
  const navigate = useNavigate()
  const registerMutation = useRegister()

  const [formData, setFormData] = React.useState<RegisterPayload>({
    fullName: '',
    userName: '',
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // mutateAsync returns the response
      const response = await registerMutation.mutateAsync(formData)

      console.log('Registration response:', response)
      // Toast shown automatically

      // Redirect to login
      navigate('/login')
    } catch (err) {
      // Error already shown in toast
      console.error('Registration failed:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        placeholder="Full Name"
        disabled={registerMutation.isPending}
      />

      <input
        type="text"
        value={formData.userName}
        onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
        placeholder="Username"
        disabled={registerMutation.isPending}
      />

      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        disabled={registerMutation.isPending}
      />

      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Password"
        disabled={registerMutation.isPending}
      />

      <button type="submit" disabled={registerMutation.isPending}>
        {registerMutation.isPending ? 'Registering...' : 'Register'}
      </button>
    </form>
  )
}

// ============================================================================
// Pattern 4: Protected Route Component
// ============================================================================

/**
 * Best for:
 * - Protecting routes that require authentication
 * - Role-based access control
 * - Redirecting unauthenticated users
 */
export function ProtectedComponentExample() {
  const { isAuthenticated, isAdmin, user } = useAuth()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (!isAdmin) {
      navigate('/client/dashboard')
      return
    }
  }, [isAuthenticated, isAdmin, navigate])

  if (!isAuthenticated || !isAdmin) {
    return null // Route guard will redirect
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Logged in as: {user?.nameEn}</p>
    </div>
  )
}

// ============================================================================
// Pattern 5: Direct API Call (Lower Level)
// ============================================================================

/**
 * Best for:
 * - Custom components that need more control
 * - Multiple mutations in one component
 * - Advanced error handling
 */
export function CustomAuthComponent() {
  const navigate = useNavigate()
  const loginMutation = useLogin()
  const registerMutation = useRegister()

  const handleCustomLogin = async (email: string, password: string) => {
    try {
      // mutateAsync is the Promise-based API
      const response = await loginMutation.mutateAsync({
        email,
        password,
      })

      // Response is already successful here
      console.log('Login response:', response)
      // Toast shown automatically via onSuccess

      navigate('/dashboard')
    } catch (error) {
      // Error already shown in toast via onError
      console.error('Custom error handling:', error)
    }
  }

  return (
    <div>
      <button
        onClick={() => handleCustomLogin('test@example.com', 'password123')}
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? 'Loading...' : 'Login'}
      </button>

      {/* Show mutation state */}
      {loginMutation.isError && (
        <p>Error: {loginMutation.error?.message}</p>
      )}
    </div>
  )
}

// ============================================================================
// Pattern 6: Conditional Rendering Based on Auth
// ============================================================================

/**
 * Best for:
 * - Navigation components
 * - Header/Footer with conditional content
 * - Role-specific UI elements
 */
export function ConditionalRenderingExample() {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <nav>
      {isAuthenticated ? (
        <>
          <span>Welcome, {user?.nameEn}</span>
          {user?.role === 'admin' && (
            <a href="/admin/dashboard">Admin Dashboard</a>
          )}
          {user?.role === 'client' && (
            <a href="/client/dashboard">My Dashboard</a>
          )}
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </>
      )}
    </nav>
  )
}

// ============================================================================
// Pattern 7: Handling Loading States
// ============================================================================

/**
 * Best for:
 * - Showing loading indicators
 * - Disabling buttons during requests
 * - Showing error states
 */
export function LoadingStateExample() {
  const { login, isLoading, error } = useAuth()

  return (
    <div>
      <button
        onClick={() =>
          login({
            email: 'test@example.com',
            password: 'password123',
          })
        }
        disabled={isLoading}
        className={isLoading ? 'opacity-50 cursor-not-allowed' : ''}
      >
        {isLoading ? (
          <>
            <span className="spinner" />
            Logging in...
          </>
        ) : (
          'Login'
        )}
      </button>

      {error && (
        <div className="error-alert" role="alert">
          {error}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Pattern 8: Using Multiple Mutations Together
// ============================================================================

/**
 * Best for:
 * - Complex flows like password reset
 * - Sequential API calls
 * - Multiple forms on same page
 */
export function MultiMutationExample() {
  const { useSendPassword, useConfirmResetPassword, useResetPassword } = require(
    '@/hooks/auth/useAuthMutations'
  )

  const sendPasswordMutation = useSendPassword()
  const confirmMutation = useConfirmResetPassword()
  const resetMutation = useResetPassword()

  const handlePasswordReset = async () => {
    try {
      // Step 1: Send reset code
      await sendPasswordMutation.mutateAsync('user@example.com')

      // Step 2: Confirm reset code (typically after user input)
      await confirmMutation.mutateAsync({
        email: 'user@example.com',
        code: '123456',
      })

      // Step 3: Reset password
      await resetMutation.mutateAsync({
        email: 'user@example.com',
        password: 'NewPassword123!',
      })
    } catch (error) {
      console.error('Password reset failed:', error)
      // Errors automatically shown in toasts
    }
  }

  return (
    <button onClick={handlePasswordReset}>
      {sendPasswordMutation.isPending ||
      confirmMutation.isPending ||
      resetMutation.isPending
        ? 'Processing...'
        : 'Reset Password'}
    </button>
  )
}

// ============================================================================
// Pattern 9: Error Boundary with Auth
// ============================================================================

/**
 * Best for:
 * - Handling auth-related errors gracefully
 * - Providing fallback UI
 * - Logging errors
 */
export class AuthErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Auth error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Authentication Error</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.href = '/login'}>
            Return to Login
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// ============================================================================
// Usage in App
// ============================================================================

/**
 * Example: Using all patterns together in your App
 */
export function AppExample() {
  return (
    <AuthErrorBoundary>
      <div>
        <ConditionalRenderingExample />
        <AuthStatusComponent />
        <ProtectedComponentExample />
      </div>
    </AuthErrorBoundary>
  )
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Helper to check if user has specific role
 */
export function useHasRole(allowedRoles: Array<'admin' | 'client' | 'guest'>) {
  const { user } = useAuth()
  return user && allowedRoles.includes(user.role)
}

/**
 * Helper to redirect based on user role
 */
export function useRedirectByRole() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  React.useEffect(() => {
    if (!isAuthenticated) return

    if (user?.role === 'admin') {
      navigate('/admin/dashboard')
    } else if (user?.role === 'client') {
      navigate('/client/dashboard')
    }
  }, [isAuthenticated, user?.role, navigate])
}

/**
 * Helper to automatically retry failed auth requests
 */
export function useAuthWithRetry(maxRetries = 3) {
  const { login } = useAuth()
  const [retryCount, setRetryCount] = React.useState(0)

  const loginWithRetry = async (email: string, password: string) => {
    try {
      const user = await login({ email, password })
      setRetryCount(0)
      return user
    } catch (error) {
      if (retryCount < maxRetries) {
        setRetryCount((prev) => prev + 1)
        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return loginWithRetry(email, password)
      }
      throw error
    }
  }

  return { loginWithRetry, retryCount }
}

export default AppExample
