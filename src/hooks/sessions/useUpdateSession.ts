import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { SESSION_QUERY_KEYS } from '@/constants/sessions'
import { updateSession } from '@/services/sessions.service'
import type { SessionUpdateInput } from '@/types/session'

type UpdateSessionPayload = {
  id: string
  payload: SessionUpdateInput
}

export const useUpdateSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: UpdateSessionPayload) => updateSession(id, payload),
    onSuccess: (response, variables) => {
      toast.success(response.message || 'Session updated successfully')
      queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEYS.all })
      queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEYS.detail(variables.id) })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update session')
    },
  })
}
