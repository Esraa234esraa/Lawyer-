import { motion } from 'framer-motion'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import Button from '@/components/ui/Button'
import DataTable, { Column } from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'
import StatusBadge from '@/components/admin/StatusBadge'
import { useLanguage } from '@/hooks/useLanguage'
import { useAdminStore, Client } from '@/store/adminStore'
import { toast } from 'sonner'

export default function AdminClients() {
  const { isArabic } = useLanguage()
  const { clients, addClient, updateClient, deleteClient } = useAdminStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Omit<Client, 'id'>>({
    nameAr: '',
    nameEn: '',
    email: '',
    phone: '',
    caseType: '',
    status: 'active',
    joinDate: new Date().toISOString().split('T')[0],
    avatar: '',
  })

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setFormData({
        nameAr: client.nameAr,
        nameEn: client.nameEn,
        email: client.email,
        phone: client.phone,
        caseType: client.caseType,
        status: client.status,
        joinDate: client.joinDate,
        avatar: client.avatar,
      })
      setEditingId(client.id)
    } else {
      setFormData({
        nameAr: '',
        nameEn: '',
        email: '',
        phone: '',
        caseType: '',
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        avatar: '',
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      updateClient(editingId, formData)
      toast.success(isArabic ? 'تم تحديث بيانات العميل' : 'Client updated')
    } else {
      addClient(formData)
      toast.success(isArabic ? 'تمت إضافة عميل جديد' : 'Client added')
    }

    handleCloseModal()
  }

  const handleDelete = (client: Client) => {
    if (confirm(isArabic ? 'هل تريد حذف هذا العميل؟' : 'Are you sure?')) {
      deleteClient(client.id)
      toast.success(isArabic ? 'تم حذف العميل' : 'Client deleted')
    }
  }

  const columns: Column<Client>[] = [
    {
      key: 'nameAr',
      labelAr: 'الاسم',
      labelEn: 'Name',
      render: (_value, item) => isArabic ? item.nameAr : item.nameEn,
    },
    {
      key: 'email',
      labelAr: 'البريد الإلكتروني',
      labelEn: 'Email',
    },
    {
      key: 'phone',
      labelAr: 'الهاتف',
      labelEn: 'Phone',
    },
    {
      key: 'caseType',
      labelAr: 'نوع القضية',
      labelEn: 'Case Type',
    },
    {
      key: 'status',
      labelAr: 'الحالة',
      labelEn: 'Status',
      render: (value) => <StatusBadge status={value} />,
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
          {isArabic ? 'إضافة عميل' : 'Add Client'}
        </Button>
        <div>
          <h1 className="text-heading-1 font-cairo font-bold text-gradient">
            {isArabic ? 'ملفات العملاء' : 'Client Files'}
          </h1>
          <p className="text-gray-400 font-cairo text-sm">
            {isArabic
              ? `إجمالي العملاء: ${clients.length}`
              : `Total Clients: ${clients.length}`}
          </p>
        </div>
      </motion.div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={clients}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add Client"
        titleAr="إضافة/تعديل عميل"
      >
        <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                {isArabic ? 'الاسم (عربي)' : 'Name (Arabic)'}
              </label>
              <input
                type="text"
                name="nameAr"
                value={formData.nameAr}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
              />
            </div>
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                {isArabic ? 'الاسم (إنجليزي)' : 'Name (English)'}
              </label>
              <input
                type="text"
                name="nameEn"
                value={formData.nameEn}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                {isArabic ? 'البريد الإلك��روني' : 'Email'}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
              />
            </div>
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                {isArabic ? 'الهاتف' : 'Phone'}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                {isArabic ? 'نوع القضية' : 'Case Type'}
              </label>
              <input
                type="text"
                name="caseType"
                value={formData.caseType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
              />
            </div>
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                {isArabic ? 'الحالة' : 'Status'}
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
              >
                <option value="active">{isArabic ? 'نشط' : 'Active'}</option>
                <option value="inactive">{isArabic ? 'غير نشط' : 'Inactive'}</option>
                <option value="completed">{isArabic ? 'مكتمل' : 'Completed'}</option>
              </select>
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