import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import Button from '@/components/ui/Button'
import DataTable, { Column } from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'
import { useAdminStore, Service } from '@/store/adminStore'
import { toast } from 'sonner'

export default function AdminServices() {
  const { services, consultations, addService, updateService, deleteService } = useAdminStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [featuresText, setFeaturesText] = useState('')
  const [formData, setFormData] = useState<Omit<Service, 'id'>>({
    titleAr: '',
    descriptionAr: '',
    priceAr: '',
    icon: '',
    features: [],
    image: '',
  })

  const normalize = (value: string) => value.replace(/\s+/g, ' ').trim()

  const getBookingsCountForService = (service: Service) => {
    const serviceName = normalize(service.titleAr)
    return consultations.filter((booking) => {
      const byName = normalize(booking.consultationName || '')
      const byService = normalize(booking.service || '')
      return byName === serviceName || byService === serviceName
    }).length
  }

  const bookedCountMap = useMemo(() => {
    const map = new Map<number, number>()
    services.forEach((service) => {
      map.set(service.id, getBookingsCountForService(service))
    })
    return map
  }, [services, consultations])

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setFormData({
        titleAr: service.titleAr,
        descriptionAr: service.descriptionAr,
        priceAr: service.priceAr,
        icon: service.icon,
        features: service.features,
        image: service.image,
      })
      setFeaturesText(service.features.join('\n'))
      setEditingId(service.id)
    } else {
      setFormData({
        titleAr: '',
        descriptionAr: '',
        priceAr: '',
        icon: '',
        features: [],
        image: '',
      })
      setFeaturesText('')
      setEditingId(null)
    }
    setIsModalOpen(true)
  }

  const handleOpenDetails = (service: Service) => {
    setSelectedService(service)
    setIsDetailsOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setFeaturesText(value)
    setFormData((prev) => ({
      ...prev,
      features: value
        .split('\n')
        .map((feature) => feature.trim())
        .filter(Boolean),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.features.length) {
      toast.error('اكتبي على الأقل نقطة واحدة في تفاصيل الخدمة')
      return
    }

    if (editingId) {
      updateService(editingId, formData)
      toast.success('تم تحديث الخدمة')
    } else {
      addService(formData)
      toast.success('تمت إضافة الخدمة')
    }

    handleCloseModal()
  }

  const handleDelete = (service: Service) => {
    deleteService(service.id)
    toast.success('تم حذف الخدمة')
  }

  const columns: Column<Service>[] = [
    {
      key: 'titleAr',
      labelAr: 'عنوان الخدمة',
      labelEn: 'Service Title',
      render: (_value, item) => item.titleAr,
    },
    {
      key: 'priceAr',
      labelAr: 'السعر',
      labelEn: 'Price',
      render: (value) => value,
    },
    {
      key: 'descriptionAr',
      labelAr: 'الوصف',
      labelEn: 'Description',
      render: (value) => `${value.slice(0, 45)}${value.length > 45 ? '...' : ''}`,
    },
    {
      key: 'features',
      labelAr: 'تفاصيل الخدمة',
      labelEn: 'Service Details',
      render: (value) => `${(value as string[]).length} عناصر`,
    },
    {
      key: 'id',
      labelAr: 'عدد الحجوزات',
      labelEn: 'Bookings',
      render: (_value, item) => (
        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-gold/10 text-gold font-cairo text-sm">
          {bookedCountMap.get(item.id) || 0}
        </span>
      ),
    },
  ]

  return (
    <div dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4 mb-8"
      >
        <div>
          <h1 className="text-heading-1 font-cairo font-bold text-gradient">
            إدارة الخدمات
          </h1>
          <p className="text-gray-400 font-cairo text-sm">
            إجمالي الخدمات: {services.length}
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          variant="primary"
          size="lg"
          className="font-cairo flex-row-reverse ms-auto"
        >
          <Plus size={20} className="me-2" />
          إضافة خدمة
        </Button>
      </motion.div>

      <DataTable
        columns={columns}
        data={services}
        onView={handleOpenDetails}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        deleteTitleAr="حذف الخدمة"
        deleteTitleEn="Delete Service"
        getDeleteLabel={(service) => service.titleAr}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add Service"
        titleAr="إضافة/تعديل خدمة"
      >
        <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
          <div>
            <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
              عنوان الخدمة
            </label>
            <input
              type="text"
              name="titleAr"
              value={formData.titleAr}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                السعر
              </label>
              <input
                type="text"
                name="priceAr"
                value={formData.priceAr}
                onChange={handleChange}
                required
                placeholder="مثال: 8000 ر.س"
                className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
              />
            </div>

            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                الرمز
              </label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                placeholder="📋"
                className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
              الوصف
            </label>
            <textarea
              name="descriptionAr"
              value={formData.descriptionAr}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
              تفاصيل الخدمة (كل سطر نقطة)
            </label>
            <textarea
              name="features"
              value={featuresText}
              onChange={handleFeaturesChange}
              required
              rows={5}
              placeholder={'مثال:\nتأسيس الشركات\nالعقود التجارية\nالاندماج والاستحواذ'}
              className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
              رابط الصورة
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" variant="primary" className="flex-1 font-cairo">
              حفظ
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
              className="flex-1 font-cairo"
            >
              إلغاء
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Service Details"
        titleAr="تفاصيل الخدمة"
      >
        {selectedService && (
          <div className="space-y-5 font-cairo text-right" dir="rtl">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">عنوان الخدمة</p>
                <p className="text-white font-semibold">{selectedService.titleAr}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">السعر</p>
                <p className="text-gold font-semibold">{selectedService.priceAr}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">عدد الحجوزات</p>
                <p className="text-white font-semibold">{bookedCountMap.get(selectedService.id) || 0}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">الرابط</p>
                <p className="text-white break-all">{selectedService.image || 'لا يوجد'}</p>
              </div>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1">الوصف</p>
              <p className="text-white leading-7">{selectedService.descriptionAr}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-2">ما الذي توفره الخدمة</p>
              <ul className="space-y-2">
                {selectedService.features.map((feature, index) => (
                  <li key={`${feature}-${index}`} className="flex items-center gap-2 justify-end text-gold">
                    <span>{feature}</span>
                    <span>✓</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
