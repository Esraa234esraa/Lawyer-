import { useQuery } from '@tanstack/react-query'
import { getAllOffers } from '@/services/offerService'
import { OfferFilterType } from '@/types/offer'

export const OFFERS_QUERY_KEYS = {
  all: ['offers'] as const,
  list: (hiringAndTraning: OfferFilterType) => [...OFFERS_QUERY_KEYS.all, 'list', hiringAndTraning] as const,
  details: () => [...OFFERS_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string, hiringAndTraning: OfferFilterType) => [...OFFERS_QUERY_KEYS.details(), id, hiringAndTraning] as const,
} as const

export const useGetAllOffers = (hiringAndTraning: OfferFilterType) => {
  return useQuery({
    queryKey: OFFERS_QUERY_KEYS.list(hiringAndTraning),
    queryFn: () => getAllOffers(hiringAndTraning),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
