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
}

type Child = {
  id?: string | null
  term: string
}

export default function ServiceForm({
  isArabic,
  initialService,
  isPending,
  onCancel,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState<number>(0)
  const [image, setImage] = useState<File | undefined>(undefined)

  // ✅ بدل text → array
  const [children, setChildren] = useState<Child[]>([])

  const [errors, setErrors] = useState<FormErrors>({})

  // ✅ INIT
  useEffect(() => {
    if (!initialService) return

    setTitle(initialService.title || '')
    setDescription(initialService.description || '')
    setPrice(initialService.price || 0)
    setImage(undefined)

    // 🔥 أهم تعديل: نحافظ على الـ id
    setChildren(initialService.childernTheServices || [])

    setErrors({})
  }, [initialService])

  // ✅ add feature
  const addChild = () => {
    setChildren([...children, { id: null, term: '' }])
  }

  // ✅ update feature
  const updateChild = (index: number, value: string) => {
    const updated = [...children]
    updated[index].term = value
    setChildren(updated)
  }

  // ✅ delete feature
  const removeChild = (index: number) => {
    const updated = children.filter((_, i) => i !== index)
    setChildren(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const input = {
      title: title.trim(),
      description: description.trim(),
      price,
      image,

      // ✅ نحافظ على id القديم
      childernTheServices: children.map((c) => ({
        id: c.id ?? null,
        term: c.term.trim(),
      })),
    }

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
          className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white text-right"
        />

        {errors.title && <p className="text-red-500 text-xs mt-2">{errors.title}</p>}
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
          className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white text-right"
        />

        {errors.description && <p className="text-red-500 text-xs mt-2">{errors.description}</p>}
      </div>

      {/* PRICE */}
      <div>
        <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
          {isArabic ? 'السعر' : 'Price'}
        </label>

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white text-right"
        />
      </div>

      {/* FEATURES */}
      <div>
        <label className="block text-sm font-cairo font-semibold text-gold mb-4 text-right">
          {isArabic ? 'تفاصيل الخدمة' : 'Features'}
        </label>

        {children.map((child, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              value={child.term}
              onChange={(e) => updateChild(index, e.target.value)}
              className="flex-1 px-3 py-2 bg-charcoal border border-gold/20 rounded-lg text-white text-right"
            />

            <button
              type="button"
              onClick={() => removeChild(index)}
              className="text-red-400"
            >
              ✕
            </button>
          </div>
        ))}

        <Button type="button" onClick={addChild} variant="secondary">
          {isArabic ? 'إضافة ميزة' : 'Add Feature'}
        </Button>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-4">
        <Button type="submit" variant="primary" className="flex-1" isLoading={isPending}>
          {isArabic ? 'حفظ' : 'Save'}
        </Button>

        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          {isArabic ? 'إلغاء' : 'Cancel'}
        </Button>
      </div>

    </form>
  )
}