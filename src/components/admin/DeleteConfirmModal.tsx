import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import Modal from '@/components/admin/Modal'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  itemLabel?: string
  titleAr?: string
  titleEn?: string
  isLoading?: boolean
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  itemLabel,
  titleAr,
  titleEn,
  isLoading = false,
}: DeleteConfirmModalProps) {
  const { isArabic } = useLanguage()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={titleEn || 'Delete Item'}
      titleAr={titleAr || 'تأكيد الحذف'}
    >
      <div className="space-y-5 text-right" dir="rtl">
        <div className="flex items-start gap-3 flex-row-reverse p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <AlertTriangle size={20} className="text-red-400 mt-0.5" />
          <div>
            <p className="text-white font-cairo font-semibold">
              {isArabic ? 'هل أنت متأكد من حذف هذا العنصر؟' : 'Are you sure you want to delete this item?'}
            </p>
            <p className="text-gray-300 text-sm font-cairo mt-1">
              {isArabic ? 'لا يمكن التراجع عن هذا الإجراء.' : 'This action cannot be undone.'}
            </p>
          </div>
        </div>

        {itemLabel && (
          <div className="p-3 rounded-lg bg-primary-black border border-gold/20">
            <p className="text-xs text-gray-400 font-cairo mb-1">
              {isArabic ? 'العنصر المحدد للحذف' : 'Selected item to delete'}
            </p>
            <p className="text-gold font-cairo text-sm break-words">{itemLabel}</p>
          </div>
        )}

        <div className="flex items-center gap-3 justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gold/20 text-gray-200 font-cairo"
          >
            {isArabic ? 'إلغاء' : 'Cancel'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-70 text-white font-cairo"
          >
            {isLoading ? (isArabic ? 'جارٍ الحذف...' : 'Deleting...') : isArabic ? 'تأكيد الحذف' : 'Confirm Delete'}
          </motion.button>
        </div>
      </div>
    </Modal>
  )
}
