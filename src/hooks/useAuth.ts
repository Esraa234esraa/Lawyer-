import { useAuthContext } from '@/context/AuthContext'

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, error, login, logout, clearError } =
    useAuthContext()

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: (email: string, password: string) => login({ email, password }),
    logout,
    clearError,
    isAdmin: user?.role === 'admin',
    isClient: user?.role === 'client',
  }
}