import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { SESSION_QUERY_KEYS } from '@/constants/sessions'
import { createSession } from '@/services/sessions.service'

export const useCreateSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSession,
    onSuccess: (response) => {
      toast.success(response.message || 'Session created successfully')
      queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEYS.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create session')
    },
  })
}
