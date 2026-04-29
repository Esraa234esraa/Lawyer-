import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createService } from '@/services/serviceService'
import { SERVICES_QUERY_KEY } from './useGetServices'

export const useCreateService = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createService,

    onSuccess: (response) => {
      toast.success(response.message || 'تمت إضافة الخدمة بنجاح')
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEY })
    },

    onError: (error: Error) => {
      toast.error(error.message || 'حدث خطأ أثناء الإضافة')
    },
  })
}