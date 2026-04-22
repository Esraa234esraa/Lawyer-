import { motion } from 'framer-motion'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import Button from '@/components/ui/Button'
import DataTable, { Column } from '@/components/admin/DataTable'
import { useGetAllIssues, useGetIssueTypes } from '@/hooks/issues'
import { Issue } from '@/types/issues'
import { toast } from 'sonner'

type CaseTypeRow = {
  id: string
  nameAr: string
  nameEn?: string
}

export default function CaseTypes() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const { data: issueTypesResponse, isLoading: isTypesLoading, isFetching: isTypesFetching } = useGetIssueTypes()
  const { data: issuesResponse, isLoading: isIssuesLoading } = useGetAllIssues()

  const caseTypes: CaseTypeRow[] = issueTypesResponse?.data || []
  const issues: Issue[] = issuesResponse?.data || []

  const getCasesForType = (typeId: string) => {
    return issues.filter((issue) => issue.issueTypeId === typeId)
  }

  const columns: Column<CaseTypeRow>[] = [
    {
      key: 'nameAr',
      labelAr: 'اسم النوع',
      labelEn: 'Type Name',
      render: (_value, item) => (
        <button
          type="button"
          onClick={() => setSelectedType(item.id)}
          className="font-cairo text-white hover:text-gold transition-colors"
        >
          {item.nameAr || item.nameEn || 'غير محدد'}
        </button>
      ),
    },
    {
      key: 'id',
      labelAr: 'عدد القضايا',
      labelEn: 'Cases Count',
      render: (_value, item) => (
        <button
          type="button"
          onClick={() => setSelectedType(item.id)}
          className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-gold/10 text-gold font-cairo text-sm hover:bg-gold/20 transition-colors"
        >
          {getCasesForType(item.id).length}
        </button>
      ),
    },
  ]

  const selectedTypeCases = selectedType ? getCasesForType(selectedType) : []

  const casesColumns: Column<Issue>[] = [
    {
      key: 'titeleAr',
      labelAr: 'عنوان القضية',
      labelEn: 'Case Title',
      render: (_value, item) => item.titeleAr,
    },
    {
      key: 'defendant',
      labelAr: 'المدعي عليه',
      labelEn: 'Defendant',
      render: (_value, item) => item.defendant,
    },
    {
      key: 'clients',
      labelAr: 'عدد العملاء',
      labelEn: 'Clients',
      render: (value) => (
        <span className="px-3 py-1 rounded-full text-sm font-cairo bg-gold/10 text-gold">
          {Array.isArray(value) ? value.length : 0}
        </span>
      ),
    },
    {
      key: 'attachments',
      labelAr: 'عدد المرفقات',
      labelEn: 'Attachments',
      render: (value) => (
        <span className="px-3 py-1 rounded-full text-sm font-cairo bg-blue-500/10 text-blue-300">
          {Array.isArray(value) ? value.length : 0}
        </span>
      ),
    },
  ]

  return (
    <div dir="rtl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4 mb-8"
      >
        <div>
          <h1 className="text-heading-1 font-cairo font-bold text-gradient">
            إدارة أنواع القضايا
          </h1>
          <p className="text-gray-400 font-cairo text-sm">
            إجمالي الأنواع: {caseTypes.length}
          </p>
          {(isTypesLoading || isIssuesLoading || isTypesFetching) && (
            <p className="text-gray-500 font-cairo text-xs mt-1">جاري تحميل البيانات...</p>
          )}
        </div>
        <Button
          onClick={() => toast.info('إضافة أنواع القضايا غير متاحة حالياً من الواجهة الخلفية')}
          variant="primary"
          size="lg"
          className="font-cairo flex-row-reverse ms-auto"
        >
          <Plus size={20} className="me-2" />
          إضافة نوع
        </Button>
      </motion.div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Types Table */}
        <div className="lg:col-span-1">
          <DataTable
            columns={columns}
            data={caseTypes}
            onView={(caseType) => setSelectedType(caseType.id)}
            actions={false}
          />
        </div>

        {/* Cases for Selected Type */}
        {selectedType && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedType(null)}
                  className="text-gold hover:text-gold-light transition-colors font-cairo text-sm"
                >
                  ← رجوع
                </button>
                <h2 className="text-heading-2 font-cairo font-bold text-gradient">
                  {caseTypes.find((t) => t.id === selectedType)?.nameAr ||
                    caseTypes.find((t) => t.id === selectedType)?.nameEn ||
                    'غير محدد'}
                </h2>
              </div>
              <p className="text-gray-400 font-cairo text-sm mt-2">
                عدد القضايا: {selectedTypeCases.length}
              </p>
            </div>
            
            {selectedTypeCases.length > 0 ? (
              <DataTable
                columns={casesColumns}
                data={selectedTypeCases}
                actions={false}
              />
            ) : (
              <div className="border border-gold/20 rounded-lg p-8 text-center">
                <p className="text-gray-400 font-cairo">
                  لا توجد قضايا من هذا النوع حالياً
                </p>
              </div>
            )}
          </motion.div>
        )}

        {!selectedType && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="border-2 border-dashed border-gold/20 rounded-lg p-12 text-center">
              <p className="text-gray-400 font-cairo text-lg">
                اختر نوع القضية لعرض القضايا المرتبطة بها
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
