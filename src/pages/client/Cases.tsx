import { motion } from 'framer-motion'
import { useLanguage } from '@/hooks/useLanguage'
import CaseCard from '@/components/ui/CaseCard'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetAllIssues, useGetIssueTypes } from '@/hooks/issues'

const resolveAttachmentPath = (filePath: string | undefined) => {
  if (!filePath) return ''
  if (filePath.startsWith('http')) return filePath
  const normalized = filePath.replace(/^\/?wwwroot\/?/i, '')
  return `https://lawm.runasp.net/${normalized}`
}

export default function ClientCases() {
  const { isArabic } = useLanguage()
  const navigate = useNavigate()

  const { data: issuesResponse, isLoading, isFetching } = useGetAllIssues()
  const { data: typesResponse } = useGetIssueTypes()

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const issues = issuesResponse?.data || []
  const issueTypes = typesResponse?.data || []

  const issueTypeMap = useMemo(() => {
    return new Map(
      issueTypes.map((type) => [
        type.id,
        isArabic ? type.nameAr || type.nameEn || 'غير محدد' : type.nameEn || type.nameAr || 'N/A',
      ])
    )
  }, [issueTypes, isArabic])

  const caseTypeOptions = useMemo(() => {
    return Array.from(new Set(issues.map((item) => issueTypeMap.get(item.issueTypeId) || 'غير محدد')))
  }, [issues, issueTypeMap])

  const filteredCases = useMemo(() => {
    return issues.filter((item) => {
      const caseTypeName = issueTypeMap.get(item.issueTypeId) || 'غير محدد'
      const matchesSearch = item.titeleAr.toLowerCase().includes(search.toLowerCase())
      const matchesFilter = filter === 'all' || caseTypeName === filter
      return matchesSearch && matchesFilter
    })
  }, [issues, issueTypeMap, search, filter])

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="space-y-8">
      <h1 className="text-heading-1 text-gradient font-cairo">{isArabic ? 'قضاياي' : 'My Cases'}</h1>

      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder={isArabic ? 'ابحث عن قضية...' : 'Search cases...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-charcoal border border-gold/20 rounded-lg px-4 py-3 text-white focus:border-gold outline-none"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-charcoal border border-gold/20 rounded-lg px-4 py-3 text-white focus:border-gold outline-none"
        >
          <option value="all">{isArabic ? 'كل الأنواع' : 'All Types'}</option>
          {caseTypeOptions.map((typeName) => (
            <option key={typeName} value={typeName}>
              {typeName}
            </option>
          ))}
        </select>
      </div>

      {(isLoading || isFetching) && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-charcoal animate-pulse rounded-xl border border-gold/10" />
          ))}
        </div>
      )}

      {!isLoading && (
        <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCases.length === 0 && (
            <div className="md:col-span-2 lg:col-span-3 rounded-xl border border-gold/20 bg-charcoal/40 px-6 py-10 text-center text-gray-300 font-cairo">
              {isArabic ? 'لا توجد قضايا حالياً' : 'No cases found'}
            </div>
          )}
          {filteredCases.map((caseItem) => (
            <motion.div key={caseItem.id} variants={item}>
              <CaseCard
                titleAr={caseItem.titeleAr}
                titleEn={caseItem.titeleEn || caseItem.titeleAr}
                descriptionAr={caseItem.defendant}
                descriptionEn={caseItem.defendant}
                typeAr={issueTypeMap.get(caseItem.issueTypeId) || 'غير محدد'}
                typeEn={issueTypeMap.get(caseItem.issueTypeId) || 'N/A'}
                yearAr={String(new Date().getFullYear())}
                yearEn={String(new Date().getFullYear())}
                image={resolveAttachmentPath(caseItem.attachments?.[0]?.filePath)}
                files={(caseItem.attachments || []).map((attachment, index) => ({
                  name: isArabic ? `مرفق ${index + 1}` : `Attachment ${index + 1}`,
                  url: resolveAttachmentPath(attachment.filePath),
                }))}
                onClick={() => navigate(`/case/${caseItem.id}`)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
