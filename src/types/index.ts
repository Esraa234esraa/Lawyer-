export type UserRole = 'admin' | 'client' | 'guest'
export type Language = 'ar' | 'en'

export interface User {
  id: string
  email: string
  nameAr: string
  nameEn: string
  role: UserRole
  avatar?: string
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface NavItem {
  labelAr: string
  labelEn: string
  href: string
  icon?: React.ReactNode
}

export interface PageTransitionProps {
  children: React.ReactNode
}

export interface TextContent {
  ar: string
  en: string
}