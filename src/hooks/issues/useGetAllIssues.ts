import { useQuery } from '@tanstack/react-query'
import { getAllIssues } from '@/services/issuesService'

export const ISSUES_QUERY_KEYS = {
  all: ['issues'] as const,
  issue: (id: string) => ['issue', id] as const,
  issueTypes: ['issueTypes'] as const,
}

export const useGetAllIssues = () => {
  return useQuery({
    queryKey: ISSUES_QUERY_KEYS.all,
    queryFn: getAllIssues,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
