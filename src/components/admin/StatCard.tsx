import { motion } from 'framer-motion'
import { useLanguage } from '@/hooks/useLanguage'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  titleAr: string
  titleEn: string
  value: string | number
  subtext?: string
  icon?: React.ReactNode
  trend?: number
  color?: 'gold' | 'blue' | 'green' | 'red'
}

export default function StatCard({
  titleAr,
  titleEn,
  value,
  subtext,
  icon,
  trend,
  color = 'gold',
}: StatCardProps) {
  const { isArabic } = useLanguage()

  const colorClasses: Record<string, string> = {
    gold: 'from-gold/10 to-gold/5 border-gold/20',
    blue: 'from-blue-500/10 to-blue-500/5 border-blue-500/20',
    green: 'from-green-500/10 to-green-500/5 border-green-500/20',
    red: 'from-red-500/10 to-red-500/5 border-red-500/20',
  }

  const iconColors: Record<string, string> = {
    gold: 'text-gold',
    blue: 'text-blue-400',
    green: 'text-green-400',
    red: 'text-red-400',
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`p-6 bg-gradient-to-br ${colorClasses[color]} border rounded-lg`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 text-right">
          <p className="text-gray-400 text-sm font-cairo mb-2">
            {isArabic ? titleAr : titleEn}
          </p>
          <h3 className="text-heading-2 font-cairo font-bold text-white mb-2">
            {value}
          </h3>
          {subtext && (
            <p className="text-xs text-gray-500 font-cairo">{subtext}</p>
          )}
        </div>
        {icon && <div className={`text-3xl ${iconColors[color]}`}>{icon}</div>}
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-2 justify-end">
          {trend > 0 ? (
            <>
              <TrendingUp size={16} className="text-green-400" />
              <span className="text-green-400 text-sm font-cairo">
                +{trend}%
              </span>
            </>
          ) : (
            <>
              <TrendingDown size={16} className="text-red-400" />
              <span className="text-red-400 text-sm font-cairo">
                {trend}%
              </span>
            </>
          )}
        </div>
      )}
    </motion.div>
  )
}