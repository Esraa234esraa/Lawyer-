import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import DataTable, { Column } from '@/components/admin/DataTable'

interface AccountStat {
  title: string
  paid: number
  total: number
  color: string
  key: string
}

interface AccountDetail {
  id: number
  name: string
  amount: number
  status: string
}

export default function AccountSummaryPage() {
  const [accounts, setAccounts] = useState<AccountStat[]>([])
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [accountDetails, setAccountDetails] = useState<AccountDetail[]>([])

  useEffect(() => {
    const data: AccountStat[] = [
      { title: 'غير مدفوعة', paid: 0, total: 5, color: 'bg-red-900 border-red-700', key: 'unpaid' },
      { title: 'مدفوعة', paid: 10, total: 10, color: 'bg-green-900 border-green-700', key: 'paid' },
      { title: 'متأخرة', paid: 2, total: 3, color: 'bg-yellow-900 border-yellow-700', key: 'late' },
      { title: 'مدفوعة جزئياً', paid: 3, total: 5, color: 'bg-blue-900 border-blue-700', key: 'partial' },
    ]
    setAccounts(data)
  }, [])

  const allDetails: Record<string, AccountDetail[]> = {
    unpaid: [
      { id: 1, name: 'فاتورة 1', amount: 200, status: 'غير مدفوعة' },
      { id: 2, name: 'فاتورة 2', amount: 150, status: 'غير مدفوعة' },
    ],
    paid: [
      { id: 3, name: 'فاتورة 3', amount: 300, status: 'مدفوعة' },
    ],
    late: [
      { id: 4, name: 'فاتورة 4', amount: 400, status: 'متأخرة' },
    ],
    partial: [
      { id: 5, name: 'فاتورة 5', amount: 250, status: 'مدفوعة جزئياً' },
    ],
  }

  const columns: Column<AccountDetail>[] = [
    { key: 'id', labelAr: 'الرقم', labelEn: 'ID' },
    { key: 'name', labelAr: 'اسم الفاتورة', labelEn: 'Invoice Name' },
    { key: 'amount', labelAr: 'المبلغ', labelEn: 'Amount' },
    { key: 'status', labelAr: 'الحالة', labelEn: 'Status' },
  ]

  const toggleCard = (key: string) => {
    if (expandedCard === key) {
      setExpandedCard(null)
      setAccountDetails([])
    } else {
      setExpandedCard(key)
      setAccountDetails(allDetails[key] || [])
    }
  }

  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
  }

  return (
    <div className="p-6 h-screen bg-charcoal font-cairo">
      <h1 className="text-2xl font-bold text-gold mb-6">كشف الحساب</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {accounts.map((acc, idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ delay: idx * 0.1 }}
            className={`p-6 rounded-2xl border ${acc.color} text-white flex flex-col items-center justify-center shadow-lg cursor-pointer`}
            onClick={() => toggleCard(acc.key)}
          >
            <p className="text-3xl font-bold">{acc.paid}/{acc.total}</p>
            <p className="mt-2 text-sm">{acc.title}</p>
          </motion.div>
        ))}
      </div>

      {expandedCard && (
        <div className="mt-8">
          <DataTable columns={columns} data={accountDetails} actions={false} />
        </div>
      )}
    </div>
  )
}