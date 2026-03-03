import { motion } from 'framer-motion'
import { Trash2, Edit2, Eye } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

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
}

export default function DataTable<T extends { id: number | string }>({
  columns,
  data,
  onEdit,
  onDelete,
  onView,
  onSubmit,
  actions = true,
}: DataTableProps<T>) {
  const { isArabic } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="overflow-x-auto border border-gold/20 rounded-lg"
      dir="rtl"
    >
      <table className="w-full text-right">
        <thead className="bg-primary-black border-b border-gold/20">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="px-6 py-4 text-sm font-cairo font-semibold text-gold text-right"
              >
                {isArabic ? column.labelAr : column.labelEn}
              </th>
            ))}
            {actions && (
              <th className="px-6 py-4 text-sm font-cairo font-semibold text-gold text-right">
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
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="px-6 py-4 text-sm text-gray-300 font-cairo text-right"
                  >
                    {column.render
                      ? column.render((item as any)[column.key], item)
                      : String((item as any)[column.key])}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center gap-2 justify-end">

                      {/* زر مخصص */}
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
                          onClick={() => onDelete(item)}
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
    </motion.div>
  )
}