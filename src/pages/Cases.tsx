import { motion } from 'framer-motion'
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import CaseCard from '@/components/ui/CaseCard'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/hooks/useLanguage'
import { casesData } from '@/data/mockData'
import { ArrowRight } from 'lucide-react'

export default function Cases() {
  const { isArabic } = useLanguage()
  const { id } = useParams()
  const [filter, setFilter] = useState<string | null>(null)

  const caseItem = id ? casesData.find((c) => c.id === parseInt(id)) : null

  if (id && caseItem) {
    return (
      <div dir="rtl" className="pt-24">
        <section className="section-padding bg-charcoal">
          <div className="container-max">
            <Link to="/cases" className="text-gold hover:text-gold-light mb-4 inline-flex items-center gap-2 font-cairo">
              <ArrowRight size={20} />
              {isArabic ? 'العودة للقضايا' : 'Back to Cases'}
            </Link>

            <div className="grid md:grid-cols-2 gap-12 items-center mt-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <img
                  src={caseItem.image}
                  alt={isArabic ? caseItem.titleAr : caseItem.titleEn}
                  className="rounded-lg border-2 border-gold/20 w-full"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-right"
              >
                <div className="mb-4">
                  <span className="text-xs bg-gold/20 text-gold px-3 py-1 rounded-full font-cairo">
                    {isArabic ? caseItem.typeAr : caseItem.typeEn}
                  </span>
                </div>
                <h1 className="text-heading-1 font-cairo font-bold mb-4 text-gradient">
                  {isArabic ? caseItem.titleAr : caseItem.titleEn}
                </h1>
                <p className="text-gray-300 font-cairo mb-6 text-lg">
                  {isArabic ? caseItem.descriptionAr : caseItem.descriptionEn}
                </p>

                <div className="p-6 bg-primary-black border border-gold/20 rounded-lg mb-6 text-right">
                  <h3 className="text-heading-3 font-cairo font-bold text-gold mb-2">
                    {isArabic ? 'النتيجة' : 'Outcome'}
                  </h3>
                  <p className="text-gray-300 font-cairo">
                    {isArabic ? caseItem.outcome : caseItem.outcomeEn}
                  </p>
                </div>

                <Link to="/contact">
                  <Button size="lg" variant="primary" className="font-cairo">
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

  const categories = [...new Set(casesData.map((c) => c.typeAr))]
  const filteredCases = filter
    ? casesData.filter((c) => c.typeAr === filter)
    : casesData

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
              {isArabic ? 'القضايا الناجحة' : 'Successful Cases'}
            </h1>
            <p className="text-gray-300 font-cairo max-w-2xl mx-auto">
              {isArabic
                ? 'نعرض لكم بعضاً من أبرز القضايا التي نجحنا فيها'
                : 'Some of our most prominent successful cases'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-primary-black border-b border-gold/20">
        <div className="container-max">
          <div className="flex justify-end gap-3 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setFilter(null)}
              className={`px-4 py-2 rounded-lg font-cairo transition-all ${
                !filter
                  ? 'bg-gold text-primary-black'
                  : 'bg-charcoal border border-gold/20 text-gold hover:border-gold'
              }`}
            >
              {isArabic ? 'الكل' : 'All'}
            </motion.button>
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-lg font-cairo transition-all ${
                  filter === category
                    ? 'bg-gold text-primary-black'
                    : 'bg-charcoal border border-gold/20 text-gold hover:border-gold'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Cases Grid */}
      <section className="section-padding bg-charcoal">
        <div className="container-max">
          <div className="grid md:grid-cols-2 gap-8">
            {filteredCases.map((caseItem) => (
              <motion.div
                key={caseItem.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Link to={`/cases/${caseItem.id}`}>
                  <CaseCard
                    titleAr={caseItem.titleAr}
                    titleEn={caseItem.titleEn}
                    descriptionAr={caseItem.descriptionAr}
                    descriptionEn={caseItem.descriptionEn}
                    typeAr={caseItem.typeAr}
                    typeEn={caseItem.typeEn}
                    yearAr={caseItem.yearAr}
                    yearEn={caseItem.yearEn}
                    image={caseItem.image}
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