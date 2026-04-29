import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateService } from '@/services/serviceService'
import { SERVICES_QUERY_KEY } from './useGetServices'

type UpdateServicePayload = {
  id: string
  payload: any
}

export const useUpdateService = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: UpdateServicePayload) =>
      updateService(id, payload),

    onSuccess: (response) => {
      toast.success(response.message || 'تم تحديث الخدمة بنجاح')
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEY })
    },

    onError: (error: Error) => {
      toast.error(error.message || 'حدث خطأ أثناء التحديث')
    },
  })
}