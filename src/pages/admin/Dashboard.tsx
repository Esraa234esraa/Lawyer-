import { motion } from 'framer-motion'
import StatCard from '@/components/admin/StatCard'
import { useLanguage } from '@/hooks/useLanguage'
import { useAdminStore } from '@/store/adminStore'
// import { BarChart3, Users, Briefcase, FileText } from 'lucide-react'

export default function AdminDashboard() {
  const { isArabic } = useLanguage()
  const { services, cases: casesData, news, clients, applications } = useAdminStore()

  const stats = [
    {
      titleAr: 'إجمالي الخدمات',
      titleEn: 'Total Services',
      value: services.length,
      icon: '📋',
      color: 'gold' as const,
      trend: 12,
    },
    {
      titleAr: 'القضايا النشطة',
      titleEn: 'Active Cases',
      value: casesData.length,
      icon: '⚖️',
      color: 'blue' as const,
      trend: 8,
    },
    {
      titleAr: 'الأخبار والمقالات',
      titleEn: 'News Articles',
      value: news.length,
      icon: '📰',
      color: 'green' as const,
      trend: 5,
    },
    {
      titleAr: 'العملاء المسجلين',
      titleEn: 'Registered Clients',
      value: clients.length,
      icon: '👥',
      color: 'red' as const,
      trend: 15,
    },
  ]

  const pendingApplications = applications.filter(
    (app) => app.status === 'pending'
  ).length

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div dir="rtl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-heading-1 font-cairo font-bold text-gradient mb-2">
          {isArabic ? 'لوحة الإحصائيات' : 'Statistics Dashboard'}
        </h1>
        <p className="text-gray-400 font-cairo">
          {isArabic
            ? 'نظرة عامة على جميع العمليات الإدارية'
            : 'Overview of all administrative operations'}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {stats.map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <StatCard
              titleAr={stat.titleAr}
              titleEn={stat.titleEn}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              trend={stat.trend}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid md:grid-cols-2 gap-6 mb-8"
      >
        {/* Pending Applications */}
        <div className="p-6 bg-charcoal border border-gold/20 rounded-lg">
          <h3 className="text-heading-3 font-cairo font-bold text-gold mb-4 text-right">
            {isArabic ? 'طلبات التدريب' : 'Internship Applications'}
          </h3>
          <div className="text-right">
            <p className="text-4xl font-bold text-gold mb-2">
              {pendingApplications}
            </p>
            <p className="text-gray-400 text-sm font-cairo">
              {isArabic
                ? 'طلبات قيد الانتظار'
                : 'Pending applications'}
            </p>
          </div>
        </div>

        {/* Client Growth */}
        <div className="p-6 bg-charcoal border border-gold/20 rounded-lg">
          <h3 className="text-heading-3 font-cairo font-bold text-gold mb-4 text-right">
            {isArabic ? 'طلبات التوظيف' : 'Client Growth'}
          </h3>
          <div className="text-right">
            <p className="text-4xl font-bold text-gold mb-2">
              +{clients.length}
            </p>
            <p className="text-gray-400 text-sm font-cairo">
              {isArabic
                ? 'هذا الشهر'
                : 'This month'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="p-6 bg-charcoal border border-gold/20 rounded-lg"
      >
        <h3 className="text-heading-3 font-cairo font-bold text-gold mb-4 text-right">
          {isArabic ? 'أحدث النشاطات' : 'Recent Activities'}
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-primary-black rounded-lg text-right">
            <span className="text-sm text-gray-400 font-cairo">
              {new Date().toLocaleString('ar-SA')}
            </span>
            <span className="text-sm font-cairo">
              {isArabic
                ? 'تم إضافة خدمة جديدة'
                : 'New service added'}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-primary-black rounded-lg text-right">
            <span className="text-sm text-gray-400 font-cairo">
              {new Date(Date.now() - 3600000).toLocaleString('ar-SA')}
            </span>
            <span className="text-sm font-cairo">
              {isArabic
                ? 'تحديث خبر'
                : 'News updated'}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-primary-black rounded-lg text-right">
            <span className="text-sm text-gray-400 font-cairo">
              {new Date(Date.now() - 7200000).toLocaleString('ar-SA')}
            </span>
            <span className="text-sm font-cairo">
              {isArabic
                ? 'عميل جديد مسجل'
                : 'New client registered'}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}