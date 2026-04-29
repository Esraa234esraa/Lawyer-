import axios from '@/api/axiosInstance';
import { Service, ApiResponse } from '@/types/service';

export const getAllServices = async () => {
  const { data } = await axios.get<ApiResponse<Service[]>>('/api/theService/GetAllServiceAsync');
  return data;
};

export const getServiceById = async (id: string) => {
  const { data } = await axios.get<ApiResponse<Service>>(`/api/theService/GetIssueByIdAsync/${id}`);
  return data;
};

export const createService = async (formData: FormData) => {
  const { data } = await axios.post<ApiResponse<Service>>('/api/theService/AddServiceAsync', formData);
  return data;
};

export const updateService = async (id: string, formData: FormData) => {
  const { data } = await axios.put<ApiResponse<Service>>(`/api/theService/UpdateServiceAsync/${id}`, formData);
  return data;
};

export const deleteService = async (id: string) => {
  const { data } = await axios.delete<ApiResponse<null>>(`/api/theService/${id}`);
  return data;
};

export function buildServiceFormData(service: Partial<Service>): FormData {
  const formData = new FormData();
  formData.append('Title', service.title || '');
  formData.append('Description', service.description || '');
  formData.append('Price', String(service.price ?? ''));
  (service.childernTheServices || []).forEach((child, idx) => {
    formData.append(`ChildernTheServices[${idx}].id`, child.id ?? '00000000-0000-0000-0000-000000000000');
    formData.append(`ChildernTheServices[${idx}].term`, child.term);
  });
  return formData;
}
