import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Edit2, Eye, Filter, RefreshCcw, Search, Trash2 } from 'lucide-react'
import Modal from '@/components/admin/Modal'
import Button from '@/components/ui/Button'
import Loading from '@/components/ui/Loading'
import {
  SESSION_STATUS_COLOR,
  SESSION_STATUS_OPTIONS,
  SESSION_TYPE_OPTIONS,
} from '@/constants/sessions'
import type { Session, SessionStatus } from '@/types/session'
import { exportSessionsCsv, exportSessionsPdf } from '@/utils/sessionExport'

interface SessionsTableProps {
  sessions: Session[]
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  errorMessage: string
  isDeletePending: boolean
  deletingId?: string | null
  isArabic: boolean
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (session: Session) => void
  onRefetch: () => void
}

type SortField = 'sessionDate' | 'nextSessionDate' | 'sessioNumber' | 'decision' | 'court'
type SortOrder = 'asc' | 'desc'

const PAGE_SIZE = 8

const formatDate = (value: string | null | undefined, locale: 'ar' | 'en') => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date)
}

export default function SessionsTable({
  sessions,
  isLoading,
  isFetching,
  isError,
  errorMessage,
  isDeletePending,
  deletingId,
  isArabic,
  onView,
  onEdit,
  onDelete,
  onRefetch,
}: SessionsTableProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<SortField>('sessionDate')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [page, setPage] = useState(1)
  const [selectedToDelete, setSelectedToDelete] = useState<Session | null>(null)

  const statusMap = useMemo(() => {
    const map = new Map<number, string>()
    SESSION_STATUS_OPTIONS.forEach((status) => {
      map.set(status.value, isArabic ? status.labelAr : status.labelEn)
    })
    return map
  }, [isArabic])

  const typeMap = useMemo(() => {
    const map = new Map<number, string>()
    SESSION_TYPE_OPTIONS.forEach((type) => {
      map.set(type.value, isArabic ? type.labelAr : type.labelEn)
    })
    return map
  }, [isArabic])

  const filteredSorted = useMemo(() => {
    const term = search.trim().toLowerCase()

    const filtered = sessions.filter((session) => {
      const matchesSearch =
        !term ||
        session.decision.toLowerCase().includes(term) ||
        session.court.toLowerCase().includes(term) ||
        session.sessioNumber.toLowerCase().includes(term) ||
        session.sessioNote.toLowerCase().includes(term)

      const matchesStatus = statusFilter === 'all' || String(session.sessionStatus) === statusFilter
      const matchesType = typeFilter === 'all' || String(session.sessionType) === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })

    const sorted = [...filtered].sort((a, b) => {
      const first = a[sortField]
      const second = b[sortField]

      if (sortField === 'sessionDate' || sortField === 'nextSessionDate') {
        const firstTime = first ? new Date(String(first)).getTime() : 0
        const secondTime = second ? new Date(String(second)).getTime() : 0
        return sortOrder === 'asc' ? firstTime - secondTime : secondTime - firstTime
      }

      const firstValue = String(first || '')
      const secondValue = String(second || '')
      return sortOrder === 'asc'
        ? firstValue.localeCompare(secondValue, 'ar')
        : secondValue.localeCompare(firstValue, 'ar')
    })

    return sorted
  }, [search, sessions, statusFilter, typeFilter, sortField, sortOrder])

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredSorted.slice(start, start + PAGE_SIZE)
  }, [filteredSorted, page])

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE))

  useEffect(() => {
    setPage(1)
  }, [search, statusFilter, typeFilter, sortField, sortOrder])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortField(field)
    setSortOrder('desc')
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gold/20 bg-charcoal/40 p-8">
        <Loading inline message={isArabic ? 'جاري تحميل الجلسات...' : 'Loading sessions...'} />
        <div className="mt-6 grid gap-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-12 rounded-lg bg-primary-black/60 animate-pulse border border-gold/10" />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-8 text-center" dir="rtl">
        <p className="text-red-200 font-cairo mb-4">{errorMessage}</p>
        <Button type="button" onClick={onRefetch}>
          <RefreshCcw size={16} />
          {isArabic ? 'إعادة المحاولة' : 'Retry'}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4" dir="rtl">
      <div className="grid lg:grid-cols-5 gap-3">
        <div className="lg:col-span-2 relative">
          <Search size={16} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="input-gold pr-9"
            placeholder={isArabic ? 'ابحث بالقرار أو المحكمة أو رقم الجلسة' : 'Search by decision, court, or number'}
          />
        </div>

        <select className="input-gold" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="all">{isArabic ? 'كل الحالات' : 'All statuses'}</option>
          {SESSION_STATUS_OPTIONS.map((status) => (
            <option key={status.value} value={status.value}>
              {isArabic ? status.labelAr : status.labelEn}
            </option>
          ))}
        </select>

        <select className="input-gold" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
          <option value="all">{isArabic ? 'كل الأنواع' : 'All types'}</option>
          {SESSION_TYPE_OPTIONS.map((type) => (
            <option key={type.value} value={type.value}>
              {isArabic ? type.labelAr : type.labelEn}
            </option>
          ))}
        </select>

        <Button type="button" variant="secondary" onClick={onRefetch} disabled={isFetching}>
          <RefreshCcw size={16} className={isFetching ? 'animate-spin' : ''} />
          {isArabic ? 'تحديث' : 'Refresh'}
        </Button>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => exportSessionsCsv(filteredSorted, isArabic)}
          disabled={filteredSorted.length === 0}
        >
          {isArabic ? 'تصدير CSV' : 'Export CSV'}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => exportSessionsPdf(filteredSorted, isArabic)}
          disabled={filteredSorted.length === 0}
        >
          {isArabic ? 'تصدير PDF' : 'Export PDF'}
        </Button>
      </div>

      <div className="rounded-xl border border-gold/20 overflow-hidden bg-charcoal/40">
        <div className="overflow-x-auto">
          <table className="min-w-full text-right">
            <thead className="bg-primary-black border-b border-gold/20">
              <tr>
                <th className="px-4 py-3 text-gold text-sm">#</th>
                <th className="px-4 py-3 text-gold text-sm cursor-pointer" onClick={() => toggleSort('sessioNumber')}>
                  {isArabic ? 'رقم الجلسة' : 'Session Number'}
                </th>
                <th className="px-4 py-3 text-gold text-sm cursor-pointer" onClick={() => toggleSort('decision')}>
                  {isArabic ? 'القرار' : 'Decision'}
                </th>
                <th className="px-4 py-3 text-gold text-sm cursor-pointer" onClick={() => toggleSort('court')}>
                  {isArabic ? 'المحكمة' : 'Court'}
                </th>
                <th className="px-4 py-3 text-gold text-sm">
                  <div className="inline-flex items-center gap-1">
                    <Filter size={13} />
                    {isArabic ? 'الحالة' : 'Status'}
                  </div>
                </th>
                <th className="px-4 py-3 text-gold text-sm">{isArabic ? 'النوع' : 'Type'}</th>
                <th className="px-4 py-3 text-gold text-sm cursor-pointer" onClick={() => toggleSort('sessionDate')}>
                  {isArabic ? 'التاريخ' : 'Date'}
                </th>
                <th className="px-4 py-3 text-gold text-sm cursor-pointer" onClick={() => toggleSort('nextSessionDate')}>
                  {isArabic ? 'الجلسة القادمة' : 'Next Session'}
                </th>
                <th className="px-4 py-3 text-gold text-sm">{isArabic ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-gray-300">
                    {isArabic ? 'لا توجد جلسات مطابقة للبحث أو الفلاتر' : 'No sessions match current filters'}
                  </td>
                </tr>
              ) : (
                paginated.map((session, index) => (
                  <motion.tr
                    key={session.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="border-b border-gold/10 hover:bg-primary-black/30"
                  >
                    <td className="px-4 py-3 text-gray-300 text-sm">{(page - 1) * PAGE_SIZE + index + 1}</td>
                    <td className="px-4 py-3 text-gray-200 text-sm">{session.sessioNumber}</td>
                    <td className="px-4 py-3 text-gray-200 text-sm max-w-[220px] truncate">{session.decision}</td>
                    <td className="px-4 py-3 text-gray-200 text-sm">{session.court}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${SESSION_STATUS_COLOR[session.sessionStatus as SessionStatus]}`}>
                        {statusMap.get(session.sessionStatus) || session.sessionStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-200 text-sm">{typeMap.get(session.sessionType) || session.sessionType}</td>
                    <td className="px-4 py-3 text-gray-200 text-sm">{formatDate(session.sessionDate, isArabic ? 'ar' : 'en')}</td>
                    <td className="px-4 py-3 text-gray-200 text-sm">{formatDate(session.nextSessionDate, isArabic ? 'ar' : 'en')}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onView(session.id)}
                          className="p-2 rounded-md bg-blue-500/15 text-blue-300 hover:bg-blue-500/25"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit(session.id)}
                          className="p-2 rounded-md bg-gold/15 text-gold hover:bg-gold/25"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedToDelete(session)}
                          disabled={isDeletePending}
                          className="p-2 rounded-md bg-red-500/15 text-red-300 hover:bg-red-500/25 disabled:opacity-60"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between bg-primary-black/60 border border-gold/15 rounded-lg px-4 py-3 text-sm">
        <p className="text-gray-300">
          {isArabic
            ? `إجمالي النتائج: ${filteredSorted.length}`
            : `Total results: ${filteredSorted.length}`}
        </p>
        <div className="flex items-center gap-2">
          <Button type="button" size="sm" variant="secondary" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1}>
            {isArabic ? 'السابق' : 'Prev'}
          </Button>
          <span className="text-gray-300 px-2">
            {isArabic ? `صفحة ${page} من ${totalPages}` : `Page ${page} of ${totalPages}`}
          </span>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
          >
            {isArabic ? 'التالي' : 'Next'}
          </Button>
        </div>
      </div>

      <Modal
        isOpen={Boolean(selectedToDelete)}
        onClose={() => setSelectedToDelete(null)}
        title={isArabic ? 'تأكيد الحذف' : 'Delete Session'}
        titleAr="تأكيد الحذف"
      >
        <div className="space-y-4" dir="rtl">
          <p className="text-gray-300">
            {isArabic
              ? 'هل أنت متأكد أنك تريد حذف هذه الجلسة؟ لا يمكن التراجع عن هذا الإجراء.'
              : 'Are you sure you want to delete this session? This action cannot be undone.'}
          </p>
          <div className="p-3 rounded-md border border-gold/20 bg-primary-black text-gold text-sm">
            {selectedToDelete?.decision}
          </div>
          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setSelectedToDelete(null)} disabled={isDeletePending}>
              {isArabic ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button
              type="button"
              isLoading={isDeletePending && deletingId === selectedToDelete?.id}
              disabled={isDeletePending}
              onClick={() => {
                if (selectedToDelete) {
                  onDelete(selectedToDelete)
                  setSelectedToDelete(null)
                }
              }}
            >
              {isArabic ? 'تأكيد الحذف' : 'Confirm Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
