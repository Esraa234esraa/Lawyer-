import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { type User } from '@/types'
import { useLogin } from '@/hooks/auth/useAuthMutations'

interface LoginInput {
  email: string
  password: string
}

interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (credentials: LoginInput) => Promise<User>
  logout: () => void
  clearError: () => void
}

const AUTH_TOKEN_KEY = 'auth_token'
const AUTH_USER_KEY = 'auth_user'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const normalizeUser = (rawUser: unknown, email: string): User => {
  const candidate = (rawUser ?? {}) as Partial<User> & {
    name?: string
    fullName?: string
    FullName?: string
    Email?: string
    Role?: string
    role?: User['role']
    id?: string | number
    Id?: string | number
  }

  const nameFallback =
    candidate.name || candidate.fullName || candidate.FullName || email

  const rawRole = (candidate.role || candidate.Role || '').toString().toLowerCase()
  const roleFallback: User['role'] =
    rawRole === 'admin'
      ? 'admin'
      : rawRole === 'user' || rawRole === 'client'
        ? 'client'
        : email.includes('admin')
          ? 'admin'
          : 'client'

  return {
    id: String(candidate.id ?? candidate.Id ?? email),
    email: candidate.email ?? candidate.Email ?? email,
    nameAr: candidate.nameAr ?? nameFallback,
    nameEn: candidate.nameEn ?? nameFallback,
    role: roleFallback,
    avatar: candidate.avatar,
    createdAt: candidate.createdAt ? new Date(candidate.createdAt) : new Date(),
  }
}

const parseStoredUser = (value: string | null): User | null => {
  if (!value) {
    return null
  }

  try {
    const parsed = JSON.parse(value) as Omit<User, 'createdAt'> & {
      createdAt?: string | Date
    }

    return {
      ...parsed,
      createdAt: parsed.createdAt ? new Date(parsed.createdAt) : new Date(),
    }
  } catch {
    return null
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const loginMutation = useLogin()
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(AUTH_TOKEN_KEY)
  )
  const [user, setUser] = useState<User | null>(() =>
    parseStoredUser(localStorage.getItem(AUTH_USER_KEY))
  )
  const [error, setError] = useState<string | null>(null)

  const saveSession = useCallback((nextToken: string, nextUser: User) => {
    localStorage.setItem(AUTH_TOKEN_KEY, nextToken)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser))
    setToken(nextToken)
    setUser(nextUser)
  }, [])

  const clearSession = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const login = useCallback(
    async (credentials: LoginInput) => {
      setError(null)

      try {
        const response = await loginMutation.mutateAsync(credentials)
        const authPayload = response?.data

        const tokenFromApi =
          authPayload?.Token ||
          authPayload?.token ||
          null

        if (!tokenFromApi || typeof tokenFromApi !== 'string') {
          throw new Error('لم يتم استلام رمز التحقق من الخادم')
        }

        const userFromApi = {
          ...(authPayload || {}),
          FullName: authPayload?.FullName,
          Email: authPayload?.Email || credentials.email,
          Role:
            authPayload?.Roles?.[0] ||
            authPayload?.roles?.[0],
          Id: authPayload?.Id || authPayload?.id,
        }
        const normalizedUser = normalizeUser(userFromApi, credentials.email)

        saveSession(tokenFromApi, normalizedUser)
        return normalizedUser
      } catch (err) {
        const nextError =
          err instanceof Error ? err.message : 'فشل تسجيل الدخول'
        setError(nextError)
        throw err
      }
    },
    [loginMutation, saveSession]
  )

  const logout = useCallback(() => {
    setError(null)
    clearSession()
  }, [clearSession])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading: loginMutation.isPending,
      error,
      login,
      logout,
      clearError,
    }),
    [clearError, error, login, loginMutation.isPending, logout, token, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }

  return context
}
