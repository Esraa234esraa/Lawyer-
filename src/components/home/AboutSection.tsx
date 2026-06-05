import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'

export default function AboutSection() {
  return (
    <section className="section-padding bg-charcoal">
      <div className="container-max">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=500&fit=crop"
                  className="rounded-lg border-2 border-gold/20"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-right"
          >
            <h2 className="text-heading-1 font-cairo font-bold mb-4 text-gradient"> من نحن</h2>
            <p className="text-3xl md:text-4xl font-cairo font-semibold text-white mb-4">
              نؤمن بأن العدالة تبدأ من فهم احتياجات العميل قبل أي إجراء قانوني.
            </p>
            <p className="text-gray-300 font-cairo text-lg mb-4">
              يقدم مكتب المحامية مريم بنت محمد خدمات قانونية واستشارية متكاملة للأفراد والشركات، مستندًا إلى خبرة عملية واسعة وفريق قانوني متخصص يعمل على دراسة كل قضية بعناية وتقديم الحلول المناسبة لها.
            </p>
            <div className="text-gray-200 font-cairo mb-6">
              <p className="font-semibold mb-3">نعمل وفق قيم راسخة تقوم على:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1">✓</span>
                  <span>السرية والخصوصية التامة</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1">✓</span>
                  <span>النزاهة والشفافية</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1">✓</span>
                  <span>الالتزام المهني</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1">✓</span>
                  <span>التركيز على تحقيق مصلحة العميل</span>
                </li>
              </ul>
            </div>
            <Link to="/about">
              <Button size="lg" variant="primary" className="font-cairo flex-row-reverse">
                تعرف على المكتب
                <ArrowLeft className="me-2" size={20} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}