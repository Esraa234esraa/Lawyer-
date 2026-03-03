import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'

export default function ClientProfile() {
  const { user } = useAuth()
  const { isArabic } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      dir="rtl"
    >
      <h1 className="text-heading-1 text-gradient mb-8 font-cairo">
        {isArabic ? 'الملف الشخصي' : 'Profile'}
      </h1>

      <div className="bg-charcoal border border-gold/20 rounded-lg p-8 max-w-2xl">
        <div className="flex items-center gap-6 mb-8 flex-row-reverse">
          {user?.avatar && (
            <img
              src={user.avatar}
              alt={user.nameAr || user.nameEn}
              className="w-16 h-16 rounded-full border-2 border-gold"
            />
          )}
          <div className="text-right">
            <h2 className="text-heading-2 text-gold font-cairo">{user?.nameAr || user?.nameEn}</h2>
            <p className="text-gray-400 font-cairo">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gold mb-2 font-cairo">
              {isArabic ? 'البريد الإلكتروني' : 'Email'}
            </label>
            <input
              type="email"
              value={user?.email}
              readOnly
              className="w-full px-4 py-2 bg-primary-black border border-gold/20 rounded-lg text-white font-cairo text-right"
            />
          </div>

          <div>
            <label className="block text-sm text-gold mb-2 font-cairo">
              {isArabic ? 'الاسم الكامل' : 'Full Name'}
            </label>
            <input
              type="text"
              value={user?.nameAr || user?.nameEn}
              readOnly
              className="w-full px-4 py-2 bg-primary-black border border-gold/20 rounded-lg text-white font-cairo text-right"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}