import { useParams, useNavigate } from 'react-router-dom'
import { useLanguage } from '@/hooks/useLanguage'
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useGetIssueById, useGetIssueTypes } from '@/hooks/issues'
import Loading from '@/components/ui/Loading'

const resolveAttachmentPath = (filePath: string | undefined) => {
  if (!filePath) return ''
  if (filePath.startsWith('http')) return filePath
  const normalized = filePath.replace(/^\/?wwwroot\/?/i, '')
  return `https://lawm.runasp.net/${normalized}`
}

export default function CaseDetails() {
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

  const attachments = useMemo(() => issue?.attachments || [], [issue?.attachments])
  const clients = useMemo(() => issue?.clients || [], [issue?.clients])

  const handleOpenAttachment = (url?: string) => {
    if (!url) return
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleDownloadAttachment = (url: string | undefined, fileName: string) => {
    if (!url) return
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) return <Loading message={isArabic ? 'جاري تحميل بيانات القضية...' : 'Loading case details...'} />

  if (!issue) {
    return (
      <div dir={isArabic ? 'rtl' : 'ltr'} className="space-y-6">
        <button onClick={() => navigate(-1)} className="text-gold hover:underline font-cairo">
          {isArabic ? '← رجوع' : '← Back'}
        </button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-200 font-cairo">
          {isArabic ? 'القضية غير موجودة أو تم حذفها.' : 'Case not found or deleted.'}
        </div>
      </div>
    )
  }

  const previewImage = resolveAttachmentPath(attachments[0]?.filePath)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      dir={isArabic ? 'rtl' : 'ltr'}
      className="space-y-8"
    >
      <button onClick={() => navigate(-1)} className="text-gold hover:underline font-cairo">
        {isArabic ? '← رجوع' : '← Back'}
      </button>

      <h1 className="text-heading-1 text-gold font-cairo">{issue.titeleAr}</h1>

      {previewImage && (
        <div className="rounded-xl overflow-hidden border border-gold/20">
          <img src={previewImage} alt={issue.titeleAr} className="w-full h-72 object-cover" />
        </div>
      )}

      <div className="bg-charcoal border border-gold/20 rounded-xl p-8 space-y-6">
        <div className="flex flex-wrap gap-4">
          <span className="border border-gold/30 text-gold px-4 py-2 rounded-full text-sm">{issueTypeName}</span>
          <span className="border border-gold/30 text-gold px-4 py-2 rounded-full text-sm">
            {isArabic ? `المدعي عليه: ${issue.defendant}` : `Defendant: ${issue.defendant}`}
          </span>
        </div>

        <div>
          <h2 className="text-gold mb-3 font-cairo">{isArabic ? 'العنوان الإنجليزي' : 'English Title'}</h2>
          <p className="text-gray-300 leading-relaxed font-cairo">{issue.titeleEn || '-'}</p>
        </div>

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
                      className="text-gold text-xs hover:underline"
                    >
                      {isArabic ? 'عرض الهوية' : 'View Identity'}
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
          <h2 className="text-gold mb-4 font-cairo">{isArabic ? 'مرفقات القضية' : 'Case Attachments'}</h2>
          {attachments.length > 0 ? (
            <div className="space-y-3">
              {attachments.map((attachment, index) => {
                const fileUrl = resolveAttachmentPath(attachment.filePath)
                const fileName = attachment.filePath.split('/').pop() || `attachment-${index + 1}`
                return (
                  <div
                    key={`${attachment.filePath}-${index}`}
                    className="flex flex-wrap justify-between items-center gap-3 bg-primary-black border border-gold/10 hover:border-gold/40 rounded-lg px-4 py-3 transition"
                  >
                    <div className="space-y-1">
                      <p className="text-gray-200 font-cairo text-sm">{isArabic ? `مرفق ${index + 1}` : `Attachment ${index + 1}`}</p>
                      <p className="text-xs text-gray-400">{fileName}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenAttachment(fileUrl)}
                        className="px-2 py-1 rounded-md bg-gold/15 text-gold text-xs"
                      >
                        {isArabic ? 'فتح' : 'Open'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadAttachment(fileUrl, fileName)}
                        className="px-2 py-1 rounded-md bg-blue-500/15 text-blue-300 text-xs"
                      >
                        {isArabic ? 'تحميل' : 'Download'}
                      </button>
                    </div>
                  </div>
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
