import axiosInstance from '@/api/axiosInstance'
import { getApiErrorMessage } from '@/utils/apiError'
import type { ApiResponse, Service } from '@/types/service'

const BASE_URL = '/api/theService'

/* =========================
   VALIDATION
========================= */
const validateServiceInput = (input: any): void => {
  if (!input.title || input.title.trim().length === 0) {
    throw new Error('Title is required')
  }

  if (!input.description || input.description.trim().length === 0) {
    throw new Error('Description is required')
  }

  if (!input.price || input.price <= 0) {
    throw new Error('Price must be greater than 0')
  }

  if (
    !input.childernTheServices ||
    input.childernTheServices.length === 0 ||
    input.childernTheServices.some((c: any) => !c.term?.trim())
  ) {
    throw new Error('At least one service detail is required')
  }
}

/* =========================
   ASSERT RESPONSE
========================= */
const assertSuccess = <T>(response: ApiResponse<T>): ApiResponse<T> => {
  if (!response.success) {
    throw new Error(response.message || 'Server Error')
  }
  return response
}

/* =========================
   GET ALL
========================= */
export const getAllServices = async (): Promise<ApiResponse<Service[]>> => {
  try {
    const res = await axiosInstance.get<ApiResponse<Service[]>>(
      `${BASE_URL}/GetAllServiceAsync`
    )

    return assertSuccess(res.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

/* =========================
   GET BY ID
========================= */
export const getServiceById = async (
  id: string
): Promise<ApiResponse<Service>> => {
  try {
    const res = await axiosInstance.get<ApiResponse<Service>>(
      `${BASE_URL}/GetIssueByIdAsync/${id}`
    )

    return assertSuccess(res.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

/* =========================
   FORM DATA BUILDER
========================= */
export const buildServiceFormData = (input: any): FormData => {
  const formData = new FormData()

  formData.append('Title', input.title.trim())
  formData.append('Description', input.description.trim())
  formData.append('Price', String(input.price))

  // مهم: نفس منطق الباك
  input.childernTheServices.forEach((c: any, i: number) => {
    formData.append(`ChildernTheServices[${i}].term`, c.term)

    // 🔥 هنا أهم نقطة اللي قولتيها
    // لو جديد → null أو Guid empty
    // لو موجود → id الحقيقي
    formData.append(
      `ChildernTheServices[${i}].id`,
      c.id ? c.id : '00000000-0000-0000-0000-000000000000'
    )
  })

  return formData
}

/* =========================
   CREATE
========================= */
export const createService = async (
  input: any
): Promise<ApiResponse<boolean>> => {
  try {
    validateServiceInput(input)

    const formData = buildServiceFormData(input)

    const res = await axiosInstance.post<ApiResponse<boolean>>(
      `${BASE_URL}/AddServiceAsync`,
      formData
    )

    return assertSuccess(res.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

/* =========================
   UPDATE
========================= */
export const updateService = async (
  id: string,
  input: any
): Promise<ApiResponse<boolean>> => {
  try {
    validateServiceInput(input)

    const formData = buildServiceFormData(input)

    const res = await axiosInstance.put<ApiResponse<boolean>>(
      `${BASE_URL}/UpdateServiceAsync/${id}`,
      formData
    )

    return assertSuccess(res.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

/* =========================
   DELETE
========================= */
export const deleteService = async (
  id: string
): Promise<ApiResponse<boolean>> => {
  try {
    const res = await axiosInstance.delete<ApiResponse<boolean>>(
      `${BASE_URL}/${id}`
    )

    return assertSuccess(res.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}