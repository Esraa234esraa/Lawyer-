import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateApplication } from '@/services/applicationService'
import { ApplicationSubmitInput } from '@/types/application'
import { APPLICATIONS_QUERY_KEYS } from './useGetAllApplications'

interface UpdateApplicationInput {
  id: string
  payload: ApplicationSubmitInput
}

export const useUpdateApplication = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: UpdateApplicationInput) => updateApplication(id, payload),
    onSuccess: (response, variables) => {
      toast.success(response.message || 'تم تحديث الطلب بنجاح')
      queryClient.invalidateQueries({ queryKey: APPLICATIONS_QUERY_KEYS.all })
      queryClient.invalidateQueries({ queryKey: APPLICATIONS_QUERY_KEYS.one(variables.id) })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'فشل في تحديث الطلب')
    },
  })
}
