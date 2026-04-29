// Types for Consultation Request Module

export interface ConsultationRequest {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  nationalNumber: string;
  nationalIdentityPath: string;
  details: string;
  paymentReceiptPath: string;
  isConfirmed: boolean;
}

export interface ConsultationRequestDetail extends ConsultationRequest {
  // Add more fields if needed for details
}

export interface ApplyConsultationInput {
  fullName: string;
  email: string;
  phone: string;
  paymentReceiptPath: File;
  nationalNumber: string;
  nationalIdentityPath: File;
  consultationRequesAttachemnt: File;
  details: string;
}

export interface ConfirmConsultationInput {
  nationalNumber: string;
  nationalIdentityPath: File;
  consultationRequesAttachemnt: File;
  details?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}
