import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Loading from '@/components/ui/Loading'
import { useGetWhoAreWe, useUpdateWhoAreWe } from '@/hooks/whoAreWe'
import { toast } from 'sonner'

export default function AdminAbout() {
  const { data, isLoading, isFetching } = useGetWhoAreWe()
  const updateWhoAreWeMutation = useUpdateWhoAreWe()

  const [formData, setFormData] = useState({
    visionAr:
      'أن نكون من المكاتب القانونية الرائدة والأكثر موثوقية في المملكة العربية السعودية، من خلال تقديم خدمات قانونية واستشارية متكاملة تسهم في حماية الحقوق، وتعزيز الثقة، ودعم الأفراد والشركات في تحقيق أهدافهم ضمن إطار نظامي راسخ.',
    messageAr:
      'نسعى إلى تقديم خدمات قانونية وتوثيقية متخصصة وفق أعلى المعايير المهنية، عبر فريق قانوني مؤهل يمتلك الخبرة والكفاءة لتقديم حلول عملية وفعالة، مع الحرص على بناء علاقات طويلة الأمد مع عملائنا تقوم على الثقة والشفافية والالتزام.',
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
      toast.error('حقل الرؤية بالعربية مطلوب')
      return
    }

    if (!formData.messageAr.trim()) {
      toast.error('حقل الرسالة بالعربية مطلوب')
      return
    }

    const whoAreWe = data?.data
    if (!whoAreWe?.id) {
      toast.error('تعذر تحديد السجل للتحديث')
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-heading-1 font-cairo font-bold text-gradient mb-2">
          من نحن
        </h1>
        <p className="text-gray-400 font-cairo mb-4">
          شركاء في حماية الحقوق وصناعة الحلول القانونية
        </p>
        <p className="text-gray-300 font-cairo mb-4">
          في مكتب المحامية مريم بنت محمد للمحاماة والاستشارات القانونية، نؤمن بأن العمل القانوني لا يقتصر على تقديم الاستشارات أو الترافع فحسب، بل يبدأ بفهم احتياجات العميل وتقديم حلول قانونية واضحة تحمي مصالحه وتمنحه الثقة لاتخاذ قراراته.
        </p>
        <p className="text-gray-300 font-cairo mb-4">
          نقدم خدمات قانونية متخصصة للأفراد والشركات، مستندين إلى خبرة مهنية ومعرفة دقيقة بالأنظمة السعودية، مع التزام كامل بأعلى معايير الاحترافية والسرية والموثوقية.
        </p>
        {isFetching && (
          <p className="text-gray-500 font-cairo text-xs mt-1">
            جاري تحديث البيانات...
          </p>
        )}
      </motion.div>

      {isLoading && (
        <div className="mb-4 flex justify-end">
          <Loading inline message="جاري تحميل بيانات من نحن..." />
        </div>
      )}

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="max-w-4xl space-y-8"
      >
        <div className="p-6 bg-charcoal border border-gold/20 rounded-lg">
          <h2 className="text-heading-2 font-cairo font-bold text-gold mb-6 text-right">
            الرؤية
          </h2>

          <div>
            <label className="block text-sm font-cairo font-semibold text-gold mb-3 text-right">
              الرؤية (عربي)
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

        <div className="p-6 bg-charcoal border border-gold/20 rounded-lg">
          <h2 className="text-heading-2 font-cairo font-bold text-gold mb-6 text-right">
            الرسالة
          </h2>

          <div>
            <label className="block text-sm font-cairo font-semibold text-gold mb-3 text-right">
              الرسالة (عربي)
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

        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={updateWhoAreWeMutation.isPending}
            disabled={updateWhoAreWeMutation.isPending || isLoading}
            className="font-cairo"
          >
            حفظ التعديلات
          </Button>
        </div>
      </motion.form>
    </div>
  )
}