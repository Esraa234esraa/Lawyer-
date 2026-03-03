import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

interface TestimonialCardProps {
  nameAr: string
  nameEn: string
  positionAr: string
  positionEn: string
  testimonialAr: string
  testimonialEn: string
  rating: number
  image: string
}

export default function TestimonialCard({
  nameAr,
  nameEn,
  positionAr,
  positionEn,
  testimonialAr,
  testimonialEn,
  rating,
  image,
}: TestimonialCardProps) {
  const { isArabic } = useLanguage()

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="p-8 bg-charcoal border border-gold/20 rounded-lg text-right"
      dir="rtl"
    >
      {/* Stars */}
      <div className="flex justify-end gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} size={16} className="fill-gold text-gold" />
        ))}
      </div>

      {/* Testimonial */}
      <p className="text-gray-300 font-cairo mb-6 italic">"{isArabic ? testimonialAr : testimonialEn}"</p>

      {/* Author */}
      <div className="flex items-center gap-4 flex-row-reverse">
        <img src={image} alt={isArabic ? nameAr : nameEn} className="w-12 h-12 rounded-full border-2 border-gold" />
        <div className="text-right">
          <h4 className="font-cairo font-semibold text-gold">{isArabic ? nameAr : nameEn}</h4>
          <p className="text-sm text-gray-400 font-cairo">{isArabic ? positionAr : positionEn}</p>
        </div>
      </div>
    </motion.div>
  )
}