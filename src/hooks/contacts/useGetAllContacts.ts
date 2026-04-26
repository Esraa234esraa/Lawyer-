import { useQuery } from '@tanstack/react-query'
import { getAllContacts } from '@/services/contactService'

export const CONTACTS_QUERY_KEYS = {
  all: ['contacts'] as const,
} as const

export const useGetAllContacts = () => {
  return useQuery({
    queryKey: CONTACTS_QUERY_KEYS.all,
    queryFn: async () => {
      const response = await getAllContacts()
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch contacts')
      }
      return response
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
