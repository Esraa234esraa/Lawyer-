import axiosInstance from '@/api/axiosInstance'
import { getApiErrorMessage } from '@/utils/apiError'
import {
  ApiResponse,
  Application,
  ApplicationMutationResponse,
  ApplicationSubmitInput,
  HiringAndTraningType,
} from '@/types/application'

const BASE_URL = '/api/ApplyHiringOrTranining'
const GUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const isValidGuid = (id: string) => GUID_REGEX.test(id)

const isValidType = (value: number): value is HiringAndTraningType => value === 1 || value === 2

const pickFirstString = (values: unknown[]): string => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim()
    }
  }
  return ''
}

const pickFirstText = (values: unknown[]): string => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim()
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value)
    }
  }

  return ''
}

const validateId = (id: string, operation: string) => {
  if (!isValidGuid(id)) {
    throw new Error(`Invalid application ID for ${operation}: ${id}`)
  }
}

const validateSubmitInput = (input: ApplicationSubmitInput, isUpdate = false) => {
  const errors: string[] = []

  if (!input.fullNmae.trim()) {
    errors.push('FullNmae is required')
  }
  if (!input.email.trim()) {
    errors.push('Email is required')
  }
  if (!input.phoneNumber.trim()) {
    errors.push('PhoneNumber is required')
  }
  if (!isValidType(input.hiringAndTraningType)) {
    errors.push('hiringAndTraningType must be 1 or 2')
  }
  if (!isUpdate && !input.cvPath) {
    errors.push('cvPath is required')
  }

  if (errors.length > 0) {
    throw new Error(errors.join('; '))
  }
}

const buildApplicationFormData = (input: ApplicationSubmitInput): FormData => {
  const formData = new FormData()

  formData.append('FullNmae', input.fullNmae)
  formData.append('Email', input.email)
  formData.append('PhoneNumber', input.phoneNumber)
  formData.append('University', input.university)
  formData.append('Specialty', input.specialty)
  formData.append('GPA', input.gpa)
  if (input.cvPath) {
    formData.append('cvPath', input.cvPath)
  }
  formData.append('MassegeApplication', input.massegeApplication)
  formData.append('hiringAndTraningType', String(input.hiringAndTraningType))

  return formData
}

const normalizeApplication = (raw: unknown): Application | null => {
  if (!raw || typeof raw !== 'object') {
    return null
  }

  const source = raw as Record<string, unknown>
  const id = pickFirstString([source.id, source.Id])

  if (!id) {
    return null
  }

  return {
    id,
    fullNmae: pickFirstString([source.fullNmae, source.FullNmae]),
    email: pickFirstString([source.email, source.Email]),
    phoneNumber: pickFirstString([source.phoneNumber, source.PhoneNumber]),
    university: pickFirstString([source.university, source.University]),
    specialty: pickFirstString([source.specialty, source.Specialty]),
    gpa: pickFirstText([source.gpa, source.GPA]),
    cvPath: pickFirstString([source.cvPath, source.CvPath]),
    massegeApplication: pickFirstString([source.massegeApplication, source.MassegeApplication]),
    hiringAndTraning: Number(source.hiringAndTraning ?? source.HiringAndTraning ?? source.hiringAndTraningType ?? source.HiringAndTraningType) === 2 ? 2 : 1,
    createdAt: pickFirstString([source.createdAt, source.CreateAt, source.CreatedAt]),
  }
}

const assertSuccess = <T>(response: ApiResponse<T>): ApiResponse<T> => {
  if (!response.success) {
    throw new Error(response.message || 'Request failed')
  }
  return response
}

export const addApplication = async (input: ApplicationSubmitInput): Promise<ApplicationMutationResponse> => {
  try {
    validateSubmitInput(input)
    const formData = buildApplicationFormData(input)

    const response = await axiosInstance.post<ApplicationMutationResponse>(`${BASE_URL}/AddHiringOrTraningAsync`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return assertSuccess(response.data) as ApplicationMutationResponse
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export const updateApplication = async (id: string, input: ApplicationSubmitInput): Promise<ApplicationMutationResponse> => {
  try {
    validateId(id, 'updateApplication')
    validateSubmitInput(input, true)
    const formData = buildApplicationFormData(input)

    const response = await axiosInstance.put<ApplicationMutationResponse>(`${BASE_URL}/UpdateHiringOrTraningAsync/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return assertSuccess(response.data) as ApplicationMutationResponse
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export const getAllApplications = async (): Promise<ApiResponse<Application[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<unknown[]>>(`${BASE_URL}/GetAllHiringOrTraningAsync`)
    const model = assertSuccess(response.data)

    const applications = (model.data || [])
      .map(normalizeApplication)
      .filter((item): item is Application => Boolean(item))

    return {
      ...model,
      data: applications,
    }
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export const getApplicationById = async (id: string): Promise<ApiResponse<Application>> => {
  try {
    validateId(id, 'getApplicationById')

    const response = await axiosInstance.get<ApiResponse<unknown>>(`${BASE_URL}/GetHiringOrTraningByIdAsync/${id}`)
    const model = assertSuccess(response.data)
    const application = normalizeApplication(model.data)

    if (!application) {
      throw new Error('Failed to parse application data')
    }

    return {
      ...model,
      data: application,
    }
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export const deleteApplication = async (id: string): Promise<ApplicationMutationResponse> => {
  try {
    validateId(id, 'deleteApplication')

    const response = await axiosInstance.delete<ApplicationMutationResponse>(`${BASE_URL}/${id}`)
    return assertSuccess(response.data) as ApplicationMutationResponse
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export const applicationServiceValidation = {
  isValidGuid,
}
