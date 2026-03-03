import { motion } from 'framer-motion'
import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/hooks/useLanguage'
import { toast } from 'sonner'
import { useAdminStore } from '@/store/adminStore'
interface ConsultationBookingFormProps {
  onClose?: () => void
}

export default function ConsultationBookingForm({ onClose }: ConsultationBookingFormProps) {
  const { isArabic } = useLanguage()
  const navigate = useNavigate()
  const { addConsultation } = useAdminStore()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    details: '',
    attachment: null as File | null,
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, attachment: file }))
      toast.success(isArabic ? `تم تحميل: ${file.name}` : `Uploaded: ${file.name}`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error(isArabic ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields')
      return
    }

    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast.success(isArabic ? 'تم تسجيل بياناتك' : 'Your data has been recorded')

    setIsLoading(false)

    addConsultation({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      service: formData.service,
      details: formData.details,
      attachment: formData.attachment?.name,
    })  
      navigate('/payment')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-8 bg-primary-black border-2 border-gold/20 rounded-xl max-w-3xl mx-auto shadow-2xl"
      dir="rtl"
    >
      <div className="flex items-center justify-between mb-6">
        {onClose && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={onClose}
            className="text-gray-400 hover:text-gold transition-colors"
          >
            <X size={24} />
          </motion.button>
        )}
        <h2 className="text-heading-2 font-cairo font-bold text-gold flex-1 text-right">
          {isArabic ? 'حجز استشارة قانونية' : 'Book a Legal Consultation'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label-gold">
              {isArabic ? 'الاسم الكامل *' : 'Full Name *'}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-gold"
            />
          </div>

          <div>
            <label className="label-gold">
              {isArabic ? 'البريد الإلكتروني *' : 'Email *'}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-gold"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label-gold">
              {isArabic ? 'رقم الهاتف *' : 'Phone *'}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="input-gold"
            />
          </div>

          <div>
            <label className="label-gold">
              {isArabic ? 'نوع الخدمة *' : 'Service Type *'}
            </label>
            <input
              type="text"
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
              className="input-gold"
            />
          </div>
        </div>

        <div>
          <label className="label-gold">
            {isArabic ? 'تفاصيل الاستشارة *' : 'Consultation Details *'}
          </label>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
            rows={4}
            required
            className="input-gold resize-none"
          />
        </div>

        {/* رفع ملف */}
        <div>
          <label className="label-gold">
            {isArabic ? 'إرفاق مستند (اختياري)' : 'Attach Document (Optional)'}
          </label>
          <label className="flex items-center justify-center gap-3 px-4 py-4 bg-charcoal border-2 border-dashed border-gold/30 rounded-lg hover:border-gold/60 transition-colors cursor-pointer">
            <input
              type="file"
              accept=".pdf,.doc,.doc,.docx,.jpg,.png"
              onChange={handleFileChange}
              className="hidden"
            />
            <Upload size={20} className="text-gold" />
            <span className="text-gold font-cairo">
              {formData.attachment
                ? formData.attachment.name
                : isArabic
                  ? 'اختر ملف'
                  : 'Choose file'}
            </span>
          </label>
        </div>

        {/* زرار الدفع */}
        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full font-cairo py-5 text-lg bg-gradient-to-r from-gold to-gold-light text-black rounded-xl shadow-xl hover:scale-105 transition-all duration-300"
        >
          {isArabic ? 'إكمال والدفع' : 'Proceed to Payment'}
        </Button>
      </form>
    </motion.div>
  )
}