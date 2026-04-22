// ============================================================================
// Language & UI Types
// ============================================================================
export type UserRole = 'admin' | 'client' | 'guest'
export type Language = 'ar' | 'en'

// ============================================================================
// User & Auth Types
// ============================================================================

/**
 * User object representing authenticated user
 * Stores both Arabic and English names for RTL/LTR support
 */
export interface User {
  id: string
  email: string
  nameAr: string
  nameEn: string
  role: UserRole
  avatar?: string
  createdAt: Date
}

/**
 * Auth state for context or store
 */
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

/**
 * Response envelope from server for login/register
 */
export interface AuthResponse {
  user: User
  token: string
  message?: string
}

/**
 * Generic API response wrapper used across all endpoints
 * Supports multiple success flag naming conventions
 */
export interface ApiResponse<T> {
  success?: boolean
  isSuccess?: boolean
  succeeded?: boolean
  Success?: boolean
  IsSuccess?: boolean
  Succeeded?: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string | string[]>
}

/**
 * Error response from API
 */
export interface ApiErrorResponse {
  success: false
  message?: string
  error?: string
  errors?: Record<string, string | string[]>
}

/**
 * Request/Response Payloads for Auth Endpoints
 */
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

export interface SendPasswordResetRequest {
  email: string
}

export interface ConfirmResetPasswordRequest {
  email: string
  code: string
}

export interface ResetPasswordRequest {
  email: string
  password: string
}

/**
 * Authentication result from backend
 * Handles multiple naming conventions for fields
 */
export interface AuthResult {
  Token?: string
  token?: string
  Id?: string
  id?: string
  Roles?: string[]
  roles?: string[]
  FullName?: string
  fullName?: string
  Email?: string
  email?: string
  message?: string
  success?: boolean
}

// ============================================================================
// Navigation & UI Components
// ============================================================================

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