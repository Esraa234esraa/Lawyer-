import { motion } from 'framer-motion'
import { useLanguage } from '@/hooks/useLanguage'
import { Linkedin, Mail, Phone } from 'lucide-react'

interface TeamCardProps {
  nameAr: string
  nameEn: string
  positionAr: string
  positionEn: string
  bio: string
  bioEn: string
  image: string
  specialties: string[]
  email?: string
  phone?: string
}

export default function TeamCard({
  nameAr,
  nameEn,
  positionAr,
  positionEn,
  bio,
  bioEn,
  image,
  specialties,
  email,
  phone,
}: TeamCardProps) {
  const { isArabic } = useLanguage()

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-charcoal border border-gold/20 rounded-lg overflow-hidden hover:border-gold/50 transition-all text-right"
      dir="rtl"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img src={image} alt={isArabic ? nameAr : nameEn} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-black via-transparent to-transparent" />
      </div>

      {/* Info */}
      <div className="p-6">
        <h3 className="text-heading-3 font-cairo text-gold mb-1">{isArabic ? nameAr : nameEn}</h3>
        <p className="text-sm text-gold/70 font-cairo mb-3">{isArabic ? positionAr : positionEn}</p>
        <p className="text-gray-400 text-sm font-cairo mb-4">{isArabic ? bio : bioEn}</p>

        {/* Specialties */}
        <div className="mb-4">
          {specialties.map((specialty, idx) => (
            <span key={idx} className="inline-block text-xs bg-gold/10 text-gold px-2 py-1 rounded mb-2 ms-2 font-cairo">
              {specialty}
            </span>
          ))}
        </div>

        {/* Contact */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gold/20">
          {email && (
            <motion.a
              href={`mailto:${email}`}
              whileHover={{ scale: 1.1 }}
              className="text-gold hover:text-gold-light transition-colors"
            >
              <Mail size={18} />
            </motion.a>
          )}
          {phone && (
            <motion.a
              href={`tel:${phone}`}
              whileHover={{ scale: 1.1 }}
              className="text-gold hover:text-gold-light transition-colors"
            >
              <Phone size={18} />
            </motion.a>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="text-gold hover:text-gold-light transition-colors"
          >
            <Linkedin size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}