import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateOffer } from '@/services/offerService'
import { OfferSubmitInput } from '@/types/offer'
import { OFFERS_QUERY_KEYS } from './useGetAllOffers'

interface UpdateOfferInput {
  id: string
  payload: OfferSubmitInput
}

export const useUpdateOffer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: UpdateOfferInput) => updateOffer(id, payload),
    onSuccess: (_response, variables) => {
      toast.success(_response.message || 'تم تحديث العرض بنجاح')
      queryClient.invalidateQueries({ queryKey: OFFERS_QUERY_KEYS.all })
      queryClient.invalidateQueries({ queryKey: OFFERS_QUERY_KEYS.detail(variables.id, variables.payload.hiringAndTraning) })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'فشل في تحديث العرض')
    },
  })
}
