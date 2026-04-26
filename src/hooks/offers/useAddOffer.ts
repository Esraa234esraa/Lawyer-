import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { addOffer } from '@/services/offerService'
import { OfferSubmitInput } from '@/types/offer'
import { OFFERS_QUERY_KEYS } from './useGetAllOffers'

export const useAddOffer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: OfferSubmitInput) => addOffer(payload),
    onSuccess: (response) => {
      toast.success(response.message || 'تمت إضافة العرض بنجاح')
      queryClient.invalidateQueries({ queryKey: OFFERS_QUERY_KEYS.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'فشل في إضافة العرض')
    },
  })
}
