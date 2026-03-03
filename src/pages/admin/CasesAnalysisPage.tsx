import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import DataTable, { Column } from '@/components/admin/DataTable'

interface CaseStat {
  title: string
  completed: number
  total: number
  color: string
  key: string
}

interface CaseDetail {
  id: number
  name: string
  assignedTo: string
  status: string
}

export default function CasesAnalysisPage() {
  const [cases, setCases] = useState<CaseStat[]>([])
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [caseDetails, setCaseDetails] = useState<CaseDetail[]>([])

  useEffect(() => {
    const data: CaseStat[] = [
      { title: 'لم يبدأ', completed: 0, total: 5, color: 'bg-gray-800 border-gray-700', key: 'notStarted' },
      { title: 'جاري العمل', completed: 6, total: 12, color: 'bg-blue-900 border-blue-700', key: 'inProgress' },
      { title: 'قضية مهمة', completed: 1, total: 3, color: 'bg-red-900 border-red-700', key: 'important' },
      { title: 'مغلقة', completed: 7, total: 7, color: 'bg-green-900 border-green-700', key: 'closed' },
      { title: 'منتهية', completed: 10, total: 10, color: 'bg-yellow-900 border-yellow-700', key: 'finished' },
    ]
    setCases(data)
  }, [])

  const allDetails: Record<string, CaseDetail[]> = {
    notStarted: [
      { id: 1, name: 'قضية 1', assignedTo: 'أحمد', status: 'لم يبدأ' },
      { id: 2, name: 'قضية 2', assignedTo: 'سارة', status: 'لم يبدأ' },
    ],
    inProgress: [
      { id: 3, name: 'قضية 3', assignedTo: 'محمد', status: 'جاري العمل' },
    ],
    important: [
      { id: 4, name: 'قضية 4', assignedTo: 'ليلى', status: 'قضية مهمة' },
    ],
    closed: [
      { id: 5, name: 'قضية 5', assignedTo: 'كريم', status: 'مغلقة' },
    ],
    finished: [
      { id: 6, name: 'قضية 6', assignedTo: 'منى', status: 'منتهية' },
    ],
  }

  const columns: Column<CaseDetail>[] = [
    { key: 'id', labelAr: 'الرقم', labelEn: 'ID' },
    { key: 'name', labelAr: 'اسم القضية', labelEn: 'Case Name' },
    { key: 'assignedTo', labelAr: 'المسؤول', labelEn: 'Assigned To' },
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
    exit: { opacity: 0, y: -20, scale: 0.95 },
  }

  return (
    <div className="p-6 h-screen bg-charcoal font-cairo">
      <h1 className="text-2xl font-bold text-gold mb-6">تحليل القضايا</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cases.map((c, idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ delay: idx * 0.1 }}
            className={`p-6 rounded-2xl border ${c.color} text-white flex flex-col items-center justify-center shadow-lg cursor-pointer`}
            onClick={() => toggleCard(c.key)}
          >
            <p className="text-3xl font-bold">{c.completed}/{c.total}</p>
            <p className="mt-2 text-sm">{c.title}</p>
          </motion.div>
        ))}
      </div>

      {expandedCard && (
        <div className="mt-8">
          <DataTable columns={columns} data={caseDetails} actions={false}/>
        </div>
      )}
    </div>
  )
}