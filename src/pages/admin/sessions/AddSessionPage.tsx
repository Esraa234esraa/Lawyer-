import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import SessionForm from '@/components/sessions/SessionForm'
import Loading from '@/components/ui/Loading'
import { useLanguage } from '@/hooks/useLanguage'
import { useCreateSession } from '@/hooks/sessions'
import { useGetAllIssues } from '@/hooks/issues'
import type { SessionCreateInput } from '@/types/session'
import type { SessionFormValues } from '@/schemas/session.schema'

export default function AddSessionPage() {
  const { isArabic } = useLanguage()
  const navigate = useNavigate()

  const createMutation = useCreateSession()
  const { data: issuesResponse, isLoading: issuesLoading } = useGetAllIssues()

  const issueOptions = useMemo(() => {
    const issues = issuesResponse?.data || []
    return issues.map((issue) => ({
      id: issue.id,
      label: isArabic ? issue.titeleAr : issue.titeleEn || issue.titeleAr,
    }))
  }, [isArabic, issuesResponse?.data])

  const handleSubmit = async (values: SessionFormValues) => {
    const payload: SessionCreateInput = {
      decision: values.decision,
      court: values.court,
      sessioNote: values.sessioNote,
      sessioNumber: values.sessioNumber,
      sessionStatus: values.sessionStatus as SessionCreateInput['sessionStatus'],
      sessionType: values.sessionType as SessionCreateInput['sessionType'],
      sessionDate: values.sessionDate,
      nextSessionDate: values.nextSessionDate || null,
      issueId: values.issueId,
      sessionFiles: values.sessionFiles || [],
    }

    await createMutation.mutateAsync(payload)
    navigate('/admin/sessions')
  }

  if (issuesLoading) {
    return (
      <div className="py-10">
        <Loading inline message={isArabic ? 'جاري تحميل القضايا...' : 'Loading issues...'} />
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
          {isArabic ? 'إضافة جلسة جديدة' : 'Add New Session'}
        </h1>
        <p className="text-gray-400 text-sm">{isArabic ? 'أدخل بيانات الجلسة وارفع المرفقات المطلوبة' : 'Fill session details and upload required attachments'}</p>
      </div>

      <div className="rounded-xl border border-gold/20 bg-charcoal/40 p-6">
        <SessionForm
          mode="create"
          isArabic={isArabic}
          issueOptions={issueOptions}
          isPending={createMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/sessions')}
        />
      </div>
    </motion.div>
  )
}
