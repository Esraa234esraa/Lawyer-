import { useEffect, useMemo, useState } from 'react'
import Button from '@/components/ui/Button'
import { News, NewsCreateInput, NewsUpdateInput } from '@/types/news'
import { validateNewsCreateInput, validateNewsUpdateInput } from '@/utils/newsValidation'

interface NewsFormProps {
  isArabic: boolean
  mode: 'create' | 'edit'
  initialNews?: News | null
  isPending: boolean
  onCancel: () => void
  onSubmit: (input: NewsCreateInput | NewsUpdateInput) => Promise<void>
}

type FormErrors = {
  name?: string
  description?: string
  actionDate?: string
  image?: string
}

export default function NewsForm({
  isArabic,
  mode,
  initialNews,
  isPending,
  onCancel,
  onSubmit,
}: NewsFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [actionDate, setActionDate] = useState(new Date().toISOString().split('T')[0])
  const [image, setImage] = useState<File | undefined>(undefined)
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (initialNews) {
      setName(initialNews.name)
      setDescription(initialNews.description)
      setActionDate(new Date(initialNews.actionDate).toISOString().split('T')[0])
      setImage(undefined)
      setErrors({})
      return
    }

    setName('')
    setDescription('')
    setActionDate(new Date().toISOString().split('T')[0])
    setImage(undefined)
    setErrors({})
  }, [initialNews])

  const imageHint = useMemo(() => {
    if (mode === 'create') {
      return isArabic ? 'الصورة مطلوبة عند الإضافة' : 'Image is required for create'
    }

    return isArabic ? 'رفع صورة جديدة اختياري في التعديل' : 'New image is optional in edit mode'
  }, [isArabic, mode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (mode === 'create') {
      const createInput: NewsCreateInput = {
        name: name.trim(),
        description: description.trim(),
        image: image as File,
        actionDate,
      }

      const validation = validateNewsCreateInput(createInput)
      if (!validation.isValid) {
        setErrors(validation.errors)
        return
      }

      setErrors({})
      await onSubmit(createInput)
      return
    }

    const updateInput: NewsUpdateInput = {
      name: name.trim(),
      description: description.trim(),
      actionDate,
      ...(image ? { image } : {}),
    }

    const validation = validateNewsUpdateInput(updateInput)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setErrors({})
    await onSubmit(updateInput)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      <div>
        <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
          {isArabic ? 'الاسم' : 'Name'}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
        />
        {errors.name && <p className="text-red-500 text-xs mt-2 font-cairo text-right">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
          {isArabic ? 'الوصف' : 'Description'}
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
        />
        {errors.description && <p className="text-red-500 text-xs mt-2 font-cairo text-right">{errors.description}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
            {isArabic ? 'تاريخ الخبر' : 'Action Date'}
          </label>
          <input
            type="date"
            value={actionDate}
            onChange={(e) => setActionDate(e.target.value)}
            required
            className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
          />
          {errors.actionDate && <p className="text-red-500 text-xs mt-2 font-cairo text-right">{errors.actionDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
            {isArabic ? 'الصورة' : 'Image'}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0])}
            className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
          />
          <p className="text-gray-400 text-xs mt-2 font-cairo text-right">{imageHint}</p>
          {errors.image && <p className="text-red-500 text-xs mt-2 font-cairo text-right">{errors.image}</p>}
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" variant="primary" className="flex-1 font-cairo" disabled={isPending} isLoading={isPending}>
          {isArabic ? 'حفظ' : 'Save'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1 font-cairo" disabled={isPending}>
          {isArabic ? 'إلغاء' : 'Cancel'}
        </Button>
      </div>
    </form>
  )
}