import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { BarChart3, CalendarDays, ChevronLeft, CircleAlert, Clock3, PieChart, ShieldCheck, Sparkles, Target } from 'lucide-react'
import { useAdminStore } from '@/store/adminStore'

interface CaseStat {
  title: string
  value: number
  total: number
  trend: string
  tone: 'gold' | 'blue' | 'green' | 'red'
  key: string
}

interface CaseDetail {
  id: number
  name: string
  assignedTo: string
  status: string
  priority: string
  updatedAt: string
}

export default function CasesAnalysisPage() {
  const [activeSection, setActiveSection] = useState<'overview' | 'workflow'>('overview')
  const { cases } = useAdminStore()
  const [selectedGroup, setSelectedGroup] = useState<string>('finished')

  const notStartedCases = cases.filter(c => c.statusAr === 'لم تبدأ')
  const inProgressCases = cases.filter(c => c.statusAr === 'قيد العمل')
  const urgentCases = cases.filter(c => c.statusAr === 'عاجلة')
  const closedCases = cases.filter(c => c.statusAr === 'مغلقة')
  const finishedCases = cases.filter(c => c.statusAr === 'منتهية')

  const allDetails: Record<string, CaseDetail[]> = {
    notStarted: [
      { id: 1, name: 'دعوى تجارية رقم 2041', assignedTo: 'أحمد', status: 'لم تبدأ', priority: 'عالية', updatedAt: 'اليوم' },
      { id: 2, name: 'مراجعة عقد توريد', assignedTo: 'سارة', status: 'لم تبدأ', priority: 'متوسطة', updatedAt: 'قبل يومين' },
    ],
    inProgress: [
      { id: 3, name: 'مذكرة دفاع عمالية', assignedTo: 'محمد', status: 'قيد العمل', priority: 'عالية', updatedAt: 'منذ 3 ساعات' },
      { id: 4, name: 'تجهيز ملف استئناف', assignedTo: 'ليلى', status: 'قيد العمل', priority: 'متوسطة', updatedAt: 'اليوم' },
    ],
    important: [
      { id: 5, name: 'نزاع ملكية فكرية', assignedTo: 'فاطمة', status: 'عاجلة', priority: 'حرجة', updatedAt: 'قبل ساعة' },
    ],
    closed: [
      { id: 6, name: 'تسوية نزاع تجاري', assignedTo: 'كريم', status: 'مغلقة', priority: 'منخفضة', updatedAt: 'أمس' },
    ],
    finished: [
      { id: 7, name: 'إغلاق ملف تنفيذي', assignedTo: 'منى', status: 'منتهية', priority: 'منخفضة', updatedAt: 'قبل 3 أيام' },
    ],
  }

  const stats = useMemo<CaseStat[]>(() => {
    return [
      { title: 'لم تبدأ', value: notStartedCases.length, total: cases.length, trend: '+12%', tone: 'gold', key: 'notStarted' },
      { title: 'قيد العمل', value: inProgressCases.length, total: cases.length, trend: '+8%', tone: 'blue', key: 'inProgress' },
      { title: 'عاجلة', value: urgentCases.length, total: cases.length, trend: '+4%', tone: 'red', key: 'important' },
      { title: 'مغلقة', value: closedCases.length, total: cases.length, trend: '+16%', tone: 'green', key: 'closed' },
      { title: 'منتهية', value: finishedCases.length, total: cases.length, trend: '+22%', tone: 'gold', key: 'finished' },
    ]
  }, [notStartedCases.length, inProgressCases.length, urgentCases.length, closedCases.length, finishedCases.length, cases.length])

  const workflowRows = useMemo(() => {
    const totalCases = cases.length
    const workflowPercent = totalCases ? Math.round((finishedCases.length / totalCases) * 100) : 0

    return [
      { label: 'إجمالي القضايا', value: totalCases, note: 'آخر تحديث: اليوم', icon: ShieldCheck },
      { label: 'قضايا تحتاج متابعة', value: notStartedCases.length + inProgressCases.length, note: 'خلال 48 ساعة', icon: Clock3 },
      { label: 'قضايا عالية الأولوية', value: urgentCases.length, note: 'مؤشر أحمر', icon: CircleAlert },
      { label: 'معدّل الإغلاق', value: `${workflowPercent}%`, note: 'هذا الشهر', icon: Target },
    ]
  }, [cases.length, finishedCases.length, notStartedCases.length, inProgressCases.length, urgentCases.length])

  const toggleCard = (key: string) => {
    if (key === 'overview' || key === 'workflow') {
      setActiveSection(key)
      return
    }

    if (key in allDetails) {
      setSelectedGroup(key as 'notStarted' | 'inProgress' | 'important' | 'closed' | 'finished')
      setActiveSection('workflow')
    }
  }

  const chartTotal = stats.reduce((sum, item) => sum + item.value, 0)
  const workflowPercent = cases.length ? Math.round((finishedCases.length / cases.length) * 100) : 0

  const chartSegments = [
    { label: 'لم تبدأ', value: notStartedCases.length, color: '#9ca3af' },
    { label: 'قيد العمل', value: inProgressCases.length, color: '#3b82f6' },
    { label: 'عاجلة', value: urgentCases.length, color: '#ef4444' },
    { label: 'مغلقة', value: closedCases.length, color: '#8b5cf6' },
    { label: 'منتهية', value: finishedCases.length, color: '#22c55e' },
  ]

  return (
    <div className="min-h-screen bg-charcoal font-cairo text-right">
      <div className="container-max px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-gold/15 bg-gradient-to-br from-primary-black via-charcoal to-slate-900"
        >
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_right,rgba(198,167,94,0.2),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_28%)]" />
          <div className="relative px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
            <div className="flex flex-col gap-5 md:gap-6">
              <div className="flex flex-col gap-2 md:gap-3 max-w-3xl">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/20 bg-white/5 px-3 py-1 text-xs md:text-sm text-gold">
                  <Sparkles size={14} />
                  لوحة تحليل متقدمة للقضايا
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gradient leading-tight">
                  تحليل القضايا
                </h1>
                <p className="text-sm md:text-base lg:text-lg text-gray-300 leading-7 max-w-3xl">
                  نظرة منظمة على توزيع القضايا، معدلات الإغلاق، القضايا العاجلة، ومسار العمل الحالي داخل المكتب بشكل احترافي وواضح.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 max-w-4xl">
                <button
                  onClick={() => toggleCard('overview')}
                  className={`rounded-2xl border px-4 py-3 text-right transition-all ${activeSection === 'overview' ? 'border-gold bg-gold/10 text-gold' : 'border-white/10 bg-white/5 text-gray-200 hover:border-gold/30'}`}
                >
                  <p className="text-sm md:text-base font-semibold">نظرة عامة</p>
                  <p className="text-xs md:text-sm text-gray-300 mt-1">مؤشرات الأداء الرئيسية</p>
                </button>
                <button
                  onClick={() => toggleCard('workflow')}
                  className={`rounded-2xl border px-4 py-3 text-right transition-all ${activeSection === 'workflow' ? 'border-gold bg-gold/10 text-gold' : 'border-white/10 bg-white/5 text-gray-200 hover:border-gold/30'}`}
                >
                  <p className="text-sm md:text-base font-semibold">مسار العمل</p>
                  <p className="text-xs md:text-sm text-gray-300 mt-1">القضايا والتقدم</p>
                </button>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
                  <p className="text-sm md:text-base font-semibold text-white">نسبة الإغلاق</p>
                  <p className="text-xl md:text-2xl font-bold text-gold mt-1">{workflowPercent}%</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          {workflowRows.map((row, index) => {
            const Icon = row.icon
            return (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6 shadow-[0_12px_35px_rgba(0,0,0,0.18)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-400">{row.label}</p>
                    <p className="mt-2 text-3xl md:text-4xl font-bold text-white">{row.value}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold border border-gold/15">
                    <Icon size={22} />
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-400">{row.note}</p>
              </motion.div>
            )
          })}
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
          {/* Donut chart */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="xl:col-span-1 rounded-3xl border border-white/10 bg-primary-black/80 p-5 md:p-6"
          >
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white">توزيع القضايا</h2>
                <p className="text-sm text-gray-400 mt-1">نظرة بصرية على الحالات الحالية</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold/10 text-gold border border-gold/15">
                <PieChart size={20} />
              </div>
            </div>

            <div className="flex flex-col items-center gap-5">
              <div className="relative flex aspect-square w-full max-w-[260px] items-center justify-center">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                  <circle cx="60" cy="60" r="40" stroke="rgba(255,255,255,0.06)" strokeWidth="16" fill="none" />
                  {(() => {
                    let offset = 0
                    return chartSegments.map((segment) => {
                      const circumference = 251.2
                      const dash = (segment.value / chartTotal) * circumference
                      const currentOffset = offset
                      offset += dash
                      return (
                        <circle
                          key={segment.label}
                          cx="60"
                          cy="60"
                          r="40"
                          stroke={segment.color}
                          strokeWidth="16"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${dash} ${circumference - dash}`}
                          strokeDashoffset={-currentOffset}
                        />
                      )
                    })
                  })()}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <p className="text-xs text-gray-400">إجمالي القضايا</p>
                  <p className="text-3xl font-bold text-white">{chartTotal}</p>
                </div>
              </div>

              <div className="grid w-full grid-cols-1 gap-3">
                {chartSegments.map((segment) => (
                  <div key={segment.label} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: segment.color }} />
                      <span className="text-sm text-gray-200">{segment.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-white">{segment.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Performance Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="xl:col-span-2 rounded-3xl border border-white/10 bg-primary-black/80 p-5 md:p-6"
          >
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white">الأداء الشهري</h2>
                <p className="text-sm text-gray-400 mt-1">مؤشر تطور الحالات خلال الشهر</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/15">
                <BarChart3 size={20} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { label: 'الأسبوع الأول', value: 18, color: 'from-gold to-gold-light' },
                { label: 'الأسبوع الثاني', value: 32, color: 'from-blue-500 to-cyan-400' },
                { label: 'الأسبوع الثالث', value: 24, color: 'from-green-500 to-emerald-400' },
                { label: 'الأسبوع الرابع', value: 40, color: 'from-red-500 to-rose-400' },
              ].map((item) => (
                <div key={item.label} className="grid grid-cols-[96px_1fr_48px] items-center gap-3 md:gap-4">
                  <span className="text-sm text-gray-300">{item.label}</span>
                  <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-white text-left">{item.value}%</span>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-gray-400">نسبة النجاح</p>
                <p className="mt-2 text-2xl font-bold text-gold">{workflowPercent}%</p>
                <p className="mt-1 text-sm text-gray-300">تحسن واضح في سرعة الإغلاق والمتابعة</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-gray-400">أكثر فئة نشاطًا</p>
                <p className="mt-2 text-2xl font-bold text-blue-400">{inProgressCases.length}</p>
                <p className="mt-1 text-sm text-gray-300">قضايا قيد العمل حالياً</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Tables/Details */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="rounded-3xl border border-white/10 bg-primary-black/80 p-5 md:p-6"
          >
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white">مؤشرات سريعة</h2>
                <p className="text-sm text-gray-400 mt-1">أهم الأرقام التي تحتاج نظرة فورية</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-gold border border-gold/15">
                <CalendarDays size={20} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'القضايا المفتوحة', value: 15 },
                { label: 'القضايا العاجلة', value: 3 },
                { label: 'الملفات المراجعة', value: 11 },
                { label: 'الملفات المكتملة', value: 7 },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-gray-400">{item.label}</p>
                  <p className="mt-2 text-3xl font-bold text-gold">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="rounded-3xl border border-white/10 bg-primary-black/80 p-5 md:p-6"
          >
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white">تدفق القضايا</h2>
                <p className="text-sm text-gray-400 mt-1">ملخص تفصيلي للحالات الحالية</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-500/10 text-green-400 border border-green-500/15">
                <Target size={20} />
              </div>
            </div>

            <div className="space-y-3">
              {stats.map((item) => (
                <button
                  key={item.key}
                  onClick={() => toggleCard(item.key)}
                  className={`rounded-2xl border px-4 py-3 text-right transition-all ${selectedGroup === item.key ? 'border-gold bg-gold/10 text-gold' : 'border-white/10 bg-white/5 text-gray-200 hover:border-gold/30'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-gray-400">{item.title}</p>
                      <p className="mt-1 text-2xl font-bold text-white">{item.value}</p>
                    </div>
                    <div className={`rounded-full px-3 py-1 text-xs font-semibold ${item.tone === 'green' ? 'bg-green-500/15 text-green-400' : item.tone === 'blue' ? 'bg-blue-500/15 text-blue-400' : item.tone === 'red' ? 'bg-red-500/15 text-red-400' : 'bg-gold/15 text-gold'}`}>
                      {item.trend}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Expanded details */}
        <section className="rounded-3xl border border-white/10 bg-primary-black/80 p-5 md:p-6">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white">تفاصيل الفئة المختارة</h2>
              <p className="text-sm text-gray-400 mt-1">اضغط على أي فئة من الأعلى لعرض القضايا المرتبطة بها</p>
            </div>
            <ChevronLeft className="text-gold" size={18} />
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[720px] text-right">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-4 py-4 text-sm text-gold">الرقم</th>
                  <th className="px-4 py-4 text-sm text-gold">اسم القضية</th>
                  <th className="px-4 py-4 text-sm text-gold">المسؤول</th>
                  <th className="px-4 py-4 text-sm text-gold">الأولوية</th>
                  <th className="px-4 py-4 text-sm text-gold">آخر تحديث</th>
                  <th className="px-4 py-4 text-sm text-gold">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {(allDetails[selectedGroup] || []).map((item) => (
                  <tr key={item.id} className="border-b border-white/5 last:border-b-0 hover:bg-white/5">
                    <td className="px-4 py-4 text-sm text-gray-200">{item.id}</td>
                    <td className="px-4 py-4 text-sm text-gray-200">{item.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-300">{item.assignedTo}</td>
                    <td className="px-4 py-4 text-sm text-gray-300">{item.priority}</td>
                    <td className="px-4 py-4 text-sm text-gray-300">{item.updatedAt}</td>
                    <td className="px-4 py-4 text-sm text-gray-300">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}