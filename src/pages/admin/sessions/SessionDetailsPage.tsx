import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Loading from '@/components/ui/Loading'
import SessionDetailsCard from '@/components/sessions/SessionDetailsCard'
import { useLanguage } from '@/hooks/useLanguage'
import { useSession } from '@/hooks/sessions'

export default function SessionDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isArabic } = useLanguage()

  const { session, isLoading, isFetching, isError, error, refetch } = useSession(id || '')

  if (isLoading) {
    return (
      <div className="py-10">
        <Loading inline message={isArabic ? 'جاري تحميل بيانات الجلسة...' : 'Loading session details...'} />
      </div>
    )
  }

  if (isError || !session) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 space-y-4" dir="rtl">
        <p className="text-red-200">{error instanceof Error ? error.message : isArabic ? 'الجلسة غير موجودة' : 'Session not found'}</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => navigate('/admin/sessions')}>
            {isArabic ? 'رجوع' : 'Back'}
          </Button>
          <Button onClick={() => void refetch()}>{isArabic ? 'إعادة المحاولة' : 'Retry'}</Button>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-5"
      dir="rtl"
    >
      <div className="flex items-center gap-3">
        <Button variant="secondary" onClick={() => navigate('/admin/sessions')}>
          {isArabic ? 'رجوع' : 'Back'}
        </Button>
        <Button onClick={() => navigate(`/admin/sessions/${session.id}/edit`)}>{isArabic ? 'تعديل' : 'Edit'}</Button>
      </div>

      {isFetching && <p className="text-gray-500 text-xs">{isArabic ? 'جاري تحديث البيانات...' : 'Refreshing data...'}</p>}

      <SessionDetailsCard session={session} isArabic={isArabic} />
    </motion.div>
  )
}
