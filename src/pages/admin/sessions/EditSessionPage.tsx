import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import SessionForm from '@/components/sessions/SessionForm'
import Loading from '@/components/ui/Loading'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/hooks/useLanguage'
import { useSession, useUpdateSession } from '@/hooks/sessions'
import { useGetAllIssues } from '@/hooks/issues'
import type { SessionUpdateInput } from '@/types/session'
import type { SessionFormValues } from '@/schemas/session.schema'

export default function EditSessionPage() {
  const { id } = useParams<{ id: string }>()
  const { isArabic } = useLanguage()
  const navigate = useNavigate()

  const updateMutation = useUpdateSession()
  const { session, isLoading, isFetching, isError, error, refetch } = useSession(id || '')
  const { data: issuesResponse, isLoading: issuesLoading } = useGetAllIssues()

  const issueOptions = useMemo(() => {
    const issues = issuesResponse?.data || []
    return issues.map((issue) => ({
      id: issue.id,
      label: isArabic ? issue.titeleAr : issue.titeleEn || issue.titeleAr,
    }))
  }, [isArabic, issuesResponse?.data])

  const handleSubmit = async (values: SessionFormValues) => {
    if (!id) return

    const payload: SessionUpdateInput = {
      decision: values.decision,
      court: values.court,
      sessioNote: values.sessioNote,
      sessioNumber: values.sessioNumber,
      sessionStatus: values.sessionStatus as SessionUpdateInput['sessionStatus'],
      sessionType: values.sessionType as SessionUpdateInput['sessionType'],
      sessionDate: values.sessionDate,
      nextSessionDate: values.nextSessionDate || null,
      issueId: values.issueId,
      sessionFiles: values.sessionFiles || [],
    }

    await updateMutation.mutateAsync({ id, payload })
    navigate('/admin/sessions')
  }

  if (isLoading || issuesLoading) {
    return (
      <div className="py-10">
        <Loading inline message={isArabic ? 'جاري تحميل البيانات...' : 'Loading data...'} />
      </div>
    )
  }

  if (isError || !session) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 space-y-4" dir="rtl">
        <p className="text-red-200">{error instanceof Error ? error.message : isArabic ? 'تعذر تحميل بيانات الجلسة' : 'Failed to load session data'}</p>
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
      <div>
        <h1 className="text-heading-2 text-gradient font-cairo font-bold">
          {isArabic ? 'تعديل الجلسة' : 'Edit Session'}
        </h1>
        {isFetching && <p className="text-gray-500 text-xs mt-1">{isArabic ? 'جاري تحديث البيانات...' : 'Refreshing data...'}</p>}
      </div>

      <div className="rounded-xl border border-gold/20 bg-charcoal/40 p-6">
        <SessionForm
          mode="edit"
          initialSession={session}
          isArabic={isArabic}
          issueOptions={issueOptions}
          isPending={updateMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/sessions')}
        />
      </div>
    </motion.div>
  )
}
