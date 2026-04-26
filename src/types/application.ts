export type HiringAndTraningType = 1 | 2

export interface Application {
  id: string
  fullNmae: string
  email: string
  phoneNumber: string
  university: string
  specialty: string
  gpa: string
  cvPath: string
  massegeApplication: string
  hiringAndTraning: HiringAndTraningType
  createdAt: string
}

export interface ApplicationSubmitInput {
  fullNmae: string
  email: string
  phoneNumber: string
  university: string
  specialty: string
  gpa: string
  cvPath?: File
  massegeApplication: string
  hiringAndTraningType: HiringAndTraningType
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  errors?: Record<string, string | string[]>
  error?: string
}

export interface ApplicationMutationResponse extends ApiResponse<boolean | string> {
  data?: boolean | string
}
