import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Loading from '@/components/ui/Loading'
import ServiceCard from '@/components/ui/ServiceCard'
import type { Service } from '@/types/service'

type ServicesSectionProps = {
  services: Service[]
  isLoading: boolean
  resolveImagePath: (filePath?: string | null) => string
  serverMessage?: string
  serverError?: string
}

export default function ServicesSection({ services, isLoading, resolveImagePath, serverMessage, serverError }: ServicesSectionProps) {
  return (
    <section className="section-padding bg-primary-black">
      <div className="container-max">
          <h2 className="text-heading-1 text-center text-gradient mb-12">خدمات قانونية متخصصة تلبي احتياجاتك</h2>

          {/* Server feedback */}
          {/**
           * The parent can pass `serverMessage` for success or `serverError` for errors.
           * These are displayed under the heading.
           */}
          {serverMessage && (
            <div className="max-w-xl mx-auto mt-4 p-3 rounded bg-green-600 text-white text-center font-cairo">
              {serverMessage}
            </div>
          )}

          {serverError && (
            <div className="max-w-xl mx-auto mt-4 p-3 rounded bg-red-600 text-white text-center font-cairo">
              {serverError}
            </div>
          )}

        <div className="grid md:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-3">
              <Loading inline message="جاري تحميل الخدمات..." />
            </div>
          ) : (
            services.slice(0, 6).map((service) => (
              <motion.div key={service.id}>
                <Link to={`/services/${service.id}`}>
                  <ServiceCard
                    titleAr={service.title}
                    titleEn={service.title}
                    descriptionAr={service.description}
                    descriptionEn={service.description}
                    priceAr=""
                    priceEn=""
                    icon=""
                    imageUrl={resolveImagePath(service.serviceImagePath || '')}
                    features={(service.childernTheServices || []).map((child) => child.term)}
                  />
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}