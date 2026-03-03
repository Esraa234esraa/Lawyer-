import { motion } from 'framer-motion'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import Button from '@/components/ui/Button'
import DataTable, { Column } from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'
import { useLanguage } from '@/hooks/useLanguage'
import { useAdminStore, Service } from '@/store/adminStore'
import { toast } from 'sonner'

export default function AdminServices() {
  const { isArabic } = useLanguage()
  const { services, addService, updateService, deleteService } = useAdminStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Omit<Service, 'id'>>({
    titleAr: '',
    titleEn: '',
    descriptionAr: '',
    descriptionEn: '',
    icon: '',
    features: [],
    image: '',
  })

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setFormData({
        titleAr: service.titleAr,
        titleEn: service.titleEn,
        descriptionAr: service.descriptionAr,
        descriptionEn: service.descriptionEn,
        icon: service.icon,
        features: service.features,
        image: service.image,
      })
      setEditingId(service.id)
    } else {
      setFormData({
        titleAr: '',
        titleEn: '',
        descriptionAr: '',
        descriptionEn: '',
        icon: '',
        features: [],
        image: '',
      })
      setEditingId(null)
    }
    setIsModalOpen(true)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      updateService(editingId, formData)
      toast.success(isArabic ? 'تم تحديث الخدمة' : 'Service updated')
    } else {
      addService(formData)
      toast.success(isArabic ? 'تمت إضافة الخدمة' : 'Service added')
    }

    handleCloseModal()
  }

  const handleDelete = (service: Service) => {
    if (confirm(isArabic ? 'هل تريد حذف هذه الخدمة؟' : 'Are you sure?')) {
      deleteService(service.id)
      toast.success(isArabic ? 'تم حذف الخدمة' : 'Service deleted')
    }
  }

  const columns: Column<Service>[] = [
    {
      key: 'titleAr',
      labelAr: 'الاسم',
      labelEn: 'Name',
      render: (_value, item) => isArabic ? item.titleAr : item.titleEn,
    },
    {
      key: 'descriptionAr',
      labelAr: 'الوصف',
      labelEn: 'Description',
      render: (_value, item) =>
        (isArabic ? item.descriptionAr : item.descriptionEn).substring(0, 40) +
        '...',
    },
    {
      key: 'icon',
      labelAr: 'الرمز',
      labelEn: 'Icon',
    },
  ]

  return (
    <div dir="rtl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8"
      >
        <Button
          onClick={() => handleOpenModal()}
          variant="primary"
          size="lg"
          className="font-cairo flex-row-reverse"
        >
          <Plus size={20} className="me-2" />
          {isArabic ? 'إضافة خدمة' : 'Add Service'}
        </Button>
        <div>
          <h1 className="text-heading-1 font-cairo font-bold text-gradient">
            {isArabic ? 'إدارة الخدمات' : 'Manage Services'}
          </h1>
          <p className="text-gray-400 font-cairo text-sm">
            {isArabic
              ? `إجمالي الخدمات: ${services.length}`
              : `Total Services: ${services.length}`}
          </p>
        </div>
      </motion.div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={services}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add Service"
        titleAr="إضافة/تعديل خدمة"
      >
        <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                {isArabic ? 'الاسم بالعربية' : 'Name (Arabic)'}
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
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                {isArabic ? 'الاسم بالإنجليزية' : 'Name (English)'}
              </label>
              <input
                type="text"
                name="titleEn"
                value={formData.titleEn}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                {isArabic ? 'الوصف بالعربية' : 'Description (Arabic)'}
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
                {isArabic ? 'الوصف بالإنجليزية' : 'Description (English)'}
              </label>
              <textarea
                name="descriptionEn"
                value={formData.descriptionEn}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right resize-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                {isArabic ? 'الرمز' : 'Icon'}
              </label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                placeholder="📋"
                className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right text-2xl"
              />
            </div>
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                {isArabic ? 'رابط الصورة' : 'Image URL'}
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" variant="primary" className="flex-1 font-cairo">
              {isArabic ? 'حفظ' : 'Save'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
              className="flex-1 font-cairo"
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}