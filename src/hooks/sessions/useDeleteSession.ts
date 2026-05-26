import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { SESSION_QUERY_KEYS } from '@/constants/sessions'
import { deleteSession } from '@/services/sessions.service'
import type { SessionsResponse } from '@/types/session'

export const useDeleteSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSession,
    onMutate: async (sessionId: string) => {
      await queryClient.cancelQueries({ queryKey: SESSION_QUERY_KEYS.all })

      const previousSessions = queryClient.getQueryData<SessionsResponse>(SESSION_QUERY_KEYS.all)

      if (previousSessions?.data) {
        queryClient.setQueryData<SessionsResponse>(SESSION_QUERY_KEYS.all, {
          ...previousSessions,
          data: previousSessions.data.filter((item) => item.id !== sessionId),
        })
      }

      return { previousSessions }
    },
    onSuccess: (response) => {
      toast.success(response.message || 'Session deleted successfully')
    },
    onError: (error: Error, _sessionId, context) => {
      if (context?.previousSessions) {
        queryClient.setQueryData(SESSION_QUERY_KEYS.all, context.previousSessions)
      }
      toast.error(error.message || 'Failed to delete session')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEYS.all })
    },
  })
}
