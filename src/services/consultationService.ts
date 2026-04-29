import axiosInstance from '../api/axiosInstance';
import {
  ApplyConsultationInput,
  ConfirmConsultationInput,
  ConsultationRequest,
  ConsultationRequestDetail,
  ApiResponse,
} from '../types/consultation.types';

// Helper to build FormData for apply
function buildApplyConsultationFormData(input: ApplyConsultationInput) {
  const formData = new FormData();
  formData.append('FullName', input.fullName);
  formData.append('Email', input.email);
  formData.append('Phone', input.phone);
  formData.append('PaymentReceiptPath', input.paymentReceiptPath);
  formData.append('NationalNumber', input.nationalNumber);
  formData.append('NationalIdentityPath', input.nationalIdentityPath);
  formData.append('ConsultationRequesAttachemnt', input.consultationRequesAttachemnt);
  formData.append('Details', input.details);
  return formData;
}

// Helper to build FormData for confirm
function buildConfirmConsultationFormData(input: ConfirmConsultationInput) {
  const formData = new FormData();
  formData.append('NationalNumber', input.nationalNumber);
  formData.append('NationalIdentityPath', input.nationalIdentityPath);
  formData.append('ConsultationRequesAttachemnt', input.consultationRequesAttachemnt);
  if (input.details) formData.append('Details', input.details);
  return formData;
}

export const consultationService = {
  async applyConsultation(input: ApplyConsultationInput) {
    const formData = buildApplyConsultationFormData(input);
    const res = await axiosInstance.post<ApiResponse<any>>(
      '/api/ConsultationRequest/ApplyConsultationRequestAsync',
      formData
    );
    if (!res.data.success) throw new Error(res.data.message);
    return res.data;
  },

  async getAllConsultations() {
    const res = await axiosInstance.get<ApiResponse<ConsultationRequest[]>>(
      '/api/ConsultationRequest/GetAllConsultationRequestAsync'
    );
    if (!res.data.success) throw new Error(res.data.message);
    return res.data.data;
  },

  async getConsultationById(id: number) {
    const res = await axiosInstance.get<ApiResponse<ConsultationRequestDetail>>(
      `/api/ConsultationRequest/GetConsultationRequestByIdAsync/${id}`
    );
    if (!res.data.success) throw new Error(res.data.message);
    return res.data.data;
  },

  async confirmConsultation(id: number, input: ConfirmConsultationInput) {
    const formData = buildConfirmConsultationFormData(input);
    const res = await axiosInstance.put<ApiResponse<any>>(
      `/api/ConsultationRequest/ConfirmApplyRequestAsync/${id}`,
      formData
    );
    if (!res.data.success) throw new Error(res.data.message);
    return res.data;
  },

  async deleteConsultation(id: number) {
    const res = await axiosInstance.delete<ApiResponse<any>>(
      `/api/ConsultationRequest/${id}`
    );
    if (!res.data.success) throw new Error(res.data.message);
    return res.data;
  },
};
