import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Loading from '@/components/ui/Loading'
import ServiceCard from '@/components/ui/ServiceCard'
import type { Service } from '@/types/service'

type ServicesSectionProps = {
  services: Service[]
  isLoading: boolean
  resolveImagePath: (filePath?: string | null) => string
}

export default function ServicesSection({ services, isLoading, resolveImagePath }: ServicesSectionProps) {
  return (
    <section className="section-padding bg-primary-black">
      <div className="container-max">
          <h2 className="text-heading-1 text-center text-gradient mb-12">خدمات قانونية متخصصة تلبي احتياجاتك</h2>

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