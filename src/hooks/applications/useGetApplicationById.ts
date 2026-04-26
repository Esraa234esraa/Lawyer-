import { useQuery } from '@tanstack/react-query'
import { getApplicationById } from '@/services/applicationService'
import { APPLICATIONS_QUERY_KEYS } from './useGetAllApplications'

export const useGetApplicationById = (id: string | null | undefined) => {
  return useQuery({
    queryKey: APPLICATIONS_QUERY_KEYS.one(id || ''),
    queryFn: () => getApplicationById(id as string),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
