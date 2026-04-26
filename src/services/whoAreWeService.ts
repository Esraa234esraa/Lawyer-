import axiosInstance from '@/api/axiosInstance'
import { getApiErrorMessage } from '@/utils/apiError'
import type { ApiResponse, WhoAreWe, WhoAreWeUpdateInput } from '@/types/whoAreWe'

const BASE_URL = '/api/WhoAreWe'

const validateWhoAreWeUpdateInput = (input: WhoAreWeUpdateInput): void => {
  if (!input.visionAr || input.visionAr.trim().length === 0) {
    throw new Error('VisionAr is required')
  }

  if (!input.messageAr || input.messageAr.trim().length === 0) {
    throw new Error('MessageAr is required')
  }
}

const assertSuccess = <T>(response: ApiResponse<T>): ApiResponse<T> => {
  if (!response.success) {
    throw new Error(response.message || 'حدث خطأ من الخادم')
  }
  return response
}

export const getWhoAreWe = async (): Promise<ApiResponse<WhoAreWe>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<WhoAreWe>>(
      `${BASE_URL}/GetWhoAreWeAsync`
    )
    return assertSuccess(response.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export const buildWhoAreWeFormData = (input: WhoAreWeUpdateInput): FormData => {
  const formData = new FormData()

  const visionAr = input.visionAr.trim()
  const messageAr = input.messageAr.trim()

  // ✅ نفس أسماء الباك بالظبط (Case Sensitive)
  formData.append('VisionAr', visionAr)
  formData.append('MessageAr', messageAr)

  // ✅ مهم جدًا: ابعتيهم حتى لو فاضيين
  formData.append('VisionEn', input.visionEn?.trim() || '')
  formData.append('MessageEn', input.messageEn?.trim() || '')

  return formData
}

export const updateWhoAreWe = async (
  id: string,
  input: WhoAreWeUpdateInput
): Promise<ApiResponse<boolean>> => {
  try {
    validateWhoAreWeUpdateInput(input)

    const formData = buildWhoAreWeFormData(input)

    // 🔍 Debug (اختياري – شيليه بعد ما تتأكدي)
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1])
    }

    const response = await axiosInstance.put<ApiResponse<boolean>>(
      `${BASE_URL}/UpdateWhoAreWeAsync/${id}`,
      formData
    )

    return assertSuccess(response.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}