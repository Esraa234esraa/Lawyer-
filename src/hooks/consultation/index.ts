import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { consultationService } from '../../services/consultationService';
import {
  ConfirmConsultationInput,
} from '../../types/consultation.types';
import { toast } from 'sonner';

export function useApplyConsultation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: consultationService.applyConsultation,
    onSuccess: () => {
      toast.success('تم إرسال طلب الاستشارة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'حدث خطأ أثناء إرسال الطلب');
    },
  });
}

export function useGetAllConsultations() {
  return useQuery({
    queryKey: ['consultations'],
    queryFn: consultationService.getAllConsultations,
  });
}

export function useGetConsultationById(id: number) {
  return useQuery({
    queryKey: ['consultations', id],
    queryFn: () => consultationService.getConsultationById(id),
    enabled: !!id,
  });
}

export function useConfirmConsultation(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ConfirmConsultationInput) =>
      consultationService.confirmConsultation(id, input),
    onSuccess: () => {
      toast.success('تم تأكيد الطلب بنجاح');
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'حدث خطأ أثناء التأكيد');
    },
  });
}

export function useDeleteConsultation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: consultationService.deleteConsultation,
    onSuccess: () => {
      toast.success('تم حذف الطلب بنجاح');
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'حدث خطأ أثناء الحذف');
    },
  });
}
