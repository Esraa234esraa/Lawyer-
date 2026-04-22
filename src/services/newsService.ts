/**
 * News API Service Layer
 * Handles all API communication for news management
 * Uses Axios with multipart/form-data for file uploads
 */

import axiosInstance from '@/api/axiosInstance'
import { News, NewsDetail, NewsCreateInput, NewsUpdateInput, ApiResponse, AddNewsResponse, ToggleNewsResponse } from '@/types/news'
import { getApiErrorMessage } from '@/utils/apiError'

// ============================================================================
// Types & Constants
// ============================================================================

const GUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const BASE_URL = '/api/News'

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validate GUID format
 * Prevents sending invalid IDs to backend
 */
const isValidGuid = (id: string): boolean => {
  if (!id || typeof id !== 'string') {
    return false
  }
  return GUID_REGEX.test(id)
}

/**
 * Validate news ID before making requests
 * Throws descriptive error if invalid
 */
const validateNewsId = (id: string, operation: string): void => {
  if (!isValidGuid(id)) {
    throw new Error(`Invalid news ID for ${operation}: ${id}`)
  }
}

/**
 * Validate required fields for news creation
 */
const validateNewsCreateInput = (input: NewsCreateInput): void => {
  const errors: string[] = []

  if (!input.name || input.name.trim().length === 0) {
    errors.push('News name is required')
  }

  if (!input.description || input.description.trim().length === 0) {
    errors.push('News description is required')
  }

  if (!input.image) {
    errors.push('News image is required')
  }

  if (input.image && !(input.image instanceof File)) {
    errors.push('Invalid image file')
  }

  if (!input.actionDate) {
    errors.push('Action date is required')
  }

  if (errors.length > 0) {
    throw new Error(errors.join('; '))
  }
}

/**
 * Validate required fields for news update
 */
const validateNewsUpdateInput = (input: NewsUpdateInput): void => {
  const errors: string[] = []

  if (!input.name || input.name.trim().length === 0) {
    errors.push('News name is required')
  }

  if (!input.description || input.description.trim().length === 0) {
    errors.push('News description is required')
  }

  if (!input.actionDate) {
    errors.push('Action date is required')
  }

  if (errors.length > 0) {
    throw new Error(errors.join('; '))
  }
}

// ============================================================================
// FormData Builders
// ============================================================================

/**
 * Build FormData for news creation
 * Properly handles file uploads without manual Content-Type header
 */
const buildNewsCreateFormData = (input: NewsCreateInput): FormData => {
  const formData = new FormData()

  formData.append('Name', input.name)
  formData.append('Description', input.description)
  formData.append('Image', input.image)
  formData.append('ActionDate', input.actionDate instanceof Date ? input.actionDate.toISOString() : input.actionDate)

  return formData
}

/**
 * Build FormData for news update
 * Only includes image if provided
 */
const buildNewsUpdateFormData = (input: NewsUpdateInput): FormData => {
  const formData = new FormData()

  formData.append('Name', input.name)
  formData.append('Description', input.description)
  if (input.image) {
    formData.append('Image', input.image)
  }
  formData.append('ActionDate', input.actionDate instanceof Date ? input.actionDate.toISOString() : input.actionDate)

  return formData
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * GET /api/News/GetAllNewsAsync
 * Fetch all news (admin only)
 */
export const getAllNews = async (): Promise<ApiResponse<News[]>> => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/GetAllNewsAsync`)
    return response.data
  } catch (error) {
    const errorMessage = getApiErrorMessage(error)
    throw new Error(errorMessage)
  }
}

/**
 * GET /api/News/GetOnlyVisibleNewsAsync
 * Fetch only visible news (public)
 */
export const getVisibleNews = async (): Promise<ApiResponse<News[]>> => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/GetOnlyVisibleNewsAsync`)
    return response.data
  } catch (error) {
    const errorMessage = getApiErrorMessage(error)
    throw new Error(errorMessage)
  }
}

/**
 * GET /api/News/GetNewsByIdAsync/{id}
 * Fetch single news by ID
 * Returns extended News object with audit fields (createdAt, deletedAt, updatedAt, isDeleted)
 */
export const getNewsById = async (id: string): Promise<ApiResponse<NewsDetail>> => {
  try {
    validateNewsId(id, 'getNewsById')

    const response = await axiosInstance.get(`${BASE_URL}/GetNewsByIdAsync/${id}`)
    return response.data
  } catch (error) {
    const errorMessage = getApiErrorMessage(error)
    throw new Error(errorMessage)
  }
}

/**
 * POST /api/News/AddNewsAsync
 * Create new news item with image upload
 * Returns the ID of the created news as string
 * Uses FormData for multipart/form-data
 */
export const addNews = async (input: NewsCreateInput): Promise<AddNewsResponse> => {
  try {
    validateNewsCreateInput(input)

    const formData = buildNewsCreateFormData(input)

    const response = await axiosInstance.post(`${BASE_URL}/AddNewsAsync`, formData, {
      headers: {
        // Don't set Content-Type - browser will set it with boundary
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  } catch (error) {
    const errorMessage = getApiErrorMessage(error)
    throw new Error(errorMessage)
  }
}

/**
 * PUT /api/News/UpdateNewsAsync/{id}
 * Update existing news with optional image upload
 * Returns success boolean
 * Uses FormData for multipart/form-data
 */
export const updateNews = async (id: string, input: NewsUpdateInput): Promise<ToggleNewsResponse> => {
  try {
    validateNewsId(id, 'updateNews')
    validateNewsUpdateInput(input)

    const formData = buildNewsUpdateFormData(input)

    const response = await axiosInstance.put(`${BASE_URL}/UpdateNewsAsync/${id}`, formData, {
      headers: {
        // Don't set Content-Type - browser will set it with boundary
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  } catch (error) {
    const errorMessage = getApiErrorMessage(error)
    throw new Error(errorMessage)
  }
}

/**
 * DELETE /api/News/{id}
 * Delete (soft delete) news by ID
 * Returns boolean indicating success
 */
export const deleteNews = async (id: string): Promise<ToggleNewsResponse> => {
  try {
    validateNewsId(id, 'deleteNews')

    const response = await axiosInstance.delete(`${BASE_URL}/${id}`)
    return response.data
  } catch (error) {
    const errorMessage = getApiErrorMessage(error)
    throw new Error(errorMessage)
  }
}

/**
 * PUT /api/News/HideNewsAsync/{id}
 * Hide news from public view (set isVisible to false)
 * Returns boolean indicating success
 */
export const hideNews = async (id: string): Promise<ToggleNewsResponse> => {
  try {
    validateNewsId(id, 'hideNews')

    const response = await axiosInstance.put(`${BASE_URL}/HideNewsAsync/${id}`)
    return response.data
  } catch (error) {
    const errorMessage = getApiErrorMessage(error)
    throw new Error(errorMessage)
  }
}

/**
 * PUT /api/News/VisibleNewsAsync/{id}
 * Show news to public (set isVisible to true)
 * Returns boolean indicating success
 */
export const showNews = async (id: string): Promise<ToggleNewsResponse> => {
  try {
    validateNewsId(id, 'showNews')

    const response = await axiosInstance.put(`${BASE_URL}/VisibleNewsAsync/${id}`)
    return response.data
  } catch (error) {
    const errorMessage = getApiErrorMessage(error)
    throw new Error(errorMessage)
  }
}

// ============================================================================
// Export validation functions for external use
// ============================================================================

export const newsServiceValidation = {
  isValidGuid,
  validateNewsId,
  validateNewsCreateInput,
  validateNewsUpdateInput,
}
