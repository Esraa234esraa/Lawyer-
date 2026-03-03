import { motion } from "framer-motion"
import { useLanguage } from "@/hooks/useLanguage"

interface CaseFile {
  name: string
  url: string
}

interface CaseCardProps {
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  typeAr: string
  typeEn: string
  yearAr: string
  yearEn: string
  image: string
  files?: CaseFile[]
  onClick?: () => void
}

export default function CaseCard({
  titleAr,
  titleEn,
  descriptionAr,
  descriptionEn,
  typeAr,
  typeEn,
  yearAr,
  yearEn,
  image,
  files = [],
  onClick,
}: CaseCardProps) {
  const { isArabic } = useLanguage()

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group bg-charcoal border border-gold/20 rounded-xl overflow-hidden hover:border-gold/50 hover:shadow-gold transition-all cursor-pointer"
      onClick={onClick}
      dir={isArabic ? "rtl" : "ltr"}   // 👈 مهم
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={isArabic ? titleAr : titleEn}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-black via-primary-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className={`p-6 ${isArabic ? "text-right" : "text-left"}`}>
        
        {/* Tags */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="text-xs bg-gold/20 text-gold px-3 py-1 rounded-full font-cairo">
            {isArabic ? yearAr : yearEn}
          </span>

          <span className="text-xs border border-gold/30 text-gold px-3 py-1 rounded-full font-cairo">
            {isArabic ? typeAr : typeEn}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-heading-3 font-cairo mb-3 text-gold">
          {isArabic ? titleAr : titleEn}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm font-cairo leading-relaxed line-clamp-3">
          {isArabic ? descriptionAr : descriptionEn}
        </p>

        {/* Files */}
        {files.length > 0 && (
          <div className="mt-5 pt-4 border-t border-gold/10 space-y-2">
            <p className="text-xs text-gold font-cairo">
              {isArabic ? "ملفات القضية" : "Case Files"}
            </p>

            {files.map((file, index) => (
              <a
                key={index}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-between text-sm text-gray-300 hover:text-gold transition-colors"
              >
                <span className="truncate">{file.name}</span>
                <span className="text-xs text-gold">
                  {isArabic ? "تحميل" : "Download"}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}