import type { SessionStatus, SessionType, SessionsQueryParams } from '@/types/session'

export const SESSION_QUERY_KEYS = {
  all: ['sessions'] as const,
  list: (params?: SessionsQueryParams) => ['sessions', 'list', params || {}] as const,
  detail: (id: string) => ['session', id] as const,
} as const

export const SESSION_STATUS_OPTIONS: Array<{ value: SessionStatus; labelAr: string; labelEn: string }> = [
  { value: 1, labelAr: 'محكوم فيها', labelEn: 'Judged' },
  { value: 2, labelAr: 'مؤجلة', labelEn: 'Postponed' },
  { value: 3, labelAr: 'مأجلة', labelEn: 'Deferred' },
  { value: 4, labelAr: 'ملغية', labelEn: 'Cancelled' },
  { value: 5, labelAr: 'معاد جدولتها', labelEn: 'Rescheduled' },
  { value: 6, labelAr: 'مكتملة', labelEn: 'Completed' },
  { value: 7, labelAr: 'مجدولة', labelEn: 'Scheduled' },
]

export const SESSION_TYPE_OPTIONS: Array<{ value: SessionType; labelAr: string; labelEn: string }> = [
  { value: 1, labelAr: 'أونلاين', labelEn: 'Online' },
  { value: 2, labelAr: 'حضوري', labelEn: 'In Person' },
  { value: 3, labelAr: 'كتابي', labelEn: 'Written' },
]

export const SESSION_STATUS_COLOR: Record<SessionStatus, string> = {
  1: 'bg-green-500/15 text-green-300 border border-green-500/30',
  2: 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/30',
  3: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
  4: 'bg-red-500/15 text-red-300 border border-red-500/30',
  5: 'bg-blue-500/15 text-blue-300 border border-blue-500/30',
  6: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
  7: 'bg-violet-500/15 text-violet-300 border border-violet-500/30',
}
