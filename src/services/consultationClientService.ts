import axiosInstance from '@/api/axiosInstance'
import { ApiResponse } from '@/types/issues'

export type ConsultationClient = {
  id: string
  fullName: string
}

export type ClientAttachment = {
  attachmentId: string
  attachmentIdPath: string
}

export const consultationClientService = {
  async getAllConsultationClients() {
    const res = await axiosInstance.get<ApiResponse<ConsultationClient[]>>(
      '/api/ConsultationRequest/GetAllClientOfConsultations'
    )
    if (!res.data.success) throw new Error(res.data.message || 'خطأ في جلب العملاء')
    return res.data.data || []
  },

  async getClientAttachments(clientId: string) {
    const res = await axiosInstance.get<ApiResponse<ClientAttachment[]>>(
      `/api/ConsultationRequest/GetAllAttachmentOfClient/${clientId}`
    )
    if (!res.data.success) throw new Error(res.data.message || 'خطأ في جلب مرفقات العميل')
    return res.data.data || []
  },
}
