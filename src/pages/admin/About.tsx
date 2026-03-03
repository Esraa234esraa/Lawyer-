import { motion } from 'framer-motion'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/hooks/useLanguage'
import { useAdminStore } from '@/store/adminStore'
import { toast } from 'sonner'

export default function AdminAbout() {
  const { isArabic } = useLanguage()
  const { aboutData, updateAbout } = useAdminStore()
  const [formData, setFormData] = useState({
    vision: aboutData.vision,
    visionEn: aboutData.visionEn,
    mission: aboutData.mission,
    missionEn: aboutData.missionEn,
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    updateAbout(formData)
    toast.success(isArabic ? 'تم حفظ التعديلات' : 'Changes saved')
    setIsSaving(false)
  }

  return (
    <div dir="rtl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-heading-1 font-cairo font-bold text-gradient mb-2">
          {isArabic ? 'تعديل صفحة من نحن' : 'Edit About Page'}
        </h1>
        <p className="text-gray-400 font-cairo">
          {isArabic
            ? 'قم بتعديل الرؤية والرسالة'
            : 'Edit vision and mission'}
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="max-w-4xl space-y-8"
      >
        {/* Vision Section */}
        <div className="p-6 bg-charcoal border border-gold/20 rounded-lg">
          <h2 className="text-heading-2 font-cairo font-bold text-gold mb-6 text-right">
            {isArabic ? 'الرؤية' : 'Vision'}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-3 text-right">
                {isArabic ? 'الرؤية (عربي)' : 'Vision (Arabic)'}
              </label>
              <textarea
                name="vision"
                value={formData.vision}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 bg-primary-black border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-3 text-right">
                {isArabic ? 'الرؤية (إنجليزي)' : 'Vision (English)'}
              </label>
              <textarea
                name="visionEn"
                value={formData.visionEn}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 bg-primary-black border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right resize-none"
              />
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="p-6 bg-charcoal border border-gold/20 rounded-lg">
          <h2 className="text-heading-2 font-cairo font-bold text-gold mb-6 text-right">
            {isArabic ? 'الرسالة' : 'Mission'}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-3 text-right">
                {isArabic ? 'الرسالة (عربي)' : 'Mission (Arabic)'}
              </label>
              <textarea
                name="mission"
                value={formData.mission}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 bg-primary-black border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-3 text-right">
                {isArabic ? 'الرسالة (إنجليزي)' : 'Mission (English)'}
              </label>
              <textarea
                name="missionEn"
                value={formData.missionEn}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 bg-primary-black border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right resize-none"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSaving}
            className="font-cairo"
          >
            {isArabic ? 'حفظ التعديلات' : 'Save Changes'}
          </Button>
        </div>
      </motion.form>
    </div>
  )
}