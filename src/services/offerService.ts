import axiosInstance from '@/api/axiosInstance'
import { getApiErrorMessage } from '@/utils/apiError'
import { AddOfferResponse, ApiResponse, Offer, OfferFilterType, OfferSubmitInput, OfferToggleResponse } from '@/types/offer'

const BASE_URL = '/api/OfferTraningOrHiring'
const GUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const isValidHiringAndTraining = (value: number): value is OfferFilterType => value === 1 || value === 2

const pickFirstString = (values: unknown[]): string => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim()
    }
  }
  return ''
}

const validateOfferInput = (input: OfferSubmitInput): void => {
  const errors: string[] = []

  if (!input.nameAr || input.nameAr.trim().length === 0) {
    errors.push('NameAr is required')
  }

  if (!input.description || input.description.trim().length === 0) {
    errors.push('Description is required')
  }

  if (!input.type || input.type.trim().length === 0) {
    errors.push('Type is required')
  }

  if (!isValidHiringAndTraining(input.hiringAndTraning)) {
    errors.push('hiringAndTraning must be 1 or 2')
  }

  if (input.hiringAndTraning === 1) {
    if (!input.salary || input.salary.trim().length === 0) {
      errors.push('Salary is required for job')
    }
    if (!input.location || input.location.trim().length === 0) {
      errors.push('Location is required for job')
    }
    if (!input.type || input.type.trim().length === 0 || input.type === 'Job') {
      errors.push('Job type is required')
    }
  }

  if (input.hiringAndTraning === 2) {
    if (!input.duration || input.duration.trim().length === 0) {
      errors.push('Duration is required for training')
    }
    if (!input.award || input.award.trim().length === 0) {
      errors.push('Award is required for training')
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join('; '))
  }
}

const validateOfferId = (id: string, operation: string): void => {
  if (!GUID_REGEX.test(id)) {
    throw new Error(`Invalid offer ID for ${operation}: ${id}`)
  }
}

const buildOfferFormData = (input: OfferSubmitInput): FormData => {
  const formData = new FormData()

  formData.append('NameAr', input.nameAr)
  formData.append('NameEn', input.nameEn || '')
  formData.append('Description', input.description)
  formData.append('Duration', input.hiringAndTraning === 2 ? input.duration || '' : '')
  if (input.hiringAndTraning === 2) {
    formData.append('Award', input.award)
    formData.append('Salary', '')
    formData.append('Type', 'Training')
  } else {
    formData.append('Award', '')
    formData.append('Salary', input.salary)
    formData.append('Type', input.type)
  }
  formData.append('hiringAndTraning', String(input.hiringAndTraning))
  formData.append('Location', input.hiringAndTraning === 1 ? input.location || '' : '')
  formData.append('Requirements', input.requirements || '')

  return formData
}

const normalizeOffer = (raw: unknown): Offer | null => {
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
    nameAr: pickFirstString([source.nameAr, source.NameAr]),
    nameEn: pickFirstString([source.nameEn, source.NameEn]),
    description: pickFirstString([source.description, source.Description]),
    duration: pickFirstString([source.duration, source.Duration]),
    award: pickFirstString([source.award, source.Award]),
    salary: pickFirstString([source.salary, source.Salary]),
    location: pickFirstString([source.location, source.Location]),
    requirements: pickFirstString([source.requirements, source.Requirements]),
    type: pickFirstString([source.type, source.Type]),
    hiringAndTraning: Number(source.hiringAndTraning ?? source.HiringAndTraning) === 2 ? 2 : 1,
    isActive: Boolean(source.isActive ?? source.IsActive ?? true),
    isVisible: Boolean(source.isVisible ?? source.IsVisible ?? true),
    createdAt: pickFirstString([source.createdAt, source.CreateAt, source.CreatedAt]),
    updatedAt: pickFirstString([source.updatedAt, source.UpdatedAt]),
  }
}

const assertSuccess = <T>(response: ApiResponse<T>): ApiResponse<T> => {
  if (!response.success) {
    throw new Error(response.message || 'Request failed')
  }
  return response
}

export const addOffer = async (formData: OfferSubmitInput): Promise<AddOfferResponse> => {
  try {
    validateOfferInput(formData)
    const payload = buildOfferFormData(formData)

    const response = await axiosInstance.post<AddOfferResponse>(`${BASE_URL}/AddOfferTraningOrHiringAsync`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return assertSuccess(response.data) as AddOfferResponse
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export const updateOffer = async (id: string, formData: OfferSubmitInput): Promise<OfferToggleResponse> => {
  try {
    validateOfferId(id, 'updateOffer')
    validateOfferInput(formData)
    const payload = buildOfferFormData(formData)

    const response = await axiosInstance.put<OfferToggleResponse>(`${BASE_URL}/UpdateOfferTraningOrHiringAsync/${id}`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return assertSuccess(response.data) as OfferToggleResponse
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export const getAllOffers = async (hiringAndTraning: OfferFilterType): Promise<ApiResponse<Offer[]>> => {
  try {
    if (!isValidHiringAndTraining(hiringAndTraning)) {
      throw new Error('Invalid hiringAndTraning value')
    }

    const response = await axiosInstance.get<ApiResponse<unknown[]>>(`${BASE_URL}/GetAllOfferTraningOrHiringAsync`, {
      params: { hiringAndTraning },
    })
    const model = assertSuccess(response.data)

    const offers = (model.data || [])
      .map(normalizeOffer)
      .filter((item): item is Offer => Boolean(item))

    return {
      ...model,
      data: offers,
    }
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export const getOfferById = async (id: string, hiringAndTraning: OfferFilterType): Promise<ApiResponse<Offer>> => {
  try {
    validateOfferId(id, 'getOfferById')
    if (!isValidHiringAndTraining(hiringAndTraning)) {
      throw new Error('Invalid hiringAndTraning value')
    }

    const response = await axiosInstance.get<ApiResponse<unknown>>(`${BASE_URL}/GetOfferTraningOrHiringByIdAsync/${id}`, {
      params: { hiringAndTraning },
    })
    const model = assertSuccess(response.data)
    const offer = normalizeOffer(model.data)

    if (!offer) {
      throw new Error('Failed to parse offer data')
    }

    return {
      ...model,
      data: offer,
    }
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export const deleteOffer = async (id: string): Promise<OfferToggleResponse> => {
  try {
    validateOfferId(id, 'deleteOffer')

    const response = await axiosInstance.delete<OfferToggleResponse>(`${BASE_URL}/${id}`)
    return assertSuccess(response.data) as OfferToggleResponse
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export const offerServiceValidation = {
  validateOfferInput,
  validateOfferId,
}
