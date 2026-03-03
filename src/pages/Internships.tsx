import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { ArrowRight, Clock, Gift } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/hooks/useLanguage'
import { useAdminStore } from '@/store/adminStore'
import InternshipApplicationForm from '@/components/client/InternshipApplicationForm'
import { useState } from 'react'

export default function Internships() {
  const { isArabic } = useLanguage()
  const { id } = useParams()
  const { internships } = useAdminStore()
  const [showForm, setShowForm] = useState(false)

  const internship = id ? internships.find((i) => i.id === parseInt(id)) : null
  const activeInternships = internships.filter((i) => i.status === 'active')

  if (id && internship) {
    return (
      <div dir="rtl" className="pt-20 md:pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="bg-charcoal border-b border-gold/20">
          <div className="container-max py-3 md:py-4 px-4 md:px-0">
            <Link to="/internships" className="text-gold hover:text-gold-light font-cairo flex items-center gap-2 justify-end text-sm md:text-base">
              <ArrowRight size={18} />
              {isArabic ? 'العودة للتدريبات' : 'Back to Internships'}
            </Link>
          </div>
        </div>

        {/* Details */}
        <section className="section-padding bg-charcoal">
          <div className="container-max px-4 md:px-0">
            {!showForm ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="text-heading-2 md:text-heading-1 font-cairo font-bold text-gradient mb-4">
                    {isArabic ? internship.titleAr : internship.titleEn}
                  </h1>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                    <div className="p-4 bg-primary-black border border-gold/20 rounded-lg text-right">
                      <div className="flex items-center justify-end gap-2 mb-2">
                        <Clock size={20} className="text-gold" />
                        <p className="text-gray-400 font-cairo text-xs md:text-sm">
                          {isArabic ? 'المدة' : 'Duration'}
                        </p>
                      </div>
                      <p className="text-gold font-cairo font-semibold text-sm md:text-base">
                        {internship.duration}
                      </p>
                    </div>

                    <div className="p-4 bg-primary-black border border-gold/20 rounded-lg text-right">
                      <div className="flex items-center justify-end gap-2 mb-2">
                        <Gift size={20} className="text-gold" />
                        <p className="text-gray-400 font-cairo text-xs md:text-sm">
                          {isArabic ? 'المكافأة' : 'Stipend'}
                        </p>
                      </div>
                      <p className="text-gold font-cairo font-semibold text-sm md:text-base">
                        {internship.stipend}
                      </p>
                    </div>

                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-right">
                      <p className="text-green-400 font-cairo font-semibold text-sm md:text-base">
                        ✓ {isArabic ? 'متاح الآن' : 'Available Now'}
                      </p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-heading-3 md:text-heading-2 font-cairo font-bold text-gold mb-4">
                      {isArabic ? 'تفاصيل البرنامج' : 'Program Details'}
                    </h2>
                    <p className="text-gray-300 font-cairo text-sm md:text-lg mb-4">
                      {isArabic ? internship.detailsAr : internship.detailsEn}
                    </p>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-heading-3 md:text-heading-2 font-cairo font-bold text-gold mb-4">
                      {isArabic ? 'المتطلبات' : 'Requirements'}
                    </h2>
                    <ul className="space-y-2">
                      {internship.requirements.map((req, idx) => (
                        <li key={idx} className="text-gray-300 font-cairo text-sm md:text-base flex items-center gap-2 justify-end">
                          <span>{req}</span>
                          <span className="text-gold">✓</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="w-full md:w-auto">
                    <Button
                      onClick={() => setShowForm(true)}
                      size="lg"
                      variant="primary"
                      className="w-full md:w-auto font-cairo"
                    >
                      {isArabic ? 'تقديم طلب' : 'Apply Now'}
                    </Button>
                  </div>
                </motion.div>
              </>
            ) : (
              <InternshipApplicationForm
                internship={internship}
                onClose={() => setShowForm(false)}
              />
            )}
          </div>
        </section>
      </div>
    )
  }

  return (
    <div dir="rtl" className="pt-20 md:pt-24 pb-16">
      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-charcoal via-primary-black to-charcoal">
        <div className="container-max text-center px-4 md:px-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-heading-2 md:text-heading-1 font-cairo font-bold mb-4 text-gradient">
              {isArabic ? 'برامج التدريب' : 'Internship Programs'}
            </h1>
            <p className="text-gray-300 font-cairo text-sm md:text-base max-w-2xl mx-auto">
              {isArabic
                ? 'انضم إلى برنامج التدريب واكتسب خبرة عملية قيمة'
                : 'Join our internship program and gain valuable practical experience'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Internships List */}
      <section className="section-padding bg-charcoal">
        <div className="container-max px-4 md:px-0">
          <div className="space-y-4 md:space-y-6">
            {activeInternships.length === 0 ? (
              <div className="text-center py-12 bg-primary-black border border-gold/20 rounded-lg">
                <p className="text-gray-400 font-cairo text-sm md:text-base">
                  {isArabic ? 'لا توجد برامج تدريب متاحة الآن' : 'No internship programs available'}
                </p>
              </div>
            ) : (
              activeInternships.map((internship, idx) => (
                <motion.div
                  key={internship.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="p-4 md:p-6 bg-primary-black border border-gold/20 rounded-lg hover:border-gold/50 transition-all"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex-1 text-right w-full">
                      <h3 className="text-heading-3 md:text-heading-3 font-cairo font-bold text-gold mb-2">
                        {isArabic ? internship.titleAr : internship.titleEn}
                      </h3>
                      <p className="text-gray-300 font-cairo text-sm md:text-base mb-4">
                        {isArabic ? internship.descriptionAr : internship.descriptionEn}
                      </p>

                      <div className="flex flex-wrap items-center justify-end gap-3 md:gap-6 mb-4">
                        <div className="text-right">
                          <p className="text-gray-400 text-xs md:text-sm font-cairo mb-1">
                            {isArabic ? 'المدة' : 'Duration'}
                          </p>
                          <p className="text-gold font-cairo font-semibold text-sm md:text-base">
                            {internship.duration}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-xs md:text-sm font-cairo mb-1">
                            {isArabic ? 'المكافأة' : 'Stipend'}
                          </p>
                          <p className="text-gold font-cairo font-semibold text-sm md:text-base">
                            {internship.stipend}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Link to={`/internships/${internship.id}`} className="w-full md:w-auto">
                      <Button
                        variant="primary"
                        className="font-cairo whitespace-nowrap w-full md:w-auto text-sm md:text-base"
                      >
                        {isArabic ? 'عرض التفاصيل' : 'View Details'}
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}