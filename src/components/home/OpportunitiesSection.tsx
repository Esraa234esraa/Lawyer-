import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'

export default function OpportunitiesSection() {
  return (
    <section className="section-padding bg-primary-black">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-heading-1 font-cairo font-bold mb-4 text-gradient">الفرص الوظيفية والتدريبات</h2>
          <p className="text-gray-300 font-cairo max-w-2xl mx-auto">
اصنع مستقبلك المهني معنا
          </p>
          <span className="text-gray-300 font-cairo max-w-2xl mx-auto">
نؤمن بأهمية تطوير الكفاءات القانونية وتأهيل الجيل القادم من المحامين والمستشارين القانونيين.
          </span>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="p-8 bg-charcoal border-2 border-gold/20 rounded-lg hover:border-gold/50 transition-all text-right"
          >
            <div className="text-5xl mb-4">🎓</div>
            <h3 className="text-heading-2 font-cairo font-bold text-gold mb-4">برامج التدريب</h3>
            <p className="text-gray-300 font-cairo mb-6">
              برامج تدريب متخصصة تحت إشراف محامين ذوي خبرة في مختلف المجالات القانونية.
            </p>
            <div className="space-y-2 mb-6">
              <p className="text-gold font-cairo font-semibold">✓ تدريب عملي بإشراف مختصين</p>
              <p className="text-gold font-cairo font-semibold">✓ مدة تدريب مرنة</p>
              <p className="text-gold font-cairo font-semibold">✓ شهادة إتمام معتمدة</p>
              <p className="text-gold font-cairo font-semibold">✓ مشاركة في أعمال قانونية حقيقية</p>
            </div>
            <Link to="/internships">
              <Button size="lg" variant="primary" className="w-full font-cairo flex-row-reverse">
                التقديم على  التدريب
                <ArrowLeft className="me-2" size={20} />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="p-8 bg-charcoal border-2 border-gold/20 rounded-lg hover:border-gold/50 transition-all text-right"
          >
            <div className="text-5xl mb-4">💼</div>
            <h3 className="text-heading-2 font-cairo font-bold text-gold mb-4">الوظائف الشاغرة</h3>
            <p className="text-gray-300 font-cairo mb-6">
              فرص وظيفية متميزة لمحامين وخبراء قانونيين بخبرات مختلفة.
            </p>
            <div className="space-y-2 mb-6">
              <p className="text-gold font-cairo font-semibold">✓ بيئة عمل احترافية</p>
              <p className="text-gold font-cairo font-semibold">✓ فرص نمو وتطوير مهني</p>
              <p className="text-gold font-cairo font-semibold">✓ رواتب ومزايا تنافسية</p>
              <p className="text-gold font-cairo font-semibold">✓ العمل ضمن فريق متخصص</p>
            </div>
            <Link to="/jobs">
              <Button size="lg" variant="primary" className="w-full font-cairo flex-row-reverse">
استعرض عن الوظائف                <ArrowLeft className="me-2" size={20} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}