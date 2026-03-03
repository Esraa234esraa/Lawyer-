import { motion } from 'framer-motion'
import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/hooks/useLanguage'
import { useAdminStore, Internship } from '@/store/adminStore'
import { toast } from 'sonner'

interface InternshipApplicationFormProps {
  internship: Internship
  onClose: () => void
}

export default function InternshipApplicationForm({
  internship,
  onClose,
}: InternshipApplicationFormProps) {
  const { isArabic } = useLanguage()
  const { addApplication } = useAdminStore()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    university: '',
    major: '',
    gpa: '',
    resume: null as File | null,
    coverLetter: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        resume: file,
      }))
      toast.success(isArabic ? `تم تحميل: ${file.name}` : `Uploaded: ${file.name}`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.resume) {
      toast.error(isArabic ? 'يرجى تحميل السيرة الذاتية' : 'Please upload resume')
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    addApplication({
      internshipId: internship.id,
      internshipTitleAr: internship.titleAr,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      university: formData.university,
      major: formData.major,
      gpa: formData.gpa,
      resumeName: formData.resume.name,
      coverLetter: formData.coverLetter,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'pending',
    })

    toast.success(isArabic ? 'تم استقبال طلبك' : 'Application received')
    setIsLoading(false)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-8 bg-primary-black border-2 border-gold/20 rounded-lg max-w-3xl mx-auto"
      dir="rtl"
    >
      <div className="flex items-center justify-between mb-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={onClose}
          className="text-gray-400 hover:text-gold transition-colors"
        >
          <X size={24} />
        </motion.button>
        <h2 className="text-heading-2 font-cairo font-bold text-gold flex-1 text-right">
          {isArabic ? 'نموذج التقديم' : 'Application Form'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
              {isArabic ? 'الاسم الكامل *' : 'Full Name *'}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
            />
          </div>
          <div>
            <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
              {isArabic ? 'البريد الإلكتروني *' : 'Email *'}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
              {isArabic ? 'الهاتف *' : 'Phone *'}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
            />
          </div>
          <div>
            <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
              {isArabic ? 'الجامعة *' : 'University *'}
            </label>
            <input
              type="text"
              name="university"
              value={formData.university}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
              {isArabic ? 'التخصص *' : 'Major *'}
            </label>
            <input
              type="text"
              name="major"
              value={formData.major}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
            />
          </div>
          <div>
            <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
              {isArabic ? 'المعدل *' : 'GPA *'}
            </label>
            <input
              type="number"
              name="gpa"
              value={formData.gpa}
              onChange={handleChange}
              step="0.01"
              min="0"
              max="4"
              required
              className="w-full px-4 py-3 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
            {isArabic ? 'السيرة الذاتية *' : 'Resume *'}
          </label>
          <label className="flex items-center justify-center gap-3 px-4 py-4 bg-charcoal border-2 border-dashed border-gold/30 rounded-lg hover:border-gold/50 transition-colors cursor-pointer">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              required
              className="hidden"
            />
            <Upload size={20} className="text-gold" />
            <span className="text-gold font-cairo">
              {formData.resume ? formData.resume.name : (isArabic ? 'اختر الملف' : 'Choose file')}
            </span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
            {isArabic ? 'رسالة التقديم' : 'Cover Letter'}
          </label>
          <textarea
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right resize-none"
            placeholder={isArabic ? 'أخبرنا عن نفسك...' : 'Tell us about yourself...'}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" variant="primary" isLoading={isLoading} className="flex-1 font-cairo">
            {isArabic ? 'إرسال' : 'Submit'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1 font-cairo"
          >
            {isArabic ? 'إلغاء' : 'Cancel'}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}