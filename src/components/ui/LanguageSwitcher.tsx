import { motion } from 'framer-motion'
import { useLanguage } from '@/hooks/useLanguage'

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLanguage}
      className="px-3 py-2 bg-gold/20 text-gold rounded-lg hover:bg-gold/30 text-sm font-semibold transition-all"
    >
      {language === 'ar' ? 'EN' : 'AR'}
    </motion.button>
  )
}