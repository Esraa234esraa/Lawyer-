import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import ServiceCard from '@/components/ui/ServiceCard'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/hooks/useLanguage'
import { useAdminStore } from '@/store/adminStore'
import { ArrowRight } from 'lucide-react'

export default function Services() {
  const { isArabic } = useLanguage()
  const { id } = useParams()
  const { services } = useAdminStore()

  const service = id ? services.find((s) => s.id === parseInt(id)) : null

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
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <img
                  src={service.image}
                  alt={isArabic ? service.titleAr : service.titleEn}
                  className="rounded-lg border-2 border-gold/20 w-full"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-right"
              >
                <h1 className="text-heading-1 font-cairo font-bold mb-2 text-gradient">
                  {isArabic ? service.titleAr : service.titleEn}
                </h1>

                {/* ✅ السعر */}
                <p className="text-3xl font-bold text-gold mb-4">
                  {isArabic ? service.priceAr : service.priceEn || service.priceAr}
                </p>

                <p className="text-gray-300 font-cairo mb-6 text-lg">
                  {isArabic ? service.descriptionAr : service.descriptionEn || service.descriptionAr}
                </p>

                <div className="mb-8">
                  <h3 className="text-heading-3 font-cairo font-bold mb-4 text-gold">
                    {isArabic ? 'ما الذي نقدمه' : 'What We Offer'}
                  </h3>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-3 font-cairo text-gray-300 flex-row-reverse"
                      >
                        <span className="text-gold">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/book-consultation"
                  state={{
                    serviceId: service.id,
                    serviceNameAr: service.titleAr,
                    serviceNameEn: service.titleEn || service.titleAr,
                    servicePriceSar: Number(service.priceAr.replace(/[^0-9]/g, '')) || 750,
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

  return (
    <div dir="rtl" className="pt-24">
      {/* Hero */}
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

      {/* Services Grid */}
      <section className="section-padding bg-primary-black">
        <div className="container-max">
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Link to={`/services/${service.id}`}>
                  <ServiceCard
                    titleAr={service.titleAr}
                    titleEn={service.titleEn || service.titleAr}
                    descriptionAr={service.descriptionAr}
                    descriptionEn={service.descriptionEn || service.descriptionAr}
                    priceAr={service.priceAr}
                    priceEn={service.priceEn || service.priceAr}
                    icon={service.icon}
                    features={service.features}
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