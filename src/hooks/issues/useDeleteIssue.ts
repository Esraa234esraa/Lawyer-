import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteIssue } from '@/services/issuesService'
import { ISSUES_QUERY_KEYS } from './useGetAllIssues'

export const useDeleteIssue = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteIssue(id),
    onSuccess: (response) => {
      toast.success(response.message || 'تم حذف القضية بنجاح')
      queryClient.invalidateQueries({ queryKey: ISSUES_QUERY_KEYS.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'فشل في حذف القضية')
    },
  })
}
