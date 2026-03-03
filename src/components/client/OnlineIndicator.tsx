import { motion } from 'framer-motion'
import { useLanguage } from '@/hooks/useLanguage'

export default function OnlineIndicator() {
  const { isArabic } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center gap-2 text-sm font-cairo text-green-400 mb-6"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-3 h-3 bg-green-400 rounded-full"
      />
      {isArabic ? 'متصل الآن' : 'Online Now'}
    </motion.div>
  )
}