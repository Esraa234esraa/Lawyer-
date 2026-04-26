import { useQuery } from '@tanstack/react-query'
import { getOfferById } from '@/services/offerService'
import { OFFERS_QUERY_KEYS } from './useGetAllOffers'
import { OfferFilterType } from '@/types/offer'

export const useGetOfferById = (id: string, hiringAndTraning: OfferFilterType, enabled = true) => {
  return useQuery({
    queryKey: OFFERS_QUERY_KEYS.detail(id, hiringAndTraning),
    queryFn: () => getOfferById(id, hiringAndTraning),
    enabled: enabled && Boolean(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
