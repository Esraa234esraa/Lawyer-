import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/hooks/useLanguage'
import { useGetWhoAreWe, useUpdateWhoAreWe } from '@/hooks/whoAreWe'
import { toast } from 'sonner'

export default function AdminAbout() {
  const { isArabic } = useLanguage()
  const { data, isLoading, isFetching } = useGetWhoAreWe()
  const updateWhoAreWeMutation = useUpdateWhoAreWe()

  const [formData, setFormData] = useState({
    visionAr: '',
    messageAr: '',
  })

  useEffect(() => {
    const whoAreWe = data?.data
    if (!whoAreWe) return

    setFormData({
      visionAr: whoAreWe.visionAr || '',
      messageAr: whoAreWe.messageAr || '',
    })
  }, [data])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.visionAr.trim()) {
      toast.error(isArabic ? 'حقل الرؤية بالعربية مطلوب' : 'VisionAr is required')
      return
    }

    if (!formData.messageAr.trim()) {
      toast.error(isArabic ? 'حقل الرسالة بالعربية مطلوب' : 'MessageAr is required')
      return
    }

    const whoAreWe = data?.data
    if (!whoAreWe?.id) {
      toast.error(isArabic ? 'تعذر تحديد السجل للتحديث' : 'Could not resolve record id')
      return
    }

    await updateWhoAreWeMutation.mutateAsync({
      id: whoAreWe.id,
      payload: {
        visionAr: formData.visionAr.trim(),
        messageAr: formData.messageAr.trim(),
      },
    })
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
        {isFetching && (
          <p className="text-gray-500 font-cairo text-xs mt-1">
            {isArabic ? 'جاري تحديث البيانات...' : 'Refreshing data...'}
          </p>
        )}
      </motion.div>

      {isLoading && (
        <div className="mb-4 text-gray-300 font-cairo text-sm">
          {isArabic ? 'جاري تحميل بيانات من نحن...' : 'Loading who are we data...'}
        </div>
      )}

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

          <div>
            <label className="block text-sm font-cairo font-semibold text-gold mb-3 text-right">
              {isArabic ? 'الرؤية (عربي)' : 'Vision (Arabic)'}
            </label>
            <textarea
              name="visionAr"
              value={formData.visionAr}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-3 bg-primary-black border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right resize-none"
            />
          </div>
        </div>

        {/* Mission Section */}
        <div className="p-6 bg-charcoal border border-gold/20 rounded-lg">
          <h2 className="text-heading-2 font-cairo font-bold text-gold mb-6 text-right">
            {isArabic ? 'الرسالة' : 'Mission'}
          </h2>

          <div>
            <label className="block text-sm font-cairo font-semibold text-gold mb-3 text-right">
              {isArabic ? 'الرسالة (عربي)' : 'Mission (Arabic)'}
            </label>
            <textarea
              name="messageAr"
              value={formData.messageAr}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-3 bg-primary-black border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={updateWhoAreWeMutation.isPending}
            disabled={updateWhoAreWeMutation.isPending || isLoading}
            className="font-cairo"
          >
            {isArabic ? 'حفظ التعديلات' : 'Save Changes'}
          </Button>
        </div>
      </motion.form>
    </div>
  )
}