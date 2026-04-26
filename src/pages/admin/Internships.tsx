import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable, { Column } from '@/components/admin/DataTable'
import { useLanguage } from '@/hooks/useLanguage'
import { useDeleteApplication, useGetAllApplications } from '@/hooks/applications'

type ApplicationTab = 'all' | 'job' | 'training'

const PAGE_SIZE = 10

type ApplicationRow = {
  id: string
  fullNmae: string
  email: string
  phoneNumber: string
  university: string
  gpa: string
  hiringAndTraning: 1 | 2
  cvPath: string
  massegeApplication: string
}

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

const buildCvFileName = (item: ApplicationRow) => {
  const safeName = sanitizeFileNamePart(item.fullNmae || item.email || 'application')
  const extension = getFileExtensionFromUrl(item.cvPath)
  return `${safeName || 'application-cv'}.${extension}`
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

export default function AdminInternships() {
  const { isArabic } = useLanguage()
  const navigate = useNavigate()

  const { data, isLoading, isFetching } = useGetAllApplications()
  const deleteApplicationMutation = useDeleteApplication()

  const [activeTab, setActiveTab] = useState<ApplicationTab>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const applications = data?.data || []

  const filteredApplications = useMemo(() => {
    if (activeTab === 'job') {
      return applications.filter((item) => item.hiringAndTraning === 1)
    }
    if (activeTab === 'training') {
      return applications.filter((item) => item.hiringAndTraning === 2)
    }
    return applications
  }, [activeTab, applications])

  const searchedApplications = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) {
      return filteredApplications
    }

    return filteredApplications.filter((item) => {
      const fullNmae = (item.fullNmae || '').toLowerCase()
      const email = (item.email || '').toLowerCase()
      const phoneNumber = (item.phoneNumber || '').toLowerCase()
      return fullNmae.includes(term) || email.includes(term) || phoneNumber.includes(term)
    })
  }, [filteredApplications, searchTerm])

  const totalPages = Math.max(1, Math.ceil(searchedApplications.length / PAGE_SIZE))

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, searchTerm])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const paginatedApplications = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return searchedApplications.slice(start, start + PAGE_SIZE)
  }, [currentPage, searchedApplications])

  const rows = useMemo<ApplicationRow[]>(
    () =>
      paginatedApplications.map((item) => ({
        id: item.id,
        fullNmae: item.fullNmae,
        email: item.email,
        phoneNumber: item.phoneNumber,
        university: item.university,
        gpa: item.gpa,
        hiringAndTraning: item.hiringAndTraning,
        cvPath: item.cvPath,
        massegeApplication: item.massegeApplication,
      })),
    [paginatedApplications]
  )

  const columns: Column<ApplicationRow>[] = [
    {
      key: 'fullNmae',
      labelAr: 'الاسم',
      labelEn: 'Name',
    },
    {
      key: 'email',
      labelAr: 'البريد',
      labelEn: 'Email',
    },
    {
      key: 'phoneNumber',
      labelAr: 'الهاتف',
      labelEn: 'Phone',
    },
    {
      key: 'university',
      labelAr: 'الجامعة',
      labelEn: 'University',
    },
    {
      key: 'gpa',
      labelAr: 'المعدل',
      labelEn: 'GPA',
      render: (value) => {
        const parsed = Number(value)
        if (!Number.isFinite(parsed)) {
          return '-'
        }
        return parsed.toFixed(2)
      },
    },
    {
      key: 'hiringAndTraning',
      labelAr: 'النوع',
      labelEn: 'Type',
      render: (value) => getApplicationTypeLabel(value as 1 | 2, isArabic),
    },
    {
      key: 'cvPath',
      labelAr: 'السيرة الذاتية',
      labelEn: 'CV',
      render: (value, item) => {
        const href = String(value || '').trim()
        if (!href) {
          return <span className="text-gray-500">-</span>
        }

        const fileName = buildCvFileName(item as ApplicationRow)

        return (
          <button
            type="button"
            onClick={async () => {
              try {
                await triggerDownloadWithName(href, fileName)
              } catch {
                const fallbackLink = document.createElement('a')
                fallbackLink.href = href
                fallbackLink.target = '_blank'
                fallbackLink.rel = 'noreferrer'
                fallbackLink.download = fileName
                document.body.appendChild(fallbackLink)
                fallbackLink.click()
                fallbackLink.remove()
              }
            }}
            className="text-gold hover:text-gold-light underline"
          >
            {isArabic ? 'تحميل CV' : 'Download CV'}
          </button>
        )
      },
    },
    {
      key: 'massegeApplication',
      labelAr: 'الرسالة',
      labelEn: 'Message',
      render: (value) => {
        const text = String(value || '')
        if (text.length <= 40) {
          return text || '-'
        }
        return `${text.slice(0, 40)}...`
      },
    },
  ]

  const handleDelete = async (row: ApplicationRow) => {
    await deleteApplicationMutation.mutateAsync(row.id)
  }

  return (
    <div dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-heading-1 font-cairo font-bold text-gradient">
          {isArabic ? 'إدارة طلبات التوظيف والتدريب' : 'Manage Applications'}
        </h1>
        <p className="text-gray-400 font-cairo text-sm mt-1">
          {isArabic
            ? `إجمالي الطلبات: ${searchedApplications.length}`
            : `Total applications: ${searchedApplications.length}`}
        </p>
      </motion.div>

      <div className="flex gap-4 mb-6 flex-row-reverse">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-5 py-2 rounded-lg font-cairo font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-gold text-primary-black'
              : 'bg-charcoal border border-gold/20 text-gold hover:border-gold'
          }`}
        >
          {isArabic ? 'الكل' : 'All'}
        </button>
        <button
          onClick={() => setActiveTab('job')}
          className={`px-5 py-2 rounded-lg font-cairo font-semibold transition-all ${
            activeTab === 'job'
              ? 'bg-gold text-primary-black'
              : 'bg-charcoal border border-gold/20 text-gold hover:border-gold'
          }`}
        >
          {isArabic ? 'وظائف' : 'Jobs'}
        </button>
        <button
          onClick={() => setActiveTab('training')}
          className={`px-5 py-2 rounded-lg font-cairo font-semibold transition-all ${
            activeTab === 'training'
              ? 'bg-gold text-primary-black'
              : 'bg-charcoal border border-gold/20 text-gold hover:border-gold'
          }`}
        >
          {isArabic ? 'تدريبات' : 'Trainings'}
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder={
            isArabic
              ? 'ابحث بالاسم أو البريد الإلكتروني أو الهاتف'
              : 'Search by name, email, or phone'
          }
          className="w-full md:w-96 px-4 py-3 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
        />
      </div>

      {(isLoading || isFetching) && (
        <div className="mb-4 text-gray-300 font-cairo text-sm text-right">
          {isArabic ? 'جاري تحميل الطلبات...' : 'Loading applications...'}
        </div>
      )}

      <DataTable
        columns={columns}
        data={rows}
        onView={(row) => navigate(`/admin/internships/${row.id}`)}
        onDelete={handleDelete}
        deleteTitleAr="حذف الطلب"
        deleteTitleEn="Delete Application"
        getDeleteLabel={(row) => row.fullNmae || row.email}
      />

      {searchedApplications.length > PAGE_SIZE && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-gray-400 font-cairo text-sm">
            {isArabic
              ? `الصفحة ${currentPage} من ${totalPages}`
              : `Page ${currentPage} of ${totalPages}`}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg font-cairo border border-gold/20 text-gold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isArabic ? 'السابق' : 'Previous'}
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg font-cairo border border-gold/20 text-gold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isArabic ? 'التالي' : 'Next'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
