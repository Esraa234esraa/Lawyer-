import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Clock3, CalendarCheck2, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import StatCard from '@/components/admin/StatCard'
import SessionsTable from '@/components/sessions/SessionsTable'
import { useLanguage } from '@/hooks/useLanguage'
import { useDeleteSession, useSessions } from '@/hooks/sessions'
import type { Session } from '@/types/session'

export default function SessionsListPage() {
  const navigate = useNavigate()
  const { isArabic } = useLanguage()

  const { sessions, isLoading, isFetching, isError, error, refetch } = useSessions()
  const deleteSessionMutation = useDeleteSession()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const stats = useMemo(() => {
    const total = sessions.length
    const scheduled = sessions.filter((session) => session.sessionStatus === 7).length
    const completed = sessions.filter((session) => session.sessionStatus === 6).length
    const postponed = sessions.filter((session) => session.sessionStatus === 2 || session.sessionStatus === 3).length

    return {
      total,
      scheduled,
      completed,
      postponed,
    }
  }, [sessions])

  const handleDelete = async (session: Session) => {
    try {
      setDeletingId(session.id)
      await deleteSessionMutation.mutateAsync(session.id)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div dir="rtl" className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-wrap items-center gap-3"
      >
        <div>
          <h1 className="text-heading-1 text-gradient font-cairo font-bold">
            {isArabic ? 'إدارة الجلسات' : 'Sessions Management'}
          </h1>
          <p className="text-gray-400 text-sm font-cairo">
            {isArabic ? `إجمالي الجلسات: ${sessions.length}` : `Total sessions: ${sessions.length}`}
          </p>
          {isFetching && !isLoading && (
            <p className="text-gray-500 text-xs mt-1">{isArabic ? 'جاري تحديث البيانات...' : 'Refreshing data...'}</p>
          )}
        </div>

        <Button type="button" className="ms-auto" onClick={() => navigate('/admin/sessions/new')}>
          <Plus size={16} />
          {isArabic ? 'إضافة جلسة' : 'Add Session'}
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          titleAr="إجمالي الجلسات"
          titleEn="Total Sessions"
          value={stats.total}
          icon={<CalendarCheck2 size={22} />}
          color="gold"
        />
        <StatCard
          titleAr="الجلسات المجدولة"
          titleEn="Scheduled"
          value={stats.scheduled}
          icon={<Clock3 size={22} />}
          color="blue"
        />
        <StatCard
          titleAr="الجلسات المكتملة"
          titleEn="Completed"
          value={stats.completed}
          icon={<CheckCircle2 size={22} />}
          color="green"
        />
        <StatCard
          titleAr="الجلسات المؤجلة"
          titleEn="Postponed"
          value={stats.postponed}
          icon={<Clock3 size={22} />}
          color="red"
        />
      </div>

      <SessionsTable
        sessions={sessions}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        errorMessage={error instanceof Error ? error.message : isArabic ? 'تعذر تحميل الجلسات' : 'Failed to load sessions'}
        isDeletePending={deleteSessionMutation.isPending}
        deletingId={deletingId}
        isArabic={isArabic}
        onRefetch={() => {
          void refetch()
        }}
        onView={(id) => navigate(`/admin/sessions/${id}`)}
        onEdit={(id) => navigate(`/admin/sessions/${id}/edit`)}
        onDelete={handleDelete}
      />
    </div>
  )
}
