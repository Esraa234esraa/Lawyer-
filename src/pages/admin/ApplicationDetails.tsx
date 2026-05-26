import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, ExternalLink } from 'lucide-react'
import Loading from '@/components/ui/Loading'
import { useLanguage } from '@/hooks/useLanguage'
import { useGetApplicationById } from '@/hooks/applications'

const getApplicationTypeLabel = (value: 1 | 2, isArabic: boolean) => {
  if (value === 1) {
    return isArabic ? 'وظيفة' : 'Job'
  }
  return isArabic ? 'تدريب' : 'Training'
}

const sanitizeFileNamePart = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-_]/g, '')

const getFileExtensionFromUrl = (url: string) => {
  const cleanUrl = url.split('?')[0].split('#')[0]
  const parts = cleanUrl.split('.')
  const extension = parts.length > 1 ? parts[parts.length - 1].toLowerCase() : ''
  if (!extension || extension.length > 5) {
    return 'pdf'
  }
  return extension
}

const triggerDownloadWithName = async (url: string, fileName: string) => {
  const response = await fetch(url)
  const blob = await response.blob()
  const objectUrl = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(objectUrl)
}

export default function ApplicationDetails() {
  const { isArabic } = useLanguage()
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, isFetching } = useGetApplicationById(id)
  const application = data?.data

  const cvFileName = application
    ? `${sanitizeFileNamePart(application.fullNmae || application.email || 'application-cv') || 'application-cv'}.${getFileExtensionFromUrl(application.cvPath || '')}`
    : 'application-cv.pdf'

  if (!id) {
    return (
      <div className="text-center text-red-400 font-cairo py-16">
        {isArabic ? 'معرف الطلب غير صالح' : 'Invalid application id'}
      </div>
    )
  }

  if (isLoading || isFetching) {
    return (
      <div className="py-16 flex justify-center">
        <Loading inline message={isArabic ? 'جاري تحميل تفاصيل الطلب...' : 'Loading application details...'} />
      </div>
    )
  }

  if (!application) {
    return (
      <div className="text-center text-red-400 font-cairo py-16">
        {isArabic ? 'لم يتم العثور على الطلب' : 'Application not found'}
      </div>
    )
  }

  return (
    <div dir="rtl">
      <div className="mb-6">
        <Link
          to="/admin/internships"
          className="inline-flex items-center gap-2 text-gold hover:text-gold-light font-cairo"
        >
          <ArrowRight className="w-4 h-4" />
          {isArabic ? 'العودة إلى الطلبات' : 'Back to applications'}
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-charcoal border border-gold/20 rounded-xl p-6"
      >
        <h1 className="text-heading-2 font-cairo font-bold text-gradient mb-6">
          {isArabic ? 'تفاصيل الطلب' : 'Application Details'}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-primary-black/40 rounded-lg p-4 border border-gold/10">
            <p className="text-gray-400 mb-1">{isArabic ? 'الاسم الكامل' : 'Full Name'}</p>
            <p className="text-white font-cairo">{application.fullNmae || '-'}</p>
          </div>
          <div className="bg-primary-black/40 rounded-lg p-4 border border-gold/10">
            <p className="text-gray-400 mb-1">{isArabic ? 'البريد الإلكتروني' : 'Email'}</p>
            <p className="text-white font-cairo">{application.email || '-'}</p>
          </div>
          <div className="bg-primary-black/40 rounded-lg p-4 border border-gold/10">
            <p className="text-gray-400 mb-1">{isArabic ? 'رقم الهاتف' : 'Phone Number'}</p>
            <p className="text-white font-cairo">{application.phoneNumber || '-'}</p>
          </div>
          <div className="bg-primary-black/40 rounded-lg p-4 border border-gold/10">
            <p className="text-gray-400 mb-1">{isArabic ? 'الجامعة' : 'University'}</p>
            <p className="text-white font-cairo">{application.university || '-'}</p>
          </div>
          <div className="bg-primary-black/40 rounded-lg p-4 border border-gold/10">
            <p className="text-gray-400 mb-1">{isArabic ? 'التخصص' : 'Specialty'}</p>
            <p className="text-white font-cairo">{application.specialty || '-'}</p>
          </div>
          <div className="bg-primary-black/40 rounded-lg p-4 border border-gold/10">
            <p className="text-gray-400 mb-1">{isArabic ? 'المعدل التراكمي' : 'GPA'}</p>
            <p className="text-white font-cairo">{application.gpa || '-'}</p>
          </div>
          <div className="bg-primary-black/40 rounded-lg p-4 border border-gold/10">
            <p className="text-gray-400 mb-1">{isArabic ? 'النوع' : 'Type'}</p>
            <p className="text-white font-cairo">
              {getApplicationTypeLabel(application.hiringAndTraning, isArabic)}
            </p>
          </div>
          <div className="bg-primary-black/40 rounded-lg p-4 border border-gold/10">
            <p className="text-gray-400 mb-1">{isArabic ? 'السيرة الذاتية' : 'CV'}</p>
            {application.cvPath ? (
              <button
                type="button"
                onClick={async () => {
                  try {
                    await triggerDownloadWithName(application.cvPath, cvFileName)
                  } catch {
                    const fallbackLink = document.createElement('a')
                    fallbackLink.href = application.cvPath
                    fallbackLink.target = '_blank'
                    fallbackLink.rel = 'noreferrer'
                    fallbackLink.download = cvFileName
                    document.body.appendChild(fallbackLink)
                    fallbackLink.click()
                    fallbackLink.remove()
                  }
                }}
                className="inline-flex items-center gap-2 text-gold hover:text-gold-light font-cairo"
              >
                {isArabic ? 'تحميل CV' : 'Download CV'}
                <ExternalLink className="w-4 h-4" />
              </button>
            ) : (
              <p className="text-white font-cairo">-</p>
            )}
          </div>
        </div>

        <div className="mt-4 bg-primary-black/40 rounded-lg p-4 border border-gold/10">
          <p className="text-gray-400 mb-1">{isArabic ? 'الرسالة' : 'Message'}</p>
          <p className="text-white font-cairo whitespace-pre-wrap">{application.massegeApplication || '-'}</p>
        </div>
      </motion.div>
    </div>
  )
}
