/**
 * Delete News Mutation Hook
 * Delete news by ID
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteNews } from '@/services/newsService'
import { ToggleNewsResponse } from '@/types/news'
import { NEWS_QUERY_KEYS } from './useGetAllNews'
import { toast } from 'sonner'

interface UseDeleteNewsOptions {
  onSuccess?: (data: ToggleNewsResponse) => void
  onError?: (error: Error) => void
}

/**
 * Delete news item by ID
 * Automatically invalidates related queries after success
 * 
 * @param options Callback options
 * @returns Mutation object with mutate/mutateAsync, loading states, and error
 * 
 * @example
 * const mutation = useDeleteNews({
 *   onSuccess: () => navigate('/admin/news')
 * })
 * 
 * const handleDelete = async (newsId) => {
 *   if (confirm('Are you sure?')) {
 *     await mutation.mutateAsync(newsId)
 *   }
 * }
 */
export const useDeleteNews = (options?: UseDeleteNewsOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteNews(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete news')
      }
      return response
    },
    onSuccess: (data) => {
      // Show success toast
      toast.success(data.message || 'تم حذف الخبر بنجاح')

      // Invalidate all news queries
      queryClient.invalidateQueries({
        queryKey: NEWS_QUERY_KEYS.all,
      })

      // Call custom onSuccess callback if provided
      options?.onSuccess?.(data)
    },
    onError: (error: Error) => {
      // Show error toast
      toast.error(error.message || 'فشل في حذف الخبر')

      // Call custom onError callback if provided
      options?.onError?.(error)
    },
  })
}
