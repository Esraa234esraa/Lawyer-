/**
 * Hide News Mutation Hook
 * Hide news from public view
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { hideNews } from '@/services/newsService'
import { ToggleNewsResponse } from '@/types/news'
import { NEWS_QUERY_KEYS } from './useGetAllNews'
import { toast } from 'sonner'

interface UseHideNewsOptions {
  onSuccess?: (data: ToggleNewsResponse) => void
  onError?: (error: Error) => void
}

/**
 * Hide news from public view
 * Automatically invalidates related queries after success
 * 
 * @param options Callback options
 * @returns Mutation object with mutate/mutateAsync, loading states, and error
 * 
 * @example
 * const mutation = useHideNews()
 * 
 * const handleHide = async (newsId) => {
 *   await mutation.mutateAsync(newsId)
 * }
 */
export const useHideNews = (options?: UseHideNewsOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await hideNews(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to hide news')
      }
      return response
    },
    onSuccess: (data) => {
      // Show success toast
      toast.success(data.message || 'تم إخفاء الخبر بنجاح')

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
      toast.error(error.message || 'فشل في إخفاء الخبر')

      // Call custom onError callback if provided
      options?.onError?.(error)
    },
  })
}
