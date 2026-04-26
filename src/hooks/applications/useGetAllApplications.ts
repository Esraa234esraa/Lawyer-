import { useQuery } from '@tanstack/react-query'
import { getAllApplications } from '@/services/applicationService'

export const APPLICATIONS_QUERY_KEYS = {
  all: ['applications'] as const,
  one: (id: string) => ['application', id] as const,
} as const

export const useGetAllApplications = () => {
  return useQuery({
    queryKey: APPLICATIONS_QUERY_KEYS.all,
    queryFn: getAllApplications,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
