import { motion } from 'framer-motion'
import { useLanguage } from '@/hooks/useLanguage'
import { useAuth } from '@/hooks/useAuth'
import { Mail, Phone, Calendar } from 'lucide-react'

export default function ProfileCard() {
  const { isArabic } = useLanguage()
  const { user } = useAuth()

  const joinDate = new Date('2024-01-15').toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 bg-charcoal border border-gold/20 rounded-lg"
      dir="rtl"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-heading-2 font-cairo font-bold text-gold mb-2">
            {isArabic ? 'الملف الشخصي' : 'Profile'}
          </h2>
          <p className="text-gray-400 font-cairo text-sm">
            {isArabic ? 'معلومات حسابك' : 'Your account information'}
          </p>
        </div>
        {user?.avatar && (
          <img
            src={user.avatar}
            alt={user.nameAr}
            className="w-16 h-16 rounded-full border-2 border-gold"
          />
        )}
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div className="p-4 bg-primary-black rounded-lg text-right">
          <p className="text-gray-400 text-sm font-cairo mb-1">
            {isArabic ? 'الاسم' : 'Full Name'}
          </p>
          <p className="text-white font-cairo font-semibold">
            {user?.nameAr || user?.nameEn}
          </p>
        </div>

        {/* Email */}
        <motion.div
          whileHover={{ x: -4 }}
          className="p-4 bg-primary-black rounded-lg text-right hover:bg-primary-black/80 transition-all cursor-pointer"
        >
          <p className="text-gray-400 text-sm font-cairo mb-1 flex items-center justify-end gap-2">
            <Mail size={16} className="text-gold" />
            {isArabic ? 'البريد الإلكتروني' : 'Email'}
          </p>
          <p className="text-white font-cairo font-semibold">{user?.email}</p>
        </motion.div>

        {/* Phone */}
        <motion.div
          whileHover={{ x: -4 }}
          className="p-4 bg-primary-black rounded-lg text-right hover:bg-primary-black/80 transition-all cursor-pointer"
        >
          <p className="text-gray-400 text-sm font-cairo mb-1 flex items-center justify-end gap-2">
            <Phone size={16} className="text-gold" />
            {isArabic ? 'الهاتف' : 'Phone'}
          </p>
          <p className="text-white font-cairo font-semibold">
            +966 50 123 4567
          </p>
        </motion.div>

        {/* Join Date */}
        <motion.div
          whileHover={{ x: -4 }}
          className="p-4 bg-primary-black rounded-lg text-right hover:bg-primary-black/80 transition-all cursor-pointer"
        >
          <p className="text-gray-400 text-sm font-cairo mb-1 flex items-center justify-end gap-2">
            <Calendar size={16} className="text-gold" />
            {isArabic ? 'تاريخ الانضمام' : 'Join Date'}
          </p>
          <p className="text-white font-cairo font-semibold">{joinDate}</p>
        </motion.div>

        {/* Status Badge */}
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-right">
          <p className="text-green-400 font-cairo font-semibold">
            {isArabic ? '✓ حساب نشط' : '✓ Active Account'}
          </p>
        </div>
      </div>
    </motion.div>
  )
}