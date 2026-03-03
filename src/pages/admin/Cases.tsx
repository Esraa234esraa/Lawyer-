import { motion } from 'framer-motion'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import Button from '@/components/ui/Button'
import DataTable, { Column } from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'
import StatusBadge from '@/components/admin/StatusBadge'
import { useLanguage } from '@/hooks/useLanguage'
import { useAdminStore, Case } from '@/store/adminStore'
import { toast } from 'sonner'

export default function AdminCases() {
  const { isArabic } = useLanguage()
  const { cases, addCase, updateCase, deleteCase } = useAdminStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Omit<Case, 'id'>>({
    titleAr: '',
    titleEn: '',
    descriptionAr: '',
    descriptionEn: '',
    typeAr: '',
    typeEn: '',
    yearAr: '',
    yearEn: '',
    outcome: '',
    outcomeEn: '',
    image: '',
  })

  const handleOpenModal = (caseItem?: Case) => {
    if (caseItem) {
      setFormData({
        titleAr: caseItem.titleAr,
        titleEn: caseItem.titleEn,
        descriptionAr: caseItem.descriptionAr,
        descriptionEn: caseItem.descriptionEn,
        typeAr: caseItem.typeAr,
        typeEn: caseItem.typeEn,
        yearAr: caseItem.yearAr,
        yearEn: caseItem.yearEn,
        outcome: caseItem.outcome,
        outcomeEn: caseItem.outcomeEn,
        image: caseItem.image,
      })
      setEditingId(caseItem.id)
    } else {
      setFormData({
        titleAr: '',
        titleEn: '',
        descriptionAr: '',
        descriptionEn: '',
        typeAr: '',
        typeEn: '',
        yearAr: '',
        yearEn: '',
        outcome: '',
        outcomeEn: '',
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
      updateCase(editingId, formData)
      toast.success(isArabic ? 'تم تحديث القضية' : 'Case updated')
    } else {
      addCase(formData)
      toast.success(isArabic ? 'تمت إضافة القضية' : 'Case added')
    }

    handleCloseModal()
  }

  const handleDelete = (caseItem: Case) => {
    if (confirm(isArabic ? 'هل تريد حذف هذه القضية؟' : 'Are you sure?')) {
      deleteCase(caseItem.id)
      toast.success(isArabic ? 'تم حذف القضية' : 'Case deleted')
    }
  }

  const columns: Column<Case>[] = [
    {
      key: 'titleAr',
      labelAr: 'الاسم',
      labelEn: 'Title',
      render: (_value, item) => isArabic ? item.titleAr : item.titleEn,
    },
    {
      key: 'typeAr',
      labelAr: 'النوع',
      labelEn: 'Type',
      render: (_value, item) => (
        <StatusBadge status={item.typeAr} />
      ),
    },
    {
      key: 'yearAr',
      labelAr: 'السنة',
      labelEn: 'Year',
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
          {isArabic ? 'إضافة قضية' : 'Add Case'}
        </Button>
        <div>
          <h1 className="text-heading-1 font-cairo font-bold text-gradient">
            {isArabic ? 'إدارة القضايا' : 'Manage Cases'}
          </h1>
          <p className="text-gray-400 font-cairo text-sm">
            {isArabic
              ? `إجمالي القضايا: ${cases.length}`
              : `Total Cases: ${cases.length}`}
          </p>
        </div>
      </motion.div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={cases}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add Case"
        titleAr="إضافة/تعديل قضية"
      >
        <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                {isArabic ? 'عنوان القضية (عربي)' : 'Case Title (Arabic)'}
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
                {isArabic ? 'عنوان القضية (إنجليزي)' : 'Case Title (English)'}
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
                {isArabic ? 'نوع القضية (عربي)' : 'Case Type (Arabic)'}
              </label>
              <input
                type="text"
                name="typeAr"
                value={formData.typeAr}
                onChange={handleChange}
                required
                placeholder="نزاعات تجارية"
                className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
              />
            </div>
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                {isArabic ? 'نوع القضية (إنجليزي)' : 'Case Type (English)'}
              </label>
              <input
                type="text"
                name="typeEn"
                value={formData.typeEn}
                onChange={handleChange}
                required
                placeholder="Commercial Disputes"
                className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                {isArabic ? 'النتيجة (عربي)' : 'Outcome (Arabic)'}
              </label>
              <textarea
                name="outcome"
                value={formData.outcome}
                onChange={handleChange}
                required
                rows={2}
                className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                {isArabic ? 'النتيجة (إنجليزي)' : 'Outcome (English)'}
              </label>
              <textarea
                name="outcomeEn"
                value={formData.outcomeEn}
                onChange={handleChange}
                required
                rows={2}
                className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right resize-none"
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