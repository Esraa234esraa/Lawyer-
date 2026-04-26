import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateWhoAreWe } from '@/services/whoAreWeService'
import type { WhoAreWeUpdateInput } from '@/types/whoAreWe'
import { WHO_ARE_WE_QUERY_KEY } from './useGetWhoAreWe'

type UpdateWhoAreWePayload = {
  id: string
  payload: WhoAreWeUpdateInput
}

export const useUpdateWhoAreWe = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: UpdateWhoAreWePayload) => updateWhoAreWe(id, payload),
    onSuccess: (response) => {
      toast.success(response.message || 'تم حفظ التعديلات بنجاح')
      queryClient.invalidateQueries({ queryKey: WHO_ARE_WE_QUERY_KEY })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'فشل في حفظ التعديلات')
    },
  })
}
