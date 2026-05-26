import { useQuery } from '@tanstack/react-query'
import { getSessionById } from '@/services/sessions.service'
import { SESSION_QUERY_KEYS } from '@/constants/sessions'

export const useSession = (id: string) => {
  const query = useQuery({
    queryKey: SESSION_QUERY_KEYS.detail(id),
    queryFn: () => getSessionById(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  return {
    ...query,
    session: query.data?.data,
  }
}
