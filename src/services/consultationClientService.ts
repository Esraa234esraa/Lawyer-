import axiosInstance from '@/api/axiosInstance'
import { ApiResponse } from '@/types/issues'

export type ConsultationClient = {
  id: string
  fullName: string
  nationalId?: number
  nationalIdentityPath?: string
}

export type ClientAttachment = {
  attachmentId: string
  attachmentIdPath: string | string[]
  nationalPath?: string
}

const normalizeClientAttachment = (raw: unknown): ClientAttachment => {
  const source = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}

  const attachmentId =
    typeof source.attachmentId === 'string'
      ? source.attachmentId
      : typeof source.AttachmentId === 'string'
      ? source.AttachmentId
      : ''

  const attachmentIdPath =
    source.attachmentIdPath ?? source.AttachmentIdPath ?? source.path ?? source.Path ?? []

  const nationalPath =
    typeof source.nationalPath === 'string'
      ? source.nationalPath
      : typeof source.NationalPath === 'string'
      ? source.NationalPath
      : typeof source.nationalIdentityPath === 'string'
      ? source.nationalIdentityPath
      : typeof source.NationalIdentityPath === 'string'
      ? source.NationalIdentityPath
      : undefined

  return {
    attachmentId,
    attachmentIdPath: attachmentIdPath as string | string[],
    nationalPath,
  }
}

export const consultationClientService = {
  async getAllConsultationClients() {
    const res = await axiosInstance.get<ApiResponse<ConsultationClient[]>>(
      '/api/ConsultationRequest/GetAllClientOfConsultations'
    )
    if (!res.data.success) throw new Error(res.data.message || 'خطأ في جلب العملاء')
    return Array.isArray(res.data.data) ? res.data.data : []
  },

  async getClientAttachments(clientId: string) {
    const res = await axiosInstance.get<ApiResponse<unknown>>(
      `/api/ConsultationRequest/GetAllAttachmentOfClient/${clientId}`
    )
    if (!res.data.success) throw new Error(res.data.message || 'خطأ في جلب مرفقات العميل')
    const data = res.data.data
    if (!Array.isArray(data)) return []
    return data.map(normalizeClientAttachment)
  },
}
