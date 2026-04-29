import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'

type Service = any

type Props = {
  isArabic: boolean
  initialService?: Service | null
  isPending: boolean
  onCancel: () => void
  onSubmit: (input: any) => Promise<void>
}

type FormErrors = {
  title?: string
  description?: string
  price?: string
  image?: string
}

export default function ServiceForm({
  isArabic,
//   mode,
  initialService,
  isPending,
  onCancel,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState<number>(0)
  const [image, setImage] = useState<File | undefined>(undefined)
  const [featuresText, setFeaturesText] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

useEffect(() => {
  if (!initialService) return

  setTitle(initialService.title || '')
  setDescription(initialService.description || '')
  setPrice(initialService.price || 0)
  setImage(undefined)

  setFeaturesText(
    initialService.childernTheServices?.map((c: any) => c.term).join('\n') || ''
  )

  setErrors({})
}, [initialService])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const input = {
      title: title.trim(),
      description: description.trim(),
      price,
      image,
      childernTheServices: featuresText
        .split('\n')
        .filter(Boolean)
        .map((t) => ({ id: null, term: t.trim() })),
    }

    // simple validation (زي NewsForm style)
    const newErrors: FormErrors = {}

    if (!input.title) newErrors.title = 'Title is required'
    if (!input.description) newErrors.description = 'Description is required'
    if (!input.price) newErrors.price = 'Price is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    await onSubmit(input)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">

      {/* TITLE */}
      <div>
        <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
          {isArabic ? 'عنوان الخدمة' : 'Title'}
        </label>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
        />

        {errors.title && (
          <p className="text-red-500 text-xs mt-2 font-cairo text-right">
            {errors.title}
          </p>
        )}
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
          {isArabic ? 'الوصف' : 'Description'}
        </label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
        />

        {errors.description && (
          <p className="text-red-500 text-xs mt-2 font-cairo text-right">
            {errors.description}
          </p>
        )}
      </div>

      {/* PRICE + IMAGE */}
      <div className="grid md:grid-cols-2 gap-4">

        <div>
          <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
            {isArabic ? 'السعر' : 'Price'}
          </label>

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
          />

          {errors.price && (
            <p className="text-red-500 text-xs mt-2 font-cairo text-right">
              {errors.price}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
            {isArabic ? 'الصورة' : 'Image'}
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0])}
            className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white font-cairo text-right"
          />
        </div>

      </div>

      {/* FEATURES */}
      <div>
        <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
          {isArabic ? 'تفاصيل الخدمة (كل سطر ميزة)' : 'Features'}
        </label>

        <textarea
          value={featuresText}
          onChange={(e) => setFeaturesText(e.target.value)}
          rows={5}
          className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
        />
      </div>

      {/* BUTTONS */}
      <div className="flex gap-4">
        <Button
          type="submit"
          variant="primary"
          className="flex-1 font-cairo"
          disabled={isPending}
          isLoading={isPending}
        >
          {isArabic ? 'حفظ' : 'Save'}
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1 font-cairo"
          disabled={isPending}
        >
          {isArabic ? 'إلغاء' : 'Cancel'}
        </Button>
      </div>

    </form>
  )
}