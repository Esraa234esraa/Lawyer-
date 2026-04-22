/**
 * News Detail Query Hook
 * Fetch single news by ID
 */

import { useQuery } from '@tanstack/react-query'
import { getNewsById } from '@/services/newsService'
import { NEWS_QUERY_KEYS } from './useGetAllNews'
import { newsServiceValidation } from '@/services/newsService'

interface UseGetNewsByIdOptions {
  enabled?: boolean
  staleTime?: number
}

/**
 * Fetch single news item by ID
 * 
 * @param id News ID (GUID)
 * @param options Query options
 * @returns Query result with news details, loading states, and error
 * 
 * @example
 * const { data, isLoading, error } = useGetNewsById(newsId)
 * if (isLoading) return <Skeleton />
 * if (error) return <Error message={error.message} />
 * return <NewsDetail news={data?.data} />
 */
export const useGetNewsById = (id: string | null | undefined, options?: UseGetNewsByIdOptions) => {
  // Validate ID format before querying
  const isValidId = Boolean(id && newsServiceValidation.isValidGuid(id))

  return useQuery({
    queryKey: NEWS_QUERY_KEYS.detail(id || ''),
    queryFn: async () => {
      if (!id) {
        throw new Error('News ID is required')
      }

      const response = await getNewsById(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch news details')
      }
      return response
    },
    enabled: Boolean((options?.enabled ?? true) && isValidId),
    staleTime: options?.staleTime ?? 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  })
}
