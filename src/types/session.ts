import type { ApiResponse } from '@/types'

export type SessionStatus = 1 | 2 | 3 | 4 | 5 | 6 | 7
export type SessionType = 1 | 2 | 3

export interface AttachmentDto {
  id?: string
  filePath: string
  fileName?: string
  contentType?: string
}

export interface Session {
  id: string
  decision: string
  court: string
  sessioNote: string
  sessioNumber: string
  sessionStatus: SessionStatus
  sessionType: SessionType
  sessionDate: string
  nextSessionDate: string | null
  issueId: string
  attachmentDtos: AttachmentDto[]
}

export interface SessionCreateInput {
  decision: string
  court: string
  sessioNote: string
  sessioNumber: string
  sessionStatus: SessionStatus
  sessionType: SessionType
  sessionDate: string
  nextSessionDate?: string | null
  issueId: string
  sessionFiles: File[]
}

export interface SessionUpdateInput extends SessionCreateInput {}

export interface SessionsQueryParams {
  page?: number
  pageSize?: number
  search?: string
  sessionStatus?: SessionStatus
  sessionType?: SessionType
  sortBy?: 'sessionDate' | 'nextSessionDate' | 'sessioNumber' | 'decision' | 'court'
  sortOrder?: 'asc' | 'desc'
}

export type SessionsResponse = ApiResponse<Session[]>
export type SessionResponse = ApiResponse<Session>
export type SessionMutationResponse = ApiResponse<boolean>
