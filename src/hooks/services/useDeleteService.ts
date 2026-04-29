import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteService } from '@/services/serviceService'
import { SERVICES_QUERY_KEY } from './useGetServices'

export const useDeleteService = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteService,

    onSuccess: (response) => {
      toast.success(response.message || 'تم حذف الخدمة بنجاح')
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEY })
    },

    onError: (error: Error) => {
      toast.error(error.message || 'حدث خطأ أثناء الحذف')
    },
  })
}