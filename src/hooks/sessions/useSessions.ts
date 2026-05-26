import { useQuery } from '@tanstack/react-query'
import { getAllSessions } from '@/services/sessions.service'
import { SESSION_QUERY_KEYS } from '@/constants/sessions'
import type { SessionsQueryParams } from '@/types/session'

export const useSessions = (params?: SessionsQueryParams) => {
  const query = useQuery({
    queryKey: SESSION_QUERY_KEYS.list(params),
    queryFn: () => getAllSessions(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  // Debug: log query state to help troubleshoot missing data in UI (only in dev)
  // eslint-disable-next-line no-console
  if (import.meta.env.MODE !== 'production') {
    console.debug('[useSessions] query', {
      status: query.status,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      data: query.data,
      error: query.error,
      queryKey: SESSION_QUERY_KEYS.list(params),
    })
  }

  return {
    ...query,
    sessions: query.data?.data || [],
  }
}
