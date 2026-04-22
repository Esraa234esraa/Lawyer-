/**
 * Update News Mutation Hook
 * Update existing news with optional image upload
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateNews } from '@/services/newsService'
import { NewsUpdateInput, ToggleNewsResponse } from '@/types/news'
import { NEWS_QUERY_KEYS } from './useGetAllNews'
import { toast } from 'sonner'

interface UseUpdateNewsOptions {
  onSuccess?: (data: ToggleNewsResponse) => void
  onError?: (error: Error) => void
}

/**
 * Update existing news item with optional image upload
 * Automatically invalidates related queries after success
 * 
 * @param id News ID to update
 * @param options Callback options
 * @returns Mutation object with mutate/mutateAsync, loading states, and error
 * 
 * @example
 * const mutation = useUpdateNews(newsId, {
 *   onSuccess: (data) => navigate('/admin/news')
 * })
 * 
 * const handleSubmit = async (formData) => {
 *   await mutation.mutateAsync(formData)
 * }
 */
export const useUpdateNews = (id: string, options?: UseUpdateNewsOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: NewsUpdateInput) => {
      const response = await updateNews(id, input)
      if (!response.success) {
        throw new Error(response.message || 'Failed to update news')
      }
      return response
    },
    onSuccess: (data) => {
      // Show success toast
      toast.success(data.message || 'تم تحديث الخبر بنجاح')

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: NEWS_QUERY_KEYS.all,
      })
      queryClient.invalidateQueries({
        queryKey: NEWS_QUERY_KEYS.detail(id),
      })

      // Call custom onSuccess callback if provided
      options?.onSuccess?.(data)
    },
    onError: (error: Error) => {
      // Show error toast
      toast.error(error.message || 'فشل في تحديث الخبر')

      // Call custom onError callback if provided
      options?.onError?.(error)
    },
  })
}
