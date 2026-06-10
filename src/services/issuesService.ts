import axiosInstance from '@/api/axiosInstance'
import { getApiErrorMessage } from '@/utils/apiError'
import { ApiResponse, Issue, IssueDetails, IssueSubmitInput, IssueType } from '@/types/issues'

const BASE_URL = '/api/Issues'
const ISSUE_TYPES_URL = '/api/IssuesType'
const GUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const assertSuccess = <T>(response: ApiResponse<T>): ApiResponse<T> => {
  if (!response.success) {
    throw new Error(response.message || 'حدث خطأ من الخادم')
  }
  return response
}

export const isValidGuid = (value: string): boolean => GUID_REGEX.test(value)

const pickFirstString = (values: Array<unknown>): string | undefined => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim()
    }
  }
  return undefined
}

const pickFirstNumber = (values: Array<unknown>): number | undefined => {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value
    }

    if (typeof value === 'string' && value.trim().length > 0) {
      const parsed = Number(value)
      if (Number.isFinite(parsed)) {
        return parsed
      }
    }
  }

  return undefined
}

const normalizeIssueAttachment = (raw: unknown): { filePath: string } | null => {
  if (!raw || typeof raw !== 'object') return null
  const source = raw as Record<string, unknown>
  const filePath = pickFirstString([source.filePath, source.FilePath, source.path, source.Path])
  if (!filePath) return null
  return { filePath }
}

const normalizeIssueClient = (raw: unknown): { name: string; nationalId: number; nationalIdentityPath?: string } | null => {
  if (!raw || typeof raw !== 'object') return null
  const source = raw as Record<string, unknown>
  const name = pickFirstString([source.name, source.Name])
  const nationalId = pickFirstNumber([source.nationalId, source.NationalId])
  const nationalIdentityPath = pickFirstString([
    source.nationalIdentityPath,
    source.NationalIdentityPath,
    source.nationalIdentity,
    source.NationalIdentity,
  ])

  if (!name || nationalId === undefined || Number.isNaN(nationalId)) return null
  return {
    name,
    nationalId,
    nationalIdentityPath,
  }
}

const normalizeIssue = (raw: unknown): Issue | null => {
  if (!raw || typeof raw !== 'object') return null
  const source = raw as Record<string, unknown>

  const id = pickFirstString([source.id, source.Id])
  if (!id) return null

  const titeleAr = pickFirstString([source.titeleAr, source.TiteleAr, source.titleAr, source.TitleAr]) || '-'
  const titeleEn = pickFirstString([source.titeleEn, source.TiteleEn, source.titleEn, source.TitleEn])
  const defendant = pickFirstString([source.defendant, source.Defendant]) || '-'

  const nestedIssueType =
    source.issueType && typeof source.issueType === 'object'
      ? (source.issueType as Record<string, unknown>)
      : source.IssueType && typeof source.IssueType === 'object'
      ? (source.IssueType as Record<string, unknown>)
      : null

  const issueTypeId =
    pickFirstString([
      source.issueTypeId,
      source.IssueTypeId,
      source.issuesTypeId,
      source.IssuesTypeId,
      nestedIssueType?.id,
      nestedIssueType?.Id,
    ]) || ''

  const clientsRaw = Array.isArray(source.clients)
    ? source.clients
    : Array.isArray(source.Clients)
    ? source.Clients
    : []

  const attachmentsRaw = Array.isArray(source.attachments)
    ? source.attachments
    : Array.isArray(source.Attachments)
    ? source.Attachments
    : []

  return {
    id,
    titeleAr,
    titeleEn,
    issueTypeId,
    defendant,
    clients: clientsRaw
      .map(normalizeIssueClient)
      .filter((item): item is NonNullable<ReturnType<typeof normalizeIssueClient>> => Boolean(item)),
    attachments: attachmentsRaw
      .map(normalizeIssueAttachment)
      .filter((item): item is NonNullable<ReturnType<typeof normalizeIssueAttachment>> => Boolean(item)),
  }
}

const normalizeIssueType = (raw: unknown): IssueType | null => {
  if (!raw || typeof raw !== 'object') return null

  const source = raw as Record<string, unknown>
  const id = pickFirstString([source.id, source.Id, source.issueTypeId, source.IssueTypeId])
  if (!id) return null

  const nameAr = pickFirstString([
    source.nameAr,
    source.NameAr,
    source.name,
    source.Name,
    source.titleAr,
    source.TitleAr,
    source.titeleAr,
    source.TiteleAr,
  ])

  const nameEn = pickFirstString([
    source.nameEn,
    source.NameEn,
    source.titleEn,
    source.TitleEn,
    source.titeleEn,
    source.TiteleEn,
  ])

  return {
    id,
    nameAr: nameAr || nameEn || 'غير محدد',
    nameEn: nameEn || nameAr,
  }
}

