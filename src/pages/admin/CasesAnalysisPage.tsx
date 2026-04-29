import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import DataTable, { Column } from '@/components/admin/DataTable'
import { Case, useAdminStore } from '@/store/adminStore'

interface CaseStat {
  title: string
  count: number
  total: number
  color: string
  key: string
}

type CaseDetail = {
  id: number
  name: string
  assignedTo: string
  status: string
  priority: string
}

export default function CasesSummaryPage() {
  const { cases } = useAdminStore()

  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [caseDetails, setCaseDetails] = useState<CaseDetail[]>([])

  const notStarted = cases.filter(c => c.statusAr === 'لم تبدأ')
  const inProgress = cases.filter(c => c.statusAr === 'قيد العمل')
  const urgent = cases.filter(c => c.statusAr === 'عاجلة')
  const closed = cases.filter(c => c.statusAr === 'مغلقة')
  const finished = cases.filter(c => c.statusAr === 'منتهية')
const mapCase = (c: Case): CaseDetail => ({
  id: c.id,
  name: c.titleAr,
  assignedTo: c.plaintiffAr || 'غير محدد',
  status: c.statusAr,
  priority:
    c.statusAr === 'عاجلة'
      ? 'حرجة'
      : c.statusAr === 'قيد العمل'
      ? 'متوسطة'
      : 'عادية',
})
  const stats: CaseStat[] = useMemo(() => [
    {
      title: 'لم تبدأ',
      count: notStarted.length,
      total: cases.length,
      color: 'bg-gray-900 border-gray-700',
      key: 'notStarted',
    },
    {
      title: 'قيد العمل',
      count: inProgress.length,
      total: cases.length,
      color: 'bg-blue-900 border-blue-700',
      key: 'inProgress',
    },
    {
      title: 'عاجلة',
      count: urgent.length,
      total: cases.length,
      color: 'bg-red-900 border-red-700',
      key: 'urgent',
    },
    {
      title: 'مغلقة',
      count: closed.length,
      total: cases.length,
      color: 'bg-purple-900 border-purple-700',
      key: 'closed',
    },
    {
      title: 'منتهية',
      count: finished.length,
      total: cases.length,
      color: 'bg-green-900 border-green-700',
      key: 'finished',
    },
  ], [cases])

  const allDetails: Record<string, CaseDetail[]> = {
  notStarted: notStarted.map(mapCase),
  inProgress: inProgress.map(mapCase),
  urgent: urgent.map(mapCase),
  closed: closed.map(mapCase),
  finished: finished.map(mapCase),
}

  const columns: Column<CaseDetail>[] = [
    { key: 'id', labelAr: 'الرقم', labelEn: 'ID' },
    { key: 'name', labelAr: 'اسم القضية', labelEn: 'Case Name' },
    { key: 'assignedTo', labelAr: 'المسؤول', labelEn: 'Assigned To' },
    { key: 'priority', labelAr: 'الأولوية', labelEn: 'Priority' },
    { key: 'status', labelAr: 'الحالة', labelEn: 'Status' },
  ]

  const toggleCard = (key: string) => {
    if (expandedCard === key) {
      setExpandedCard(null)
      setCaseDetails([])
    } else {
      setExpandedCard(key)
      setCaseDetails(allDetails[key] || [])
    }
  }

  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
  }

  return (
    <div className="p-6 bg-charcoal font-cairo min-h-screen">

      <h1 className="text-2xl font-bold text-gold mb-6">
        ملخص القضايا
      </h1>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((item, idx) => (
          <motion.div
            key={item.key}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: idx * 0.1 }}
            onClick={() => toggleCard(item.key)}
            className={`p-6 rounded-2xl border ${item.color} text-white flex flex-col items-center justify-center cursor-pointer`}
          >
            <p className="text-3xl font-bold">
              {item.count}/{item.total}
            </p>
            <p className="mt-2 text-sm">{item.title}</p>
          </motion.div>
        ))}
      </div>

      {/* DETAILS */}
      {expandedCard && (
        <div className="mt-8">
          <DataTable
            columns={columns}
            data={caseDetails}
            actions={false}
          />
        </div>
      )}

    </div>
  )
}