import { motion } from 'framer-motion'
import { useLanguage } from '@/hooks/useLanguage'
import { formatDate } from '@/utils/data'

interface NewsCardProps {
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  date: string
  categoryAr: string
  categoryEn: string
  image: string
  authorAr: string
  authorEn: string
  onClick?: () => void
}

export default function NewsCard({
  titleAr,
  titleEn,
  descriptionAr,
  descriptionEn,
  date,
  categoryAr,
  categoryEn,
  image,
  authorAr,
  authorEn,
  onClick,
}: NewsCardProps) {
  const { isArabic } = useLanguage()

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-charcoal border border-gold/20 rounded-lg overflow-hidden hover:border-gold/50 transition-all cursor-pointer"
      onClick={onClick}
      dir="rtl"
    >
      <div className="relative h-48 overflow-hidden">
        <img src={image} alt={isArabic ? titleAr : titleEn} className="w-full h-full object-cover" />
      </div>
      <div className="p-6 text-right">
        <div className="flex items-center justify-end gap-3 mb-3">
          <span className="text-xs text-gold font-cairo">{formatDate(date)}</span>
          <span className="text-xs bg-gold/20 text-gold px-3 py-1 rounded-full font-cairo">
            {isArabic ? categoryAr : categoryEn}
          </span>
        </div>
        <h3 className="text-heading-3 font-cairo mb-2">{isArabic ? titleAr : titleEn}</h3>
        <p className="text-gray-400 text-sm font-cairo mb-3">{isArabic ? descriptionAr : descriptionEn}</p>
        <p className="text-gold text-sm font-cairo">{isArabic ? authorAr : authorEn}</p>
      </div>
    </motion.div>
  )
}