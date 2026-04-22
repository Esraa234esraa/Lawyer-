import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { addIssue } from '@/services/issuesService'
import { ISSUES_QUERY_KEYS } from './useGetAllIssues'

export const useAddIssue = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addIssue,
    onSuccess: (response) => {
      toast.success(response.message || 'تمت إضافة القضية بنجاح')
      queryClient.invalidateQueries({ queryKey: ISSUES_QUERY_KEYS.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'فشل في إضافة القضية')
    },
  })
}
