import axios from 'axios'

export interface ApiErrorResponse {
  success?: boolean
  message?: string
  error?: string
  errors?: Record<string, string | string[]>
}

/**
 * Extract user-friendly error message from various error formats
 * Handles Axios errors, network errors, and general errors
 */
export const getApiErrorMessage = (error: unknown): string => {
  // Handle Axios errors
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined

    // Try to get message from various response formats
    if (data?.message) {
      return data.message
    }

    if (data?.error) {
      return data.error
    }

    // Handle validation errors
    if (data?.errors && typeof data.errors === 'object') {
      const errorMessages = Object.values(data.errors).flat()
      if (errorMessages.length > 0) {
        return Array.isArray(errorMessages[0])
          ? (errorMessages[0] as string[])[0]
          : (errorMessages[0] as string)
      }
    }

    // Fallback to error message or status text
    return error.message || error.response?.statusText || 'حدث خطأ غير متوقع'
  }

  // Handle standard JavaScript errors
  if (error instanceof Error) {
    return error.message
  }

  // Fallback for unknown error types
  return 'حدث خطأ غير متوقع'
}

/**
 * Helper to extract backend message from successful response with error flag
 * Useful when success flag is false but we need the message
 */
export const getBackendMessage = (data: unknown): string | null => {
  const response = data as ApiErrorResponse | undefined
  return response?.message ?? null
}
