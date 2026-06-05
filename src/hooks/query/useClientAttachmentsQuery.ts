import { useQuery } from '@tanstack/react-query'
import { consultationClientService, ClientAttachment } from '@/services/consultationClientService'
import { toast } from 'sonner'

export function useClientAttachmentsQuery(clientId?: string, enabled = false) {
  return useQuery<ClientAttachment[]>({
    queryKey: ['clientAttachments', clientId],
    queryFn: async () => {
      try {
        return await consultationClientService.getClientAttachments(String(clientId))
      } catch (err: any) {
        toast.error(err?.message || 'حدث خطأ أثناء جلب مرفقات العميل')
        throw err
      }
    },
    staleTime: 2 * 60 * 1000,
    retry: 1,
    enabled: enabled && !!clientId,
  })
}
