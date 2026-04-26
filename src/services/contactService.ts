import axiosInstance from '@/api/axiosInstance'
import { getApiErrorMessage, getBackendMessage } from '@/utils/apiError'
import type { ApiResponse, Contact, ContactFormInput } from '@/types/contact'

const BASE_URL = '/api/Contacts'

const normalizeText = (value?: string) => value?.trim() || ''

const buildContactFormData = (input: ContactFormInput): FormData => {
  const formData = new FormData()

  formData.append('FullName', normalizeText(input.fullName))
  formData.append('PhoneNumber', normalizeText(input.phoneNumber))
  formData.append('Email', normalizeText(input.email))
  formData.append('Subject', normalizeText(input.subject))
  formData.append('Mesage', normalizeText(input.mesage))

  return formData
}

const ensureSuccess = <T,>(responseData: ApiResponse<T>): ApiResponse<T> => {
  if (!responseData.success) {
    throw new Error(responseData.message || 'Request failed')
  }

  return responseData
}

export const addContact = async (input: ContactFormInput): Promise<ApiResponse<unknown>> => {
  try {
    const formData = buildContactFormData(input)
    const response = await axiosInstance.post(`${BASE_URL}/AddContactAsync`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return ensureSuccess(response.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export const getAllContacts = async (): Promise<ApiResponse<Contact[]>> => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/GetAllContactsAsync`)
    return ensureSuccess(response.data)
  } catch (error) {
    const backendMessage = getBackendMessage((error as any)?.response?.data)
    throw new Error(backendMessage || getApiErrorMessage(error))
  }
}
