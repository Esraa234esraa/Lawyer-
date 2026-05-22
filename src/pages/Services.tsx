import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import ServiceCard from '@/components/ui/ServiceCard'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/hooks/useLanguage'
import { useGetServices } from '@/hooks/services'
import type { Service as BackendService, ServiceChild } from '@/types/service'
import { ArrowRight } from 'lucide-react'

export default function Services() {
  const { isArabic } = useLanguage()
  const { id } = useParams()

  const { data, isLoading, isError } = useGetServices()
  const services: BackendService[] = data?.data || []

  // ================= IMAGE HELPER =================
  const resolveImagePath = (filePath?: string | null) => {
    if (!filePath) return ''
    const trimmedPath = filePath.trim()
    if (trimmedPath.startsWith('http')) return trimmedPath

    const normalized = trimmedPath
      .replace(/^\/?wwwroot\/?/i, '')
      .replace(/^\/+/, '')
      .replace(/\\/g, '/')

    return `https://lawm.runasp.net/${normalized}`
  }

  const service =
    id ? services.find((s) => String(s.id) === String(id)) : undefined

  if (isLoading) {
    return (
      <div className="pt-24 text-center text-gray-300 font-cairo">
        {isArabic ? 'جاري تحميل الخدمات...' : 'Loading services...'}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="pt-24 text-center text-red-400 font-cairo">
        {isArabic ? 'تعذر تحميل البيانات' : 'Failed to load data'}
      </div>
    )
  }

  // ================= SERVICE DETAILS =================
  if (id && service) {
    return (
      <div dir="rtl" className="pt-24">
        <section className="section-padding bg-charcoal">
          <div className="container-max">
            <Link
              to="/services"
              className="text-gold hover:text-gold-light mb-4 inline-flex items-center gap-2 font-cairo"
            >
              <ArrowRight size={20} />
              {isArabic ? 'العودة للخدمات' : 'Back to Services'}
            </Link>

            <div className="grid md:grid-cols-2 gap-12 items-center mt-8">

              {/* IMAGE */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                {service.serviceImagePath && (
                  <img
                    src={resolveImagePath(service.serviceImagePath)}
                    alt={service.title}
                    className="rounded-lg border-2 border-gold/20 w-full"
                  />
                )}
              </motion.div>

              {/* CONTENT */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-right"
              >
                <h1 className="text-heading-1 font-cairo font-bold mb-2 text-gradient">
                  {service.title}
                </h1>

                <p className="text-3xl font-bold text-gold mb-4">
                  {service.price ? `${service.price} ر.س` : ''}
                </p>

                <p className="text-gray-300 font-cairo mb-6 text-lg">
                  {service.description}
                </p>

                <div className="mb-8">
                  <h3 className="text-heading-3 font-cairo font-bold mb-4 text-gold">
                    {isArabic ? 'ما الذي نقدمه' : 'What We Offer'}
                  </h3>

                  <ul className="space-y-3">
                    {(service.childernTheServices || []).map(
                      (child: ServiceChild, idx: number) => (
                        <li
                          key={child.id ?? idx}
                          className="flex items-center gap-3 font-cairo text-gray-300 flex-row-reverse"
                        >
                          <span className="text-gold">✓</span>
                          <span>{child.term}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <Link
                  to="/book-consultation"
                  state={{
                    serviceId: service.id,
                    serviceNameAr: service.title,
                    serviceNameEn: service.title,
                    servicePriceSar: service.price || 750,
                  }}
                >
                  <Button
                    size="lg"
                    className="font-cairo px-12 py-6 text-xl bg-gradient-to-r from-gold to-gold-light text-black rounded-xl shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    {isArabic ? 'احجز استشارة' : 'Schedule Consultation'}
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // ================= GRID =================
  return (
    <div dir="rtl" className="pt-24">

      <section className="section-padding bg-charcoal">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-heading-1 font-cairo font-bold mb-4 text-gradient">
              {isArabic ? 'خدماتنا المتخصصة' : 'Our Services'}
            </h1>

            <p className="text-gray-300 font-cairo max-w-2xl mx-auto">
              {isArabic
                ? 'مجموعة شاملة من الخدمات القانونية المتخصصة'
                : 'A comprehensive range of specialized legal services'}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-primary-black">
        <div className="container-max">
          <div className="grid md:grid-cols-3 gap-6">

            {services.map((service: BackendService) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Link to={`/services/${service.id}`}>
                  <ServiceCard
                    titleAr={service.title}
                    titleEn={service.title}
                    descriptionAr={service.description}
                    descriptionEn={service.description}
                    priceAr={service.price ? `${service.price} ر.س` : ''}
                    priceEn={service.price ? `${service.price} SAR` : ''}
                    icon={''}
                    imageUrl={resolveImagePath(service.serviceImagePath)}
                    features={(service.childernTheServices || []).map(
                      (c: ServiceChild) => c.term
                    )}
                  />
                </Link>
              </motion.div>
            ))}

          </div>
        </div>
      </section>
    </div>
  )
}