import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateIssue } from '@/services/issuesService'
import { ISSUES_QUERY_KEYS } from './useGetAllIssues'

export const useUpdateIssue = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: FormData) => updateIssue(id, formData),
    onSuccess: (response) => {
      toast.success(response.message || 'تم تحديث القضية بنجاح')
      queryClient.invalidateQueries({ queryKey: ISSUES_QUERY_KEYS.all })
      queryClient.invalidateQueries({ queryKey: ISSUES_QUERY_KEYS.issue(id) })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'فشل في تحديث القضية')
    },
  })
}
