import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowRight, MapPin, DollarSign, Briefcase } from 'lucide-react'
import Loading from '@/components/ui/Loading'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/hooks/useLanguage'
import { useGetAllOffers, useGetOfferById } from '@/hooks/offers'
import InternshipApplicationForm from '@/components/client/InternshipApplicationForm'

const parseRequirements = (requirements: string): string[] =>
  requirements
    .split(/\r?\n|,/) 
    .map((item) => item.trim())
    .filter(Boolean)

export default function Jobs() {
  const { isArabic } = useLanguage()
  const { id } = useParams()
  const [showForm, setShowForm] = useState(false)
  const { data, isLoading, isFetching } = useGetAllOffers(1)
  const {
    data: jobByIdResponse,
    isLoading: isJobLoading,
    isFetching: isJobFetching,
  } = useGetOfferById(id || '', 1, Boolean(id))

  const offers = data?.data || []
  const activeJobs = useMemo(
    () => offers.filter((item) => item.hiringAndTraning === 1 && item.isActive !== false),
    [offers]
  )

  const job = id
    ? jobByIdResponse?.data || activeJobs.find((item) => item.id === id) || null
    : null

  if (id && (isLoading || isFetching || isJobLoading || isJobFetching)) {
    return (
      <div dir="rtl" className="pt-20 md:pt-24 pb-16">
        <section className="section-padding bg-charcoal">
          <div className="container-max px-4 md:px-0">
            <div className="py-16 flex justify-center">
              <Loading inline message={isArabic ? 'جاري تحميل الوظيفة...' : 'Loading job...'} />
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (id && job) {
    const requirements = parseRequirements(job.requirements)

    return (
      <div dir="rtl" className="pt-20 md:pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="bg-charcoal border-b border-gold/20">
          <div className="container-max py-3 md:py-4 px-4 md:px-0">
            <div className="flex justify-start ms-6">
              <Link to="/jobs" className="text-gold hover:text-gold-light font-cairo flex items-center gap-2 text-sm md:text-base">
                <ArrowRight size={18} />
                {isArabic ? 'العودة للوظائف' : 'Back to Jobs'}
              </Link>
            </div>
          </div>
        </div>

        {/* Details */}
        <section className="section-padding bg-charcoal">
          <div className="container-max px-4 md:px-0">
            {!showForm ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
              <h1 className="text-heading-2 md:text-heading-1 font-cairo font-bold text-gradient mb-4">
                {isArabic ? job.nameAr : job.nameEn || job.nameAr}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                <div className="p-4 bg-primary-black border border-gold/20 rounded-lg text-right">
                  <div className="flex items-center justify-end gap-2 mb-2">
                    <DollarSign size={20} className="text-gold" />
                    <p className="text-gray-400 font-cairo text-xs md:text-sm">
                      {isArabic ? 'الراتب' : 'Salary'}
                    </p>
                  </div>
                  <p className="text-gold font-cairo font-semibold text-sm md:text-base">
                    {job.salary}
                  </p>
                </div>

                <div className="p-4 bg-primary-black border border-gold/20 rounded-lg text-right">
                  <div className="flex items-center justify-end gap-2 mb-2">
                    <MapPin size={20} className="text-gold" />
                    <p className="text-gray-400 font-cairo text-xs md:text-sm">
                      {isArabic ? 'الموقع' : 'Location'}
                    </p>
                  </div>
                  <p className="text-gold font-cairo font-semibold text-sm md:text-base">
                    {job.location}
                  </p>
                </div>

                <div className="p-4 bg-primary-black border border-gold/20 rounded-lg text-right">
                  <div className="flex items-center justify-end gap-2 mb-2">
                    <Briefcase size={20} className="text-gold" />
                    <p className="text-gray-400 font-cairo text-xs md:text-sm">
                      {isArabic ? 'نوع الوظيفة' : 'Type'}
                    </p>
                  </div>
                  <p className="text-gold font-cairo font-semibold text-sm md:text-base">
                    {job.type}
                  </p>
                </div>

              </div>

              <div className="mb-8">
                <h2 className="text-heading-3 md:text-heading-2 font-cairo font-bold text-gold mb-4">
                  {isArabic ? 'وصف الوظيفة' : 'Job Description'}
                </h2>
                <p className="text-gray-300 font-cairo text-sm md:text-lg mb-4">
                  {job.description}
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-heading-3 md:text-heading-2 font-cairo font-bold text-gold mb-4">
                  {isArabic ? 'المتطلبات' : 'Requirements'}
                </h2>
                <ul className="space-y-2">
                  {requirements.map((req, idx) => (
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
                  className="w-full md:w-auto font-cairo text-sm md:text-base"
                >
                  {isArabic ? 'تقديم الطلب' : 'Apply Now'}
                </Button>
              </div>
              </motion.div>
            ) : (
              <InternshipApplicationForm
                hiringAndTraningType={1}
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
              {isArabic ? 'الوظائف الشاغرة' : 'Job Openings'}
            </h1>
            <p className="text-gray-300 font-cairo text-sm md:text-base max-w-2xl mx-auto">
              {isArabic
                ? 'انضم إلى فريقنا المتميز'
                : 'Join our outstanding team'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Jobs List */}
      <section className="section-padding bg-charcoal">
        <div className="container-max px-4 md:px-0">
          <div className="space-y-4 md:space-y-6">
            {activeJobs.length === 0 ? (
              <div className="text-center py-12 bg-primary-black border border-gold/20 rounded-lg">
                <p className="text-gray-400 font-cairo text-sm md:text-base">
                  {isArabic ? 'لا توجد وظائف شاغرة الآن' : 'No job openings available'}
                </p>
              </div>
            ) : (
              activeJobs.map((job, idx) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="p-4 md:p-6 bg-primary-black border border-gold/20 rounded-lg hover:border-gold/50 transition-all"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex-1 text-right w-full">
                      <h3 className="text-heading-3 md:text-heading-3 font-cairo font-bold text-gold mb-2">
                        {isArabic ? job.nameAr : job.nameEn || job.nameAr}
                      </h3>
                      <p className="text-gray-300 font-cairo text-sm md:text-base mb-4">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-end gap-3 md:gap-6 mb-4 text-xs md:text-sm">
                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-gold font-cairo font-semibold">{job.salary}</span>
                          <DollarSign size={16} className="text-gold" />
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-gold font-cairo font-semibold">{job.location}</span>
                          <MapPin size={16} className="text-gold" />
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-gold font-cairo font-semibold">{job.type}</span>
                          <Briefcase size={16} className="text-gold" />
                        </div>
                      </div>
                    </div>

                    <Link to={`/jobs/${job.id}`} className="w-full md:w-auto">
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