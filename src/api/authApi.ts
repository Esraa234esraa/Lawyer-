import axiosInstance from '@/api/axiosInstance'

interface BackendEnvelope<T> {
  token?: T
}

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

interface BackendAuthResult {
  Token?: string
  Id?: string
  Roles?: string[]
}

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

const unwrapResponseModel = <T>(raw: unknown): BackendResponseModel<T> => {
  const envelope = raw as BackendEnvelope<BackendResponseModel<T>>
  return envelope?.token ?? (raw as BackendResponseModel<T>)
}

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
    throw new Error(model.message || 'فشلت العملية من الخادم')
  }

  return model
}

export const register = async (data: RegisterPayload) => {
  const payload = {
    FullName: data.fullName,
    UserName: data.userName,
    Email: data.email,
    Password: data.password,
    fullName: data.fullName,
    userName: data.userName,
    email: data.email,
    password: data.password,
  }

  const response = await axiosInstance.post('/api/Auth/register', payload)
  return assertBackendSuccess<BackendAuthResult>(response.data)
}

export const login = async (data: LoginPayload) => {
  const response = await axiosInstance.post('/api/Auth/login', null, {
    params: {
      email: data.email,
      password: data.password,
    },
  })

  return assertBackendSuccess<BackendAuthResult>(response.data)
}

export const sendPassword = async (email: string) => {
  const response = await axiosInstance.post('/api/Auth/sentPassword', null, {
    params: {
      Email: email,
    },
  })

  return assertBackendSuccess<string>(response.data)
}

export const confirmResetPassword = async (data: ConfirmResetPasswordPayload) => {
  const response = await axiosInstance.post('/api/Auth/ConfirmResetPassword', null, {
    params: {
      Code: data.code,
      Email: data.email,
    },
  })

  return assertBackendSuccess<string>(response.data)
}

export const resetPassword = async (data: ResetPasswordPayload) => {
  const response = await axiosInstance.post('/api/Auth/ResetPassword', null, {
    params: {
      Email: data.email,
      Password: data.password,
    },
  })

  return assertBackendSuccess<string>(response.data)
}