export const buildIssueFormData = (input: IssueSubmitInput): FormData => {
  const formData = new FormData()

  formData.append('TiteleAr', input.titeleAr)
  formData.append('TiteleEn', input.titeleEn || '')
  formData.append('IssueTypeId', input.issueTypeId)
  formData.append('Defendant', input.defendant)

  const attachments = input.issueAttachmentDTOs || []
  if (Array.isArray(attachments)) {
    attachments.forEach((file) => {
      formData.append('IssueAttachmentDTOs', file, file.name)
    })
  }

  input.issueClients.forEach((client, index) => {
    formData.append(`IssueClients[${index}].name`, client.name)
    if (client.nationalIdentityFile) {
      formData.append(
        `IssueClients[${index}].nationalIdentityPath`,
        client.nationalIdentityFile,
        client.nationalIdentityFile.name
      )
    } else {
      formData.append(`IssueClients[${index}].nationalIdentityPath`, client.nationalIdentityPath || '')
    }
    formData.append(`IssueClients[${index}].nationalId`, String(client.nationalId))
    // Note: selectedAttachmentPaths are kept as local UI state only and are
    // intentionally NOT sent to the backend. Consultation attachments are
    // converted to File objects and appended via `IssueAttachmentDTOs`.
  })

  if (import.meta.env.DEV) {
    const entries: Record<string, unknown> = {}
    ;(formData as any).forEach((value: unknown, key: string) => {
      if (!entries[key]) {
        entries[key] = value
      } else if (Array.isArray(entries[key])) {
        ;(entries[key] as unknown[]).push(value)
      } else {
        entries[key] = [entries[key] as unknown, value]
      }
    })
    console.debug('buildIssueFormData entries:', entries)
  }

  return formData
}

export const addIssue = async (payload: IssueSubmitInput): Promise<ApiResponse<string>> => {
  try {
    const formData = buildIssueFormData(payload)
    const response = await axiosInstance.post<ApiResponse<string>>(`${BASE_URL}/AddIssueAsync`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return assertSuccess(response.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export const updateIssue = async (id: string, payload: IssueSubmitInput): Promise<ApiResponse<boolean>> => {
  if (!isValidGuid(id)) {
    throw new Error('Issue ID غير صالح')
  }

  try {
    const formData = buildIssueFormData(payload)
    const response = await axiosInstance.put<ApiResponse<boolean>>(`${BASE_URL}/UpdateIssueAsync/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return assertSuccess(response.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export const getAllIssues = async (): Promise<ApiResponse<Issue[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<unknown[]>>(`${BASE_URL}/GetAllIssueAsync`)
    const model = assertSuccess(response.data)

    const normalizedIssues = (model.data || [])
      .map(normalizeIssue)
      .filter((item): item is Issue => Boolean(item))

    return {
      ...model,
      data: normalizedIssues,
    }
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export const getIssueById = async (id: string): Promise<ApiResponse<IssueDetails>> => {
  if (!isValidGuid(id)) {
    throw new Error('Issue ID غير صالح')
  }

  try {
    const response = await axiosInstance.get<ApiResponse<unknown>>(`${BASE_URL}/GetIssueByIdAsync/${id}`)
    const model = assertSuccess(response.data)
    const normalizedIssue = normalizeIssue(model.data)

    if (!normalizedIssue) {
      throw new Error('تعذر قراءة بيانات القضية من الخادم')
    }

    return {
      ...model,
      data: normalizedIssue,
    }
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export const deleteIssue = async (id: string): Promise<ApiResponse<boolean>> => {
  if (!isValidGuid(id)) {
    throw new Error('Issue ID غير صالح')
  }

  try {
    const response = await axiosInstance.delete<ApiResponse<boolean>>(`${BASE_URL}/${id}`)
    return assertSuccess(response.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export const getIssueTypes = async (): Promise<ApiResponse<IssueType[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<unknown[]>>(`${ISSUE_TYPES_URL}/GetAllIssueAsync`)
    const model = assertSuccess(response.data)

    const normalizedTypes = (model.data || [])
      .map(normalizeIssueType)
      .filter((item): item is IssueType => Boolean(item))

    return {
      ...model,
      data: normalizedTypes,
    }
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}
