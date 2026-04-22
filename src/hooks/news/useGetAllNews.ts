/**
 * News Query Hook
 * Fetch all news (admin)
 */

import { useQuery } from '@tanstack/react-query'
import { getAllNews } from '@/services/newsService'

export const NEWS_QUERY_KEYS = {
  all: ['news'] as const,
  lists: () => [...NEWS_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: any) => [...NEWS_QUERY_KEYS.lists(), { filters }] as const,
  visible: () => [...NEWS_QUERY_KEYS.all, 'visible'] as const,
  details: () => [...NEWS_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...NEWS_QUERY_KEYS.details(), id] as const,
} as const

interface UseGetAllNewsOptions {
  enabled?: boolean
  staleTime?: number
}

/**
 * Fetch all news items (admin)
 * 
 * @param options Query options
 * @returns Query result with news list, loading states, and error
 * 
 * @example
 * const { data, isLoading, error } = useGetAllNews()
 * if (isLoading) return <Skeleton />
 * return data?.data?.map(news => <NewsCard key={news.id} news={news} />)
 */
export const useGetAllNews = (options?: UseGetAllNewsOptions) => {
  return useQuery({
    queryKey: NEWS_QUERY_KEYS.all,
    queryFn: async () => {
      const response = await getAllNews()
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch news')
      }
      return response
    },
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  })
}
