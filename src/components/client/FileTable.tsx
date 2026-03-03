import { motion } from 'framer-motion'
import { Download, Trash2 } from 'lucide-react'
import StatusBadge from '@/components/admin/StatusBadge'
import { useLanguage } from '@/hooks/useLanguage'
import { useClientStore } from '@/store/clientStore'
import { toast } from 'sonner'

export default function FilesTable() {
  const { isArabic } = useLanguage()
  const { caseFiles, deleteFile } = useClientStore()

  const handleDelete = (id: number) => {
    if (confirm(isArabic ? 'هل تريد حذف هذا الملف؟' : 'Are you sure?')) {
      deleteFile(id)
      toast.success(isArabic ? 'تم حذف الملف' : 'File deleted')
    }
  }

  const handleDownload = (fileName: string) => {
    toast.success(
      isArabic ? `تم تحميل ${fileName}` : `Downloaded ${fileName}`
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="p-6 bg-charcoal border border-gold/20 rounded-lg"
      dir="rtl"
    >
      <h2 className="text-heading-2 font-cairo font-bold text-gold mb-2">
        {isArabic ? 'الملفات السابقة' : 'Previous Files'}
      </h2>
      <p className="text-gray-400 font-cairo text-sm mb-6">
        {isArabic
          ? `إجمالي الملفات: ${caseFiles.length}`
          : `Total Files: ${caseFiles.length}`}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-primary-black border-b border-gold/20">
            <tr>
              <th className="px-6 py-4 text-sm font-cairo font-semibold text-gold text-right">
                {isArabic ? 'اسم الملف' : 'File Name'}
              </th>
              <th className="px-6 py-4 text-sm font-cairo font-semibold text-gold text-right">
                {isArabic ? 'النوع' : 'Type'}
              </th>
              <th className="px-6 py-4 text-sm font-cairo font-semibold text-gold text-right">
                {isArabic ? 'الحجم' : 'Size'}
              </th>
              <th className="px-6 py-4 text-sm font-cairo font-semibold text-gold text-right">
                {isArabic ? 'التاريخ' : 'Date'}
              </th>
              <th className="px-6 py-4 text-sm font-cairo font-semibold text-gold text-right">
                {isArabic ? 'الحالة' : 'Status'}
              </th>
              <th className="px-6 py-4 text-sm font-cairo font-semibold text-gold text-right">
                {isArabic ? 'الإجراءات' : 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody>
            {caseFiles.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-gray-400 font-cairo"
                >
                  {isArabic ? 'لا توجد ملفات' : 'No files available'}
                </td>
              </tr>
            ) : (
              caseFiles.map((file, idx) => (
                <motion.tr
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="border-b border-gold/10 hover:bg-primary-black/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-300 font-cairo text-right">
                    {isArabic ? file.nameAr : file.nameEn}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300 font-cairo text-right">
                    <span className="px-2 py-1 bg-gold/10 text-gold rounded text-xs font-semibold">
                      {file.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300 font-cairo text-right">
                    {file.size}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300 font-cairo text-right">
                    {new Date(file.uploadedAt).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <StatusBadge status={file.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDownload(file.nameAr)}
                        className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                        title={isArabic ? 'تحميل' : 'Download'}
                      >
                        <Download size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(file.id)}
                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                        title={isArabic ? 'حذف' : 'Delete'}
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}