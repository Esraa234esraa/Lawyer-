export interface WhoAreWe {
  id: string
  visionAr: string
  messageAr: string
  visionEn?: string
  messageEn?: string
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  errors?: Record<string, string | string[]>
  error?: string
}

export interface WhoAreWeUpdateInput {
  visionAr: string
  messageAr: string
  visionEn?: string
  messageEn?: string
}
