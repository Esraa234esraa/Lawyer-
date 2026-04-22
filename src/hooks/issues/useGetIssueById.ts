import { useQuery } from '@tanstack/react-query'
import { getIssueById } from '@/services/issuesService'
import { ISSUES_QUERY_KEYS } from './useGetAllIssues'

export const useGetIssueById = (id: string | null | undefined) => {
  return useQuery({
    queryKey: ISSUES_QUERY_KEYS.issue(id || ''),
    queryFn: () => getIssueById(id as string),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
