import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { addApplication } from '@/services/applicationService'
import { ApplicationSubmitInput } from '@/types/application'
import { APPLICATIONS_QUERY_KEYS } from './useGetAllApplications'

export const useAddApplication = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ApplicationSubmitInput) => addApplication(payload),
    onSuccess: (response) => {
      toast.success(response.message || 'تم إرسال الطلب بنجاح')
      queryClient.invalidateQueries({ queryKey: APPLICATIONS_QUERY_KEYS.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'فشل في إرسال الطلب')
    },
  })
}
