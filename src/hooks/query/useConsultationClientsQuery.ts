import { useQuery } from '@tanstack/react-query'
import { consultationClientService, ConsultationClient } from '@/services/consultationClientService'
import { toast } from 'sonner'

export function useConsultationClientsQuery() {
  return useQuery<ConsultationClient[]>({
    queryKey: ['consultationClients'],
    queryFn: consultationClientService.getAllConsultationClients,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    onError: (err: any) => {
      toast.error(err?.message || 'حدث خطأ أثناء جلب العملاء')
    },
  })
}
