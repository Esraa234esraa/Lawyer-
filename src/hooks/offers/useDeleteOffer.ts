import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteOffer } from '@/services/offerService'
import { OFFERS_QUERY_KEYS } from './useGetAllOffers'

export const useDeleteOffer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteOffer(id),
    onSuccess: (response) => {
      toast.success(response.message || 'تم حذف العرض بنجاح')
      queryClient.invalidateQueries({ queryKey: OFFERS_QUERY_KEYS.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'فشل في حذف العرض')
    },
  })
}
