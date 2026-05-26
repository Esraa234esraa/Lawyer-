import axiosInstance from '@/api/axiosInstance'
import { getApiErrorMessage } from '@/utils/apiError'
import type {
  AttachmentDto,
  Session,
  SessionCreateInput,
  SessionMutationResponse,
  SessionResponse,
  SessionsResponse,
  SessionStatus,
  SessionType,
  SessionUpdateInput,
  SessionsQueryParams,
} from '@/types/session'
import type { ApiResponse } from '@/types'

const BASE_URL = '/api/Sessions'

const getSuccessFlag = <T>(response: ApiResponse<T>): boolean => {
  const candidates = [
    response.success,
    response.isSuccess,
    response.succeeded,
    response.Success,
    response.IsSuccess,
    response.Succeeded,
  ]

  const firstBoolean = candidates.find((value) => typeof value === 'boolean')
  return firstBoolean ?? false
}

const assertSuccess = <T>(response: ApiResponse<T>): ApiResponse<T> => {
  if (!getSuccessFlag(response)) {
    throw new Error(response.message || 'حدث خطأ من الخادم')
  }
  return response
}

const pickFirstString = (values: unknown[]): string | undefined => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }
  return undefined
}

const pickFirstNumber = (values: unknown[]): number | undefined => {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value
    }

    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value)
      if (Number.isFinite(parsed)) {
        return parsed
      }
    }
  }

  return undefined
}

const normalizeAttachment = (raw: unknown): AttachmentDto | null => {
  if (!raw || typeof raw !== 'object') return null

  const source = raw as Record<string, unknown>
  const filePath = pickFirstString([source.filePath, source.FilePath, source.path, source.Path])

  if (!filePath) return null

  return {
    id: pickFirstString([source.id, source.Id]),
    filePath,
    fileName: pickFirstString([source.fileName, source.FileName, source.name, source.Name]),
    contentType: pickFirstString([source.contentType, source.ContentType]),
  }
}

const normalizeSession = (raw: unknown): Session | null => {
  if (!raw || typeof raw !== 'object') return null

  const source = raw as Record<string, unknown>
  const id = pickFirstString([source.id, source.Id])
  const decision = pickFirstString([source.decision, source.Decision])
  const court = pickFirstString([source.court, source.Court])
  const sessioNote = pickFirstString([source.sessioNote, source.SessioNote])
  const sessioNumber = pickFirstString([
    source.sessioNumber,
    source.SessioNumber,
    typeof source.sessioNumber === 'number' ? String(source.sessioNumber) : undefined,
    typeof source.SessioNumber === 'number' ? String(source.SessioNumber) : undefined,
  ])
  const issueId = pickFirstString([source.issueId, source.IssueId])

  const sessionStatus = pickFirstNumber([source.sessionStatus, source.SessionStatus])
  const sessionType = pickFirstNumber([source.sessionType, source.SessionType])

  if (!id || !decision || !court || !sessioNote || !sessioNumber || !issueId) return null
  if (!sessionStatus || !sessionType) return null

  const attachmentsRaw = Array.isArray(source.attachmentDtos)
    ? source.attachmentDtos
    : Array.isArray(source.AttachmentDtos)
    ? source.AttachmentDtos
    : []

  const sessionDate = pickFirstString([source.sessionDate, source.SessionDate]) || ''
  const nextSessionDate =
    pickFirstString([source.nextSessionDate, source.NextSessionDate]) || null

  return {
    id,
    decision,
    court,
    sessioNote,
    sessioNumber,
    sessionStatus: sessionStatus as SessionStatus,
    sessionType: sessionType as SessionType,
    sessionDate,
    nextSessionDate,
    issueId,
    attachmentDtos: attachmentsRaw
      .map(normalizeAttachment)
      .filter((item): item is AttachmentDto => Boolean(item)),
  }
}

const mapSessionsResponse = (response: ApiResponse<unknown>): SessionsResponse => {
  const model = assertSuccess(response)
  const rawData = Array.isArray(model.data) ? model.data : []

  return {
    ...model,
    data: rawData
      .map(normalizeSession)
      .filter((item): item is Session => Boolean(item)),
  }
}

const mapSessionResponse = (response: ApiResponse<unknown>): SessionResponse => {
  const model = assertSuccess(response)
  const normalized = normalizeSession(model.data)

  if (!normalized) {
    throw new Error('تعذر قراءة بيانات الجلسة')
  }

  return {
    ...model,
    data: normalized,
  }
}

export const buildSessionFormData = (values: SessionCreateInput | SessionUpdateInput): FormData => {
  const formData = new FormData()

  formData.append('Decision', values.decision)
  formData.append('Court', values.court)
  formData.append('SessioNote', values.sessioNote)
  formData.append('SessioNumber', values.sessioNumber)
  formData.append('SessionStatus', String(values.sessionStatus))
  formData.append('SessionType', String(values.sessionType))
  formData.append('SessionDate', values.sessionDate)

  if (values.nextSessionDate) {
    formData.append('NextSessionDate', values.nextSessionDate)
  }

  formData.append('IssueId', values.issueId)

  values.sessionFiles.forEach((file) => {
    formData.append('SessionFilesDTOs', file)
  })

  return formData
}

export const getAllSessions = async (params?: SessionsQueryParams): Promise<SessionsResponse> => {
  try {
    const response = await axiosInstance.get<ApiResponse<unknown>>(`${BASE_URL}/GetAllSessionAsync`, {
      params,
    })
    return mapSessionsResponse(response.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export const getSessionById = async (id: string): Promise<SessionResponse> => {
  try {
    const response = await axiosInstance.get<ApiResponse<unknown>>(`${BASE_URL}/GetSessionByIdAsync/${id}`)
    return mapSessionResponse(response.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export const createSession = async (values: SessionCreateInput): Promise<SessionMutationResponse> => {
  try {
    const formData = buildSessionFormData(values)
    const response = await axiosInstance.post<ApiResponse<boolean>>(`${BASE_URL}/AddSessionAsync`, formData)
    return assertSuccess(response.data) as SessionMutationResponse
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export const updateSession = async (
  id: string,
  values: SessionUpdateInput
): Promise<SessionMutationResponse> => {
  try {
    const formData = buildSessionFormData(values)
    const response = await axiosInstance.put<ApiResponse<boolean>>(
      `${BASE_URL}/UpdateSessionAsync/${id}`,
      formData
    )
    return assertSuccess(response.data) as SessionMutationResponse
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export const deleteSession = async (id: string): Promise<SessionMutationResponse> => {
  try {
    const response = await axiosInstance.delete<ApiResponse<boolean>>(`${BASE_URL}/${id}`)
    return assertSuccess(response.data) as SessionMutationResponse
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}
