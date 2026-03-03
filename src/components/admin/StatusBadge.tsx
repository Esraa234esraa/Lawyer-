import { useLanguage } from '@/hooks/useLanguage'

interface StatusBadgeProps {
  status: string
  type?: 'default' | 'success' | 'warning' | 'danger'
}

export default function StatusBadge({
  status,
  // type = 'default',
}: StatusBadgeProps) {
  const { isArabic } = useLanguage()

  const statusTranslations: Record<string, { ar: string; en: string }> = {
    active: { ar: 'نشط', en: 'Active' },
    inactive: { ar: 'غير نشط', en: 'Inactive' },
    completed: { ar: 'مكتمل', en: 'Completed' },
    pending: { ar: 'قيد الانتظار', en: 'Pending' },
    accepted: { ar: 'مقبول', en: 'Accepted' },
    rejected: { ar: 'مرفوض', en: 'Rejected' },
  }

  const statusColors: Record<string, string> = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    accepted: 'bg-green-500/20 text-green-400 border-green-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
  }

  const label = statusTranslations[status]
    ? isArabic
      ? statusTranslations[status].ar
      : statusTranslations[status].en
    : status

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-cairo font-semibold border ${
        statusColors[status] || 'bg-gold/20 text-gold border-gold/30'
      }`}
    >
      {label}
    </span>
  )
}