/**
 * Add News Mutation Hook
 * Create new news with image upload
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addNews } from '@/services/newsService'
import { NewsCreateInput, AddNewsResponse } from '@/types/news'
import { NEWS_QUERY_KEYS } from './useGetAllNews'
import { toast } from 'sonner'

interface UseAddNewsOptions {
  onSuccess?: (data: AddNewsResponse) => void
  onError?: (error: Error) => void
}

/**
 * Create new news item with image upload
 * Automatically invalidates news lists after success
 * 
 * @param options Callback options
 * @returns Mutation object with mutate/mutateAsync, loading states, and error
 * 
 * @example
 * const mutation = useAddNews({
 *   onSuccess: (data) => navigate('/admin/news')
 * })
 * 
 * const handleSubmit = async (formData) => {
 *   try {
 *     await mutation.mutateAsync(formData)
 *   } catch (error) {
 *     console.error(error)
 *   }
 * }
 */
export const useAddNews = (options?: UseAddNewsOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: NewsCreateInput) => {
      const response = await addNews(input)
      if (!response.success) {
        throw new Error(response.message || 'Failed to create news')
      }
      return response
    },
    onSuccess: (data) => {
      // Show success toast with backend message
      toast.success(data.message || 'تم إضافة الخبر بنجاح')

      // Invalidate all news queries to refetch
      queryClient.invalidateQueries({
        queryKey: NEWS_QUERY_KEYS.all,
      })

      // Call custom onSuccess callback if provided
      options?.onSuccess?.(data)
    },
    onError: (error: Error) => {
      // Show error toast with error message
      const errorMessage = error.message || 'فشل في إضافة الخبر'
      toast.error(errorMessage)

      // Call custom onError callback if provided
      options?.onError?.(error)
    },
  })
}
