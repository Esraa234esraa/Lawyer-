/**
 * Visible News Query Hook
 * Fetch only visible news (public)
 */

import { useQuery } from '@tanstack/react-query'
import { getVisibleNews } from '@/services/newsService'
import { NEWS_QUERY_KEYS } from './useGetAllNews'

interface UseGetVisibleNewsOptions {
  enabled?: boolean
  staleTime?: number
}

/**
 * Fetch all visible news items (public)
 * 
 * @param options Query options
 * @returns Query result with visible news list, loading states, and error
 * 
 * @example
 * const { data, isLoading, error } = useGetVisibleNews()
 * return data?.data?.map(news => <NewsCard key={news.id} news={news} />)
 */
export const useGetVisibleNews = (options?: UseGetVisibleNewsOptions) => {
  return useQuery({
    queryKey: NEWS_QUERY_KEYS.visible(),
    queryFn: async () => {
      const response = await getVisibleNews()
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch visible news')
      }
      return response
    },
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}
