import { motion } from 'framer-motion'
import AccordionItem from '@/components/ui/AccordionItem'
import { useLanguage } from '@/hooks/useLanguage'
import { faqData } from '@/data/mockData'

export default function FAQ() {
  const { isArabic } = useLanguage()

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
              {isArabic ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
            </h1>
            <p className="text-gray-300 font-cairo max-w-2xl mx-auto">
              {isArabic
                ? 'إجابات على أسئلتك الشائعة حول خدماتنا'
                : 'Answers to your frequently asked questions about our services'}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-primary-black">
        <div className="container-max max-w-3xl">
          <div className="space-y-4">
            {faqData.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <AccordionItem
                  questionAr={item.questionAr}
                  questionEn={item.questionEn}
                  answerAr={item.answerAr}
                  answerEn={item.answerEn}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}