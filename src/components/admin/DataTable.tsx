import { motion } from 'framer-motion'
import { useState } from 'react'
import { Trash2, Edit2, Eye } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal'

export interface Column<T> {
  key: keyof T
  labelAr: string
  labelEn: string
  render?: (value: any, item: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  onView?: (item: T) => void
  onSubmit?: (items: T) => void
  actions?: boolean
  deleteTitleAr?: string
  deleteTitleEn?: string
  getDeleteLabel?: (item: T) => string
}

export default function DataTable<T extends { id: number | string }>({
  columns,
  data,
  onEdit,
  onDelete,
  onView,
  onSubmit,
  actions = true,
  deleteTitleAr,
  deleteTitleEn,
  getDeleteLabel,
}: DataTableProps<T>) {
  const { isArabic } = useLanguage()
  const [itemToDelete, setItemToDelete] = useState<T | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const resolveDeleteLabel = (item: T) => {
    if (getDeleteLabel) return getDeleteLabel(item)

    const record = item as Record<string, unknown>
    const candidateKeys = ['titleAr', 'titleEn', 'nameAr', 'nameEn', 'name', 'email', 'service']

    for (const key of candidateKeys) {
      const value = record[key]
      if (typeof value === 'string' && value.trim()) {
        return value
      }
    }

    return String(record.id)
  }

  const handleDeleteConfirm = async () => {
    if (!itemToDelete || !onDelete) return

    setIsDeleting(true)
    try {
      await Promise.resolve(onDelete(itemToDelete))
      setItemToDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="border border-gold/20 rounded-lg overflow-hidden max-w-full"
      dir="rtl"
    >
      <div className="w-full overflow-x-auto">
        <table className="min-w-full text-right">
          <thead className="bg-primary-black border-b border-gold/20">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-6 py-4 text-sm font-cairo font-semibold text-gold text-right whitespace-nowrap"
                >
                  {isArabic ? column.labelAr : column.labelEn}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-4 text-sm font-cairo font-semibold text-gold text-right whitespace-nowrap">
                  {isArabic ? 'الإجراءات' : 'Actions'}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-6 py-8 text-center text-gray-400 font-cairo"
                >
                  {isArabic ? 'لا توجد بيانات' : 'No data available'}
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="border-b border-gold/10 hover:bg-charcoal/50 transition-colors"
                >
                  {columns.map((column) => {
                    const value = (item as any)[column.key];
                    let displayValue;
                    if (column.render) {
                      displayValue = column.render(value, item);
                    } else if (value === null || value === undefined) {
                      displayValue = '—';
                    } else if (typeof value === 'object') {
                      displayValue = Array.isArray(value) ? (value.length ? `${value.length} عنصر` : '—') : '—';
                    } else {
                      displayValue = String(value);
                    }
                    return (
                      <td
                        key={String(column.key)}
                        className="px-6 py-4 text-sm text-gray-300 font-cairo text-right whitespace-nowrap"
                      >
                        {displayValue}
                      </td>
                    );
                  })}
                  {actions && (
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center gap-2 justify-end">

                        {onSubmit &&
                          (item as any).status === 'new' &&
                          (item as any).paymentStatus === 'paid' && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onSubmit(item)}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs"
                            >
                              تأكيد
                            </motion.button>
                          )}

                        {onView && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onView(item)}
                            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"
                          >
                            <Eye size={16} />
                          </motion.button>
                        )}

                        {onEdit && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onEdit(item)}
                            className="p-2 bg-gold/20 text-gold rounded-lg"
                          >
                            <Edit2 size={16} />
                          </motion.button>
                        )}

                        {onDelete && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setItemToDelete(item)}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        )}

                      </div>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmModal
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteConfirm}
        itemLabel={itemToDelete ? resolveDeleteLabel(itemToDelete) : undefined}
        titleAr={deleteTitleAr}
        titleEn={deleteTitleEn}
        isLoading={isDeleting}
      />
    </motion.div>
  )
}