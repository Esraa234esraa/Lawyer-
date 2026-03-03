import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '@/hooks/useLanguage'

interface AccordionItemProps {
  questionAr: string
  questionEn: string
  answerAr: string
  answerEn: string
}

export default function AccordionItem({ questionAr, questionEn, answerAr, answerEn }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { isArabic } = useLanguage()

  return (
    <div className="border border-gold/20 rounded-lg overflow-hidden" dir="rtl">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-charcoal hover:bg-charcoal/80 transition-colors text-right"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={20} className="text-gold" />
        </motion.div>
        <h3 className="font-cairo font-semibold text-white flex-1 text-right pe-4">
          {isArabic ? questionAr : questionEn}
        </h3>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-primary-black/50"
          >
            <div className="px-6 py-4 text-gray-300 font-cairo text-right">
              {isArabic ? answerAr : answerEn}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}