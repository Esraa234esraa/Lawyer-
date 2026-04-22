import { useQuery } from '@tanstack/react-query'
import { getIssueTypes } from '@/services/issuesService'
import { ISSUES_QUERY_KEYS } from './useGetAllIssues'

export const useGetIssueTypes = () => {
  return useQuery({
    queryKey: ISSUES_QUERY_KEYS.issueTypes,
    queryFn: getIssueTypes,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  })
}
