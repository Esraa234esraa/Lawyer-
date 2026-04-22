/**
 * News Management TypeScript Types
 * Comprehensive type definitions for news operations
 */

// ============================================================================
// Base News Model
// ============================================================================

/**
 * News response from backend list endpoints (GetAllNewsAsync, GetOnlyVisibleNewsAsync)
 */
export interface News {
  id: string
  name: string
  description: string
  filePath: string // Backend uses filePath, not image
  isActive: boolean // Backend includes isActive flag
  isVisible: boolean
  createAt: string // Backend field name (appears to be createAt)
  actionDate: string | Date
}

/**
 * Extended News response from single record endpoint (GetNewsByIdAsync)
 * Includes additional audit fields
 */
export interface NewsDetail extends News {
  createdAt: string | Date
  deletedAt: string | null
  updatedAt: string | Date
  isDeleted: boolean
}

export interface NewsCreateInput {
  name: string
  description: string
  image: File
  actionDate: string | Date
}

export interface NewsUpdateInput {
  name: string
  description: string
  image?: File
  actionDate: string | Date
}

// ============================================================================
// API Response Models
// ============================================================================

/**
 * Generic API Response wrapper for all endpoints
 * All endpoints follow this structure: { success, message, data, errors }
 */
export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  error?: string
  errors?: Record<string, string | string[]>
}

/**
 * Specific response type for AddNewsAsync
 * Returns the created news ID as string
 */
export interface AddNewsResponse extends ApiResponse<string> {
  data?: string // UUID of created news
}

/**
 * Specific response type for Hide/Show/Delete operations
 * Returns boolean indicating success
 */
export interface ToggleNewsResponse extends ApiResponse<boolean> {
  data?: boolean // true if operation succeeded
}

export interface PaginatedResponse<T> {
  success: boolean
  message?: string
  data?: T[]
  totalCount?: number
  pageSize?: number
  currentPage?: number
  error?: string
}

// ============================================================================
// React Query Types
// ============================================================================

export interface QueryOptions {
  enabled?: boolean
  staleTime?: number
  cacheTime?: number
  retry?: number
  refetchOnMount?: boolean
  refetchOnWindowFocus?: boolean
}

export interface MutationOptions {
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
  onSettled?: () => void
}

// ============================================================================
// Form & UI Types
// ============================================================================

export interface NewsFormData {
  name: string
  description: string
  image: File | null
  actionDate: string
}

export interface NewsFilters {
  search?: string
  isVisible?: boolean
  sortBy?: 'date' | 'name'
  sortOrder?: 'asc' | 'desc'
}

// ============================================================================
// Error Types
// ============================================================================

export interface NewsError {
  message: string
  code?: string
  field?: string
  statusCode?: number
}

// ============================================================================
// Validation Types
// ============================================================================

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export interface NewsValidationRules {
  name: {
    required: boolean
    minLength?: number
    maxLength?: number
  }
  description: {
    required: boolean
    minLength?: number
    maxLength?: number
  }
  image: {
    required: boolean
    maxSize?: number // in bytes
    allowedTypes?: string[]
  }
  actionDate: {
    required: boolean
  }
}
