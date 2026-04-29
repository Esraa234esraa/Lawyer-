import { useQuery } from '@tanstack/react-query'
import { getServiceById } from '@/services/serviceService'

export const SERVICE_QUERY_KEY = {
  all: ['services'] as const,
  detail: (id: string) => ['services', id] as const,
}

export const useGetServiceById = (id: string) => {
  return useQuery({
    queryKey: SERVICE_QUERY_KEY.detail(id),
    queryFn: () => getServiceById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}