export interface Contact {
  fullName: string
  phoneNumber: string
  email?: string
  subject?: string
  mesage?: string
}

export interface ContactFormInput {
  fullName: string
  phoneNumber: string
  email?: string
  subject?: string
  mesage?: string
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  error?: string
  errors?: Record<string, string | string[]>
}
