import { useMemo } from 'react'
import { CalendarDays, Download, Eye, FileText } from 'lucide-react'
import {
  SESSION_STATUS_COLOR,
  SESSION_STATUS_OPTIONS,
  SESSION_TYPE_OPTIONS,
} from '@/constants/sessions'
import type { Session, SessionStatus } from '@/types/session'

interface SessionDetailsCardProps {
  session: Session
  isArabic: boolean
}

const resolveAttachmentPath = (filePath: string) => {
  const trimmed = filePath.trim()

  if (trimmed.startsWith('http')) return trimmed

  const normalized = trimmed.replace(/^\/?wwwroot\/?/i, '').replace(/\\/g, '/').replace(/^\/+/, '')
  return `https://lawm.runasp.net/${normalized}`
}

const formatDate = (value: string | null, locale: 'ar' | 'en') => {
  if (!value) return '—'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  }).format(date)
}

export default function SessionDetailsCard({ session, isArabic }: SessionDetailsCardProps) {
  const statusLabel = useMemo(() => {
    const option = SESSION_STATUS_OPTIONS.find((item) => item.value === session.sessionStatus)
    return option ? (isArabic ? option.labelAr : option.labelEn) : String(session.sessionStatus)
  }, [isArabic, session.sessionStatus])

  const typeLabel = useMemo(() => {
    const option = SESSION_TYPE_OPTIONS.find((item) => item.value === session.sessionType)
    return option ? (isArabic ? option.labelAr : option.labelEn) : String(session.sessionType)
  }, [isArabic, session.sessionType])

  return (
    <div className="space-y-6" dir="rtl">
      <div className="rounded-xl border border-gold/20 bg-charcoal/40 p-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${SESSION_STATUS_COLOR[session.sessionStatus as SessionStatus]}`}>
            {statusLabel}
          </span>
          <span className="inline-flex px-3 py-1.5 rounded-full text-xs font-semibold border border-gold/30 text-gold">
            {typeLabel}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-gray-300 border border-gold/20 rounded-full px-3 py-1.5">
            <CalendarDays size={14} />
            {formatDate(session.sessionDate, isArabic ? 'ar' : 'en')}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-gold/15 bg-primary-black/40 p-4">
            <p className="text-gray-400 text-xs mb-1">{isArabic ? 'رقم الجلسة' : 'Session Number'}</p>
            <p className="text-white font-semibold">{session.sessioNumber}</p>
          </div>
          <div className="rounded-lg border border-gold/15 bg-primary-black/40 p-4">
            <p className="text-gray-400 text-xs mb-1">{isArabic ? 'المحكمة' : 'Court'}</p>
            <p className="text-white font-semibold">{session.court}</p>
          </div>
          <div className="rounded-lg border border-gold/15 bg-primary-black/40 p-4 md:col-span-2">
            <p className="text-gray-400 text-xs mb-1">{isArabic ? 'القرار' : 'Decision'}</p>
            <p className="text-white leading-relaxed">{session.decision}</p>
          </div>
          <div className="rounded-lg border border-gold/15 bg-primary-black/40 p-4 md:col-span-2">
            <p className="text-gray-400 text-xs mb-1">{isArabic ? 'ملاحظات الجلسة' : 'Session Note'}</p>
            <p className="text-white leading-relaxed">{session.sessioNote}</p>
          </div>
          <div className="rounded-lg border border-gold/15 bg-primary-black/40 p-4">
            <p className="text-gray-400 text-xs mb-1">{isArabic ? 'تاريخ الجلسة' : 'Session Date'}</p>
            <p className="text-white">{formatDate(session.sessionDate, isArabic ? 'ar' : 'en')}</p>
          </div>
          <div className="rounded-lg border border-gold/15 bg-primary-black/40 p-4">
            <p className="text-gray-400 text-xs mb-1">{isArabic ? 'تاريخ الجلسة القادمة' : 'Next Session Date'}</p>
            <p className="text-white">{formatDate(session.nextSessionDate, isArabic ? 'ar' : 'en')}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gold/20 bg-charcoal/40 p-6">
        <h2 className="text-gold font-semibold mb-4">{isArabic ? 'المرفقات' : 'Attachments'}</h2>

        {session.attachmentDtos.length === 0 ? (
          <div className="text-gray-400 text-sm">{isArabic ? 'لا توجد مرفقات لهذه الجلسة.' : 'No attachments for this session.'}</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {session.attachmentDtos.map((attachment, index) => {
              const fileUrl = resolveAttachmentPath(attachment.filePath)
              const fileName = attachment.fileName || attachment.filePath.split('/').pop() || `Attachment-${index + 1}`
              const isPdf = fileName.toLowerCase().endsWith('.pdf')

              return (
                <div
                  key={`${attachment.filePath}-${index}`}
                  className="rounded-lg border border-gold/20 bg-primary-black/50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-gold mb-2">
                        <FileText size={16} />
                        <span className="text-xs">{isArabic ? `ملف ${index + 1}` : `File ${index + 1}`}</span>
                      </div>
                      <p className="text-gray-200 text-sm break-all">{fileName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isPdf && (
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-md bg-blue-500/15 text-blue-300 hover:bg-blue-500/25"
                          aria-label={isArabic ? 'معاينة الملف' : 'Preview file'}
                        >
                          <Eye size={14} />
                        </a>
                      )}
                      <a
                        href={fileUrl}
                        download
                        className="p-2 rounded-md bg-gold/15 text-gold hover:bg-gold/25"
                        aria-label={isArabic ? 'تحميل الملف' : 'Download file'}
                      >
                        <Download size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
