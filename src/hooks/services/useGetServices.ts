import { useQuery } from '@tanstack/react-query'
import { getAllServices } from '@/services/serviceService'
// import type { Service } from '@/types/service'

export const SERVICES_QUERY_KEY = ['services'] as const

export const useGetServices = () => {
  return useQuery({
    queryKey: SERVICES_QUERY_KEY,
    queryFn: getAllServices,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}