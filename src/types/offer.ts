export type OfferType = string

export interface Offer {
  id: string
  nameAr: string
  nameEn: string
  description: string
  duration: string
  award: string
  salary: string
  location: string
  requirements: string
  type: OfferType
  hiringAndTraning: 1 | 2
  isActive?: boolean
  isVisible?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface OfferSubmitInput {
  nameAr: string
  nameEn?: string
  description: string
  duration: string
  award: string
  salary: string
  location?: string
  requirements?: string
  type: string
  hiringAndTraning: 1 | 2
}

export type OfferFilterType = 1 | 2

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  errors?: Record<string, string | string[]>
  error?: string
}

export interface AddOfferResponse extends ApiResponse<string> {
  data?: string
}

export interface OfferToggleResponse extends ApiResponse<boolean> {
  data?: boolean
}
