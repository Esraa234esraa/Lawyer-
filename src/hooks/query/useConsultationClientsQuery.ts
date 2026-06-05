import { useQuery } from '@tanstack/react-query'
import { consultationClientService, ConsultationClient } from '@/services/consultationClientService'
import { toast } from 'sonner'

export function useConsultationClientsQuery() {
  return useQuery<ConsultationClient[]>({
    queryKey: ['consultationClients'],
    queryFn: async () => {
      try {
        return await consultationClientService.getAllConsultationClients()
      } catch (err: any) {
        toast.error(err?.message || 'حدث خطأ أثناء جلب العملاء')
        throw err
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  })
}
