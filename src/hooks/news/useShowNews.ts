/**
 * Show News Mutation Hook
 * Make news visible to public
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { showNews } from '@/services/newsService'
import { ToggleNewsResponse } from '@/types/news'
import { NEWS_QUERY_KEYS } from './useGetAllNews'
import { toast } from 'sonner'

interface UseShowNewsOptions {
  onSuccess?: (data: ToggleNewsResponse) => void
  onError?: (error: Error) => void
}

/**
 * Make news visible to public
 * Automatically invalidates related queries after success
 * 
 * @param options Callback options
 * @returns Mutation object with mutate/mutateAsync, loading states, and error
 * 
 * @example
 * const mutation = useShowNews()
 * 
 * const handleShow = async (newsId) => {
 *   await mutation.mutateAsync(newsId)
 * }
 */
export const useShowNews = (options?: UseShowNewsOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await showNews(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to show news')
      }
      return response
    },
    onSuccess: (data) => {
      // Show success toast
      toast.success(data.message || 'تم إظهار الخبر بنجاح')

      // Invalidate affected queries
      queryClient.invalidateQueries({
        queryKey: NEWS_QUERY_KEYS.all,
      })
      queryClient.invalidateQueries({
        queryKey: NEWS_QUERY_KEYS.visible(),
      })

      // Call custom onSuccess callback if provided
      options?.onSuccess?.(data)
    },
    onError: (error: Error) => {
      // Show error toast
      toast.error(error.message || 'فشل في إظهار الخبر')

      // Call custom onError callback if provided
      options?.onError?.(error)
    },
  })
}
