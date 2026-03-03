import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  titleAr: string
  children: React.ReactNode
}

export default function Modal({
  isOpen,
  onClose,
  title,
  titleAr,
  children,
}: ModalProps) {
  const { isArabic } = useLanguage()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="bg-charcoal border-2 border-gold/30 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              dir="rtl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gold/20">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="text-gray-400 hover:text-gold transition-colors"
                >
                  <X size={24} />
                </motion.button>
                <h2 className="text-heading-3 font-cairo font-bold text-gold flex-1 text-right">
                  {isArabic ? titleAr : title}
                </h2>
              </div>

              {/* Content */}
              <div className="p-6">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}