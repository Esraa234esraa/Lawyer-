import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteApplication } from '@/services/applicationService'
import { APPLICATIONS_QUERY_KEYS } from './useGetAllApplications'

export const useDeleteApplication = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteApplication(id),
    onSuccess: (response) => {
      toast.success(response.message || 'تم حذف الطلب بنجاح')
      queryClient.invalidateQueries({ queryKey: APPLICATIONS_QUERY_KEYS.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'فشل في حذف الطلب')
    },
  })
}
