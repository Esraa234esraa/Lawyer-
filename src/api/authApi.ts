import axiosInstance from '@/api/axiosInstance'
import { getApiErrorMessage } from '@/utils/apiError'

/**
 * Backend response envelope (token is wrapped in token property)
 */
interface BackendEnvelope<T> {
  token?: T
}

/**
 * Normalized backend response model that handles various success flag naming conventions
 * Supports: success, isSuccess, succeeded, Success, IsSuccess, Succeeded
 */
interface BackendResponseModel<T> {
  data?: T
  message?: string
  success?: boolean
  isSuccess?: boolean
  succeeded?: boolean
  Success?: boolean
  IsSuccess?: boolean
  Succeeded?: boolean
}

/**
 * Authentication result from backend containing token and user info
 */
interface BackendAuthResult {
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
}

// Request/Response Payloads
export interface RegisterPayload {
  fullName: string
  userName: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface SendPasswordPayload {
  email: string
}

export interface ConfirmResetPasswordPayload {
  email: string
  code: string
}

export interface ResetPasswordPayload {
  email: string
  password: string
}

/**
 * Unwrap response model from token envelope if present
 */
const unwrapResponseModel = <T>(raw: unknown): BackendResponseModel<T> => {
  const envelope = raw as BackendEnvelope<BackendResponseModel<T>>
  return envelope?.token ?? (raw as BackendResponseModel<T>)
}

/**
 * Check backend success flag and throw error with message if failed
 * Handles multiple naming conventions for success flag
 */
const assertBackendSuccess = <T>(raw: unknown): BackendResponseModel<T> => {
  const model = unwrapResponseModel<T>(raw)

  const hasSuccessFlag =
    typeof model.success === 'boolean' ||
    typeof model.isSuccess === 'boolean' ||
    typeof model.succeeded === 'boolean' ||
    typeof model.Success === 'boolean' ||
    typeof model.IsSuccess === 'boolean' ||
    typeof model.Succeeded === 'boolean'

  const isSuccess =
    model.success ??
    model.isSuccess ??
    model.succeeded ??
    model.Success ??
    model.IsSuccess ??
    model.Succeeded

  if (hasSuccessFlag && isSuccess === false) {
    const errorMessage = model.message || 'فشلت العملية من الخادم'
    throw new Error(errorMessage)
  }

  return model
}

/**
 * POST /api/Auth/register
 * Body: { fullName, userName, email, password }
 */
export const register = async (data: RegisterPayload) => {
  try {
    const payload = {
      fullName: data.fullName,
      userName: data.userName,
      email: data.email,
      password: data.password,
    }

    const response = await axiosInstance.post('/api/Auth/register', payload)
    return assertBackendSuccess<BackendAuthResult>(response.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

/**
 * POST /api/Auth/login
 * Query Params: email, password
 */
export const login = async (data: LoginPayload) => {
  try {
    const response = await axiosInstance.post('/api/Auth/login', null, {
      params: {
        email: data.email,
        password: data.password,
      },
    })

    return assertBackendSuccess<BackendAuthResult>(response.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

/**
 * POST /api/Auth/sentPassword
 * Query Param: Email
 * Sends password reset code to email
 */
export const sendPassword = async (email: string) => {
  try {
    const response = await axiosInstance.post('/api/Auth/sentPassword', null, {
      params: {
        Email: email,
      },
    })

    return assertBackendSuccess<string>(response.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

/**
 * POST /api/Auth/ConfirmResetPassword
 * Query Params: Code, Email
 * Validates reset code before password change
 */
export const confirmResetPassword = async (data: ConfirmResetPasswordPayload) => {
  try {
    const response = await axiosInstance.post('/api/Auth/ConfirmResetPassword', null, {
      params: {
        Code: data.code,
        Email: data.email,
      },
    })

    return assertBackendSuccess<string>(response.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

/**
 * POST /api/Auth/ResetPassword
 * Query Params: Email, Password
 * Resets password after confirmation
 */
export const resetPassword = async (data: ResetPasswordPayload) => {
  try {
    const response = await axiosInstance.post('/api/Auth/ResetPassword', null, {
      params: {
        Email: data.email,
        Password: data.password,
      },
    })

    return assertBackendSuccess<string>(response.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}
