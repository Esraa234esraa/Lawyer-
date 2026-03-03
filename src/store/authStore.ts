import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { User, UserRole } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User | null) => void
  clearError: () => void
  checkAuth: () => void
}

// Mock user data - Arabic names
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@lawfirm.ar': {
    password: 'admin123',
    user: {
      id: '1',
      email: 'admin@lawfirm.ar',
      nameAr: 'مسؤول النظام',
      nameEn: 'System Admin',
      role: 'admin' as UserRole,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      createdAt: new Date(),
    },
  },
  'client@lawfirm.ar': {
    password: 'client123',
    user: {
      id: '2',
      email: 'client@lawfirm.ar',
      nameAr: 'أحمد محمد',
      nameEn: 'Ahmed Mohammed',
      role: 'client' as UserRole,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=client',
      createdAt: new Date(),
    },
  },
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null })

          try {
            // Simulate API call delay
            await new Promise((resolve) => setTimeout(resolve, 800))

            const mockUser = MOCK_USERS[email]
            if (!mockUser) {
              throw new Error('المستخدم غير موجود')
            }

            if (mockUser.password !== password) {
              throw new Error('كلمة المرور غير صحيحة')
            }

            const token = `token_${Date.now()}`
            set({
              user: mockUser.user,
              token,
              isAuthenticated: true,
              isLoading: false,
            })
          } catch (err) {
            const error = err instanceof Error ? err.message : 'فشل تسجيل الدخول'
            set({
              error,
              isLoading: false,
              isAuthenticated: false,
            })
            throw err
          }
        },

        logout: () => {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          })
        },

        setUser: (user) => {
          set({
            user,
            isAuthenticated: !!user,
          })
        },

        clearError: () => {
          set({ error: null })
        },

        checkAuth: () => {
          const { user, token } = useAuthStore.getState()
          if (!user || !token) {
            set({ isAuthenticated: false })
          }
        },
      }),
      {
        name: 'auth-storage-rtl',
      }
    )
  )
)