import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'

export default function CtaSection() {
  return (
    <section className="section-padding bg-gradient-to-r from-gold to-gold-light">
      <div className="container-max text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-heading-2 font-cairo font-bold mb-4 text-primary-black">ابدأ خطواتك القانونية بثقة </h2>
          <p className="text-primary-black/80 mb-8 max-w-2xl mx-auto font-cairo">
إذا كنت بحاجة إلى استشارة قانونية أو تمثيل قانوني متخصص، فإن فريقنا مستعد للاستماع إليك وتقديم الدعم المناسب لحالتك.
          </p>
          <span className="text-primary-black/80 mb-8 max-w-2xl mx-auto font-cairo font-bold">
          احجز استشارتك القانونية اليوم ودعنا نساعدك على اتخاذ القرار الصحيح.
          </span>
          <Link to="/contact">
            <Button size="lg" variant="dark" className="font-cairo flex-row-reverse">
              احجز الآن
              <ArrowLeft className="me-2" size={20} />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}