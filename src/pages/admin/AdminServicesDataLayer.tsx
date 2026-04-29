// Data layer integration for AdminServices UI
// This file connects the UI to the API using the hooks and logic you requested
import { useState } from 'react';
import { useGetServices, useCreateService, useUpdateService, useDeleteService, buildServiceFormData } from '@/hooks/useServices';
import { Service, ServiceChild } from '@/types/service';
import { toast } from 'sonner';

export default function useAdminServicesDataLayer() {
  // Fetch all services
  const { data, isLoading, isError } = useGetServices();
  const services: Service[] = data?.data || [];

  // Mutations
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

  // Add service
  const addService = async (service: Omit<Service, 'id'>) => {
    const formData = buildServiceFormData({
      ...service,
      price: Number(service.price),
      childernTheServices: (service.childernTheServices || []).map((child) => ({
        ...child,
        id: child.id ?? '00000000-0000-0000-0000-000000000000',
      })),
    });
    try {
      await createMutation.mutateAsync(formData);
      toast.success('تمت إضافة الخدمة بنجاح');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'حدث خطأ أثناء الإضافة');
    }
  };

  // Update service
  const updateService = async (id: string, service: Omit<Service, 'id'>) => {
    const formData = buildServiceFormData({
      ...service,
      price: Number(service.price),
      childernTheServices: (service.childernTheServices || []).map((child) => ({
        ...child,
        id: child.id ?? '00000000-0000-0000-0000-000000000000',
      })),
    });
    try {
      await updateMutation.mutateAsync({ id, formData });
      toast.success('تم تحديث الخدمة بنجاح');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'حدث خطأ أثناء التحديث');
    }
  };

  // Delete service
  const deleteService = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('تم حذف الخدمة بنجاح');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'حدث خطأ أثناء الحذف');
    }
  };

  return {
    services,
    isLoading,
    isError,
    addService,
    updateService,
    deleteService,
    isPending: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
}
