import { motion } from 'framer-motion'
import { useLanguage } from '@/hooks/useLanguage'

interface ServiceCardProps {
  titleAr: string
  titleEn: string
  priceAr: string
  priceEn: string
  descriptionAr: string
  descriptionEn: string
  icon: string
  features?: string[]
  onClick?: () => void
}

export default function ServiceCard({
  titleAr,
  titleEn,
  descriptionAr,
  descriptionEn,
  priceAr,
  priceEn,
  icon,
  features,
  onClick,
}: ServiceCardProps) {
  const { isArabic } = useLanguage()

  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(198, 167, 94, 0.2)' }}
      className="p-8 bg-charcoal border border-gold/20 rounded-lg hover:border-gold/50 transition-all cursor-pointer text-right group"
      onClick={onClick}
      dir="rtl"
    >
      <div className="text-5xl mb-4 flex justify-end">{icon}</div>
      <h3 className="text-heading-3 font-cairo mb-3 group-hover:text-gold transition-colors">
        {isArabic ? titleAr : titleEn}
      </h3>
      <div className="inline-block bg-gold/10 text-gold px-4 py-1 rounded-full text-sm font-semibold mb-3">
        {isArabic ? priceAr : priceEn}
      </div>
      <p className="text-gray-400 font-cairo mb-4">
        {isArabic ? descriptionAr : descriptionEn}
      </p>
      {features && (
        <ul className="space-y-2">
          {features.map((feature, idx) => (
            <li key={idx} className="text-sm text-gold/70 font-cairo flex items-center gap-2 justify-end">
              <span>{feature}</span>
              <span>✓</span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  )
}