import { motion } from 'framer-motion'
import { useLanguage } from '@/hooks/useLanguage'
import Button from '@/components/ui/Button'
import { useParams, useNavigate } from 'react-router-dom'
import { useAdminStore } from '@/store/adminStore'
import { toast } from 'sonner'
import { useState } from 'react'

export default function PaymentPage() {
  const { isArabic } = useLanguage()
  const { id } = useParams()
  const navigate = useNavigate()
  const { updateConsultationPayment } = useAdminStore()

  const [isLoading, setIsLoading] = useState(false)

  const handlePayment = async () => {
    if (!id) return

    setIsLoading(true)

    // 🔥 محاكاة بوابة دفع
    await new Promise((resolve) => setTimeout(resolve, 2000))

    updateConsultationPayment(Number(id), {
      paymentStatus: 'paid',
      paymentMethod: 'Visa',
      paymentReference: `TRX-${Date.now()}`,
    })

    toast.success(
      isArabic ? 'تم الدفع بنجاح' : 'Payment Successful'
    )

    setIsLoading(false)

    navigate('/payment-success')
  }

  return (
    <div className="pt-24" dir="rtl">
      <section className="section-padding bg-primary-black">
        <div className="container-max max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 border-2 border-gold/20 rounded-xl bg-charcoal text-center"
          >
            <h1 className="text-heading-2 font-cairo font-bold text-gold mb-6">
              {isArabic ? 'إتمام عملية الدفع' : 'Complete Payment'}
            </h1>

            <p className="text-gray-300 mb-8 font-cairo">
              {isArabic
                ? 'سيتم تحويلك لبوابة الدفع الآمنة'
                : 'You will be redirected to secure payment gateway'}
            </p>

            <Button
              onClick={handlePayment}
              isLoading={isLoading}
              className="w-full py-5 text-lg bg-gradient-to-r from-gold to-gold-light text-black rounded-xl shadow-xl hover:scale-105 transition-all duration-300"
            >
              {isArabic ? 'ادفع الآن' : 'Pay Now'}
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}