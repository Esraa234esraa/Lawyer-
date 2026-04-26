import { useQuery } from '@tanstack/react-query'
import { getWhoAreWe } from '@/services/whoAreWeService'

export const WHO_ARE_WE_QUERY_KEY = ['whoAreWe'] as const

export const useGetWhoAreWe = () => {
  return useQuery({
    queryKey: WHO_ARE_WE_QUERY_KEY,
    queryFn: getWhoAreWe,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
