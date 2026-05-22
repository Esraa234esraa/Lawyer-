import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGetIssueById, useGetIssueTypes } from '@/hooks/issues'
import { useLanguage } from '@/hooks/useLanguage'

const resolveAttachmentPath = (filePath: string | undefined) => {
  if (!filePath) return ''
  const trimmedPath = filePath.trim()
  const embeddedUrl = trimmedPath.match(/https?:\/\/[^\s"'<>]+/i)?.[0]

  if (embeddedUrl) return embeddedUrl
  if (trimmedPath.startsWith('http')) return trimmedPath

  const normalized = trimmedPath.replace(/^\/?wwwroot\/?/i, '').replace(/^\/+/, '')
  return `https://lawm.runasp.net/${normalized}`
}

export default function AdminCaseDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isArabic } = useLanguage()

  const { data: issueResponse, isLoading } = useGetIssueById(id)
  const { data: issueTypesResponse } = useGetIssueTypes()

  const issue = issueResponse?.data
  const issueTypes = issueTypesResponse?.data || []

  const issueTypeName = useMemo(() => {
    if (!issue) return ''
    const found = issueTypes.find((type) => type.id === issue.issueTypeId)
    return isArabic ? found?.nameAr || 'غير محدد' : found?.nameEn || found?.nameAr || 'N/A'
  }, [issue, issueTypes, isArabic])

  if (isLoading) {
    return <div className="text-gray-300 font-cairo">{isArabic ? 'جاري تحميل بيانات القضية...' : 'Loading case details...'}</div>
  }

  if (!issue) {
    return (
      <div dir="rtl" className="space-y-6">
        <button onClick={() => navigate('/admin/cases')} className="text-gold hover:underline font-cairo">
          {isArabic ? '← رجوع' : '← Back'}
        </button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-200 font-cairo">
          {isArabic ? 'القضية غير موجودة أو تم حذفها.' : 'Case not found or deleted.'}
        </div>
      </div>
    )
  }

  const attachments = issue.attachments || []
  const clients = issue.clients || []
  const previewImage = resolveAttachmentPath(attachments[0]?.filePath)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      dir={isArabic ? 'rtl' : 'ltr'}
      className="space-y-8"
    >
      <button onClick={() => navigate('/admin/cases')} className="text-gold hover:underline font-cairo">
        {isArabic ? '← رجوع' : '← Back'}
      </button>

      <h1 className="text-heading-1 text-gold font-cairo">{issue.titeleAr}</h1>

      {/* {previewImage && (
        <div className="rounded-xl overflow-hidden border border-gold/20">
          <img src={previewImage} alt={issue.titeleAr} className="w-full h-72 object-cover" />
        </div>
      )} */}


      <div className="bg-charcoal border border-gold/20 rounded-xl p-8 space-y-6">
        <div className="flex flex-wrap gap-4">
          <span className="border border-gold/30 text-gold px-4 py-2 rounded-full text-sm">{issueTypeName}</span>
          <span className="border border-gold/30 text-gold px-4 py-2 rounded-full text-sm">
            {isArabic ? `المدعي عليه: ${issue.defendant}` : `Defendant: ${issue.defendant}`}
          </span>
        </div>

        {/* <div>
          <h2 className="text-gold mb-3 font-cairo">{isArabic ? 'العنوان الإنجليزي' : 'English Title'}</h2>
          <p className="text-gray-300 leading-relaxed font-cairo">{issue.titeleEn || '-'}</p>
        </div> */}

        <div>
          <h2 className="text-gold mb-4 font-cairo">{isArabic ? 'عملاء القضية' : 'Issue Clients'}</h2>
          {clients.length > 0 ? (
            <div className="space-y-3">
              {clients.map((client, index) => (
                <div key={`${client.nationalId}-${index}`} className="rounded-lg border border-gold/20 p-4 bg-black/20">
                  <p className="text-white text-sm">{client.name}</p>
                  <p className="text-gray-400 text-xs">{client.nationalId}</p>
                  {client.nationalIdentityPath && (
                    <a
                      href={resolveAttachmentPath(client.nationalIdentityPath)}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex text-gold text-xs hover:underline"
                    >
                      {isArabic ? 'عرض بطاقة الهوية' : 'View Identity Card'}
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-300">{isArabic ? 'لا يوجد عملاء' : 'No clients'}</p>
          )}
        </div>

        <div>
          {attachments.length > 0 ? (
            <div className="space-y-3">
              {attachments.map((attachment, index) => {
                const fileUrl = resolveAttachmentPath(attachment.filePath)
                const fileName = attachment.filePath.split('/').pop() || `attachment-${index + 1}`
                return (
                  <a
                    key={`${attachment.filePath}-${index}`}
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block bg-primary-black border border-gold/10 hover:border-gold/40 rounded-lg px-4 py-3 transition"
                  >
                    <p className="text-gray-200 font-cairo text-sm">{isArabic ? `مرفق ${index + 1}` : `Attachment ${index + 1}`}</p>
                    <p className="text-xs text-gray-400">{fileName}</p>
                  </a>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-300">{isArabic ? 'لا توجد مرفقات' : 'No attachments'}</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
