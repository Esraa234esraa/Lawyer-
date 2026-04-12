import { motion } from 'framer-motion'
import { useState } from 'react'
import { Plus, FileUp, Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import DataTable, { Column } from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'
import { useLanguage } from '@/hooks/useLanguage'
import { useAdminStore, Case, CaseAttachment } from '@/store/adminStore'
import { toast } from 'sonner'

export default function AdminCases() {
  const { isArabic } = useLanguage()
  const { cases, addCase, updateCase, deleteCase, caseTypes, clients } = useAdminStore()
  const clientOptions = clients.length > 0 ? clients : [{ id: 2, nameAr: 'العميل الافتراضي' }]
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const [attachments, setAttachments] = useState<CaseAttachment[]>([])
  const [formData, setFormData] = useState<Omit<Case, 'id'>>({
    titleAr: '',
    descriptionAr: '',
    plaintiffAr: '',
    defendantAr: '',
    clientId: clientOptions[0].id,
    typeArId: caseTypes[0]?.id || 1,
    yearAr: new Date().getFullYear().toString(),
    statusAr: 'قيد العمل',
    image: '',
    attachments: [],
  })

  const handleOpenModal = (caseItem?: Case) => {
    if (caseItem) {
      setFormData({
        titleAr: caseItem.titleAr,
        descriptionAr: caseItem.descriptionAr,
        plaintiffAr: caseItem.plaintiffAr,
        defendantAr: caseItem.defendantAr,
        clientId: caseItem.clientId,
        typeArId: caseItem.typeArId,
        yearAr: caseItem.yearAr,
        statusAr: caseItem.statusAr,
        image: caseItem.image,
        attachments: caseItem.attachments,
      })
      setAttachments(caseItem.attachments)
      setEditingId(caseItem.id)
    } else {
      setFormData({
        titleAr: '',
        descriptionAr: '',
        plaintiffAr: '',
        defendantAr: '',
        clientId: clientOptions[0].id,
        typeArId: caseTypes[0]?.id || 1,
        yearAr: new Date().getFullYear().toString(),
        statusAr: 'قيد العمل',
        image: '',
        attachments: [],
      })
      setAttachments([])
      setEditingId(null)
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
    setAttachments([])
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'typeArId' || name === 'clientId' ? parseInt(value) : value,
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        const newAttachment: CaseAttachment = {
          id: `att-${Date.now()}-${Math.random()}`,
          nameAr: prompt('أدخل اسم المرفق:') || file.name,
          fileName: file.name,
          fileSize: file.size,
          uploadedAt: new Date().toISOString().split('T')[0],
          dataUrl: typeof reader.result === 'string' ? reader.result : undefined,
          fileType: file.type,
        }
        setAttachments((prev) => [...prev, newAttachment])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemoveAttachment = (attachmentId: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== attachmentId))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const dataToSave = {
      ...formData,
      attachments,
    }

    if (editingId) {
      updateCase(editingId, dataToSave)
      toast.success('تم تحديث القضية')
    } else {
      addCase(dataToSave)
      toast.success('تمت إضافة القضية')
    }

    handleCloseModal()
  }

  const handleDelete = (caseItem: Case) => {
    deleteCase(caseItem.id)
    toast.success('تم حذف القضية')
  }

  const handleView = (caseItem: Case) => {
    setSelectedCase(caseItem)
    setIsDetailsOpen(true)
  }

  const getCaseTypeName = (typeArId: number) => {
    return caseTypes.find(t => t.id === typeArId)?.nameAr || 'غير محدد'
  }

  const getClientName = (clientId: number) => {
    return clients.find(c => c.id === clientId)?.nameAr || 'غير محدد'
  }

  const handleOpenAttachment = (url?: string) => {
    if (!url) return
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleDownloadAttachment = (url: string | undefined, fileName: string) => {
    if (!url) return
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const columns: Column<Case>[] = [
    {
      key: 'titleAr',
      labelAr: 'الاسم',
      labelEn: 'Title',
      render: (_value, item) => item.titleAr,
    },
    {
      key: 'plaintiffAr',
      labelAr: 'المدعي',
      labelEn: 'Plaintiff',
      render: (_value, item) => item.plaintiffAr,
    },
    {
      key: 'defendantAr',
      labelAr: 'المدعي عليه',
      labelEn: 'Defendant',
      render: (_value, item) => item.defendantAr,
    },
    {
      key: 'clientId',
      labelAr: 'العميل',
      labelEn: 'Client',
      render: (_value, item) => getClientName(item.clientId),
    },
    {
      key: 'typeArId',
      labelAr: 'النوع',
      labelEn: 'Type',
      render: (_value, item) => getCaseTypeName(item.typeArId),
    },
    {
      key: 'statusAr',
      labelAr: 'الحالة',
      labelEn: 'Status',
      render: (value) => (
        <span className={`px-3 py-1 rounded-full text-sm font-cairo ${
          value === 'منتهية' ? 'bg-green-500/20 text-green-300' :
          value === 'قيد العمل' ? 'bg-blue-500/20 text-blue-300' :
          value === 'عاجلة' ? 'bg-red-500/20 text-red-300' :
          value === 'مغلقة' ? 'bg-purple-500/20 text-purple-300' :
          'bg-gray-500/20 text-gray-300'
        }`}>
          {value}
        </span>
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
        className="flex items-center gap-4 mb-8"
      >
        <div>
          <h1 className="text-heading-1 font-cairo font-bold text-gradient">
            إدارة القضايا
          </h1>
          <p className="text-gray-400 font-cairo text-sm">
            إجمالي القضايا: {cases.length}
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          variant="primary"
          size="lg"
          className="font-cairo flex-row-reverse ms-auto"
        >
          <Plus size={20} className="me-2" />
          إضافة قضية
        </Button>
      </motion.div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={cases}
        onView={handleView}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        deleteTitleAr="حذف القضية"
        deleteTitleEn="Delete Case"
        getDeleteLabel={(caseItem) => caseItem.titleAr}
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add Case"
        titleAr="إضافة/تعديل قضية"
      >
        <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
          <div>
            <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
              عنوان القضية
            </label>
            <input
              type="text"
              name="titleAr"
              value={formData.titleAr}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded border border-gold/30 bg-charcoal text-white font-cairo focus:border-gold outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
              الوصف
            </label>
            <textarea
              name="descriptionAr"
              value={formData.descriptionAr}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 rounded border border-gold/30 bg-charcoal text-white font-cairo focus:border-gold outline-none transition-colors resize-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                المدعي
              </label>
              <input
                type="text"
                name="plaintiffAr"
                value={formData.plaintiffAr}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded border border-gold/30 bg-charcoal text-white font-cairo focus:border-gold outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                المدعي عليه
              </label>
              <input
                type="text"
                name="defendantAr"
                value={formData.defendantAr}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded border border-gold/30 bg-charcoal text-white font-cairo focus:border-gold outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                العميل
              </label>
              <select
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded border border-gold/30 bg-charcoal text-white font-cairo focus:border-gold outline-none transition-colors"
              >
                {clientOptions.map(client => (
                  <option key={client.id} value={client.id}>{client.nameAr}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                نوع القضية
              </label>
              <select
                name="typeArId"
                value={formData.typeArId}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded border border-gold/30 bg-charcoal text-white font-cairo focus:border-gold outline-none transition-colors"
              >
                {caseTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.nameAr}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                الحالة
              </label>
              <select
                name="statusAr"
                value={formData.statusAr}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded border border-gold/30 bg-charcoal text-white font-cairo focus:border-gold outline-none transition-colors"
              >
                <option value="لم تبدأ">لم تبدأ</option>
                <option value="قيد العمل">قيد العمل</option>
                <option value="عاجلة">عاجلة</option>
                <option value="مغلقة">مغلقة</option>
                <option value="منتهية">منتهية</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                السنة
              </label>
              <input
                type="text"
                name="yearAr"
                value={formData.yearAr}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded border border-gold/30 bg-charcoal text-white font-cairo focus:border-gold outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                رابط الصورة
              </label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded border border-gold/30 bg-charcoal text-white font-cairo focus:border-gold outline-none transition-colors"
              />
            </div>
          </div>

          {/* Attachments Section */}
          <div>
            <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
              مرفقات القضية
            </label>
            
            {/* Upload Area */}
            <div className="mb-4">
              <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gold/30 rounded-lg hover:border-gold cursor-pointer transition-colors">
                <div className="flex flex-col items-center justify-center pt-2 pb-2">
                  <FileUp size={24} className="text-gold mb-2" />
                  <p className="text-sm font-cairo text-gold">اضغط لرفع ملفات</p>
                </div>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Attachments List */}
            {attachments.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-3 bg-charcoal/50 rounded border border-gold/20"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-cairo text-white">{attachment.nameAr}</p>
                      <p className="text-xs text-gray-400">
                        {(attachment.fileSize / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(attachment.id)}
                      className="p-1 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-6 py-2 rounded border border-gold/30 text-gray-300 font-cairo hover:border-gold transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded bg-gradient-to-r from-gold to-gold-light text-primary-black font-cairo font-semibold hover:opacity-90 transition-opacity"
            >
              {editingId ? 'تحديث' : 'إضافة'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Case Details"
        titleAr="تفاصيل القضية"
      >
        {selectedCase && (
          <div className="space-y-5 text-right font-cairo" dir="rtl">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">عنوان القضية</p>
                <p className="text-white">{selectedCase.titleAr}</p>
              </div>
              <div>
                <p className="text-gray-400">نوع القضية</p>
                <p className="text-white">{getCaseTypeName(selectedCase.typeArId)}</p>
              </div>
              <div>
                <p className="text-gray-400">العميل</p>
                <p className="text-white">{getClientName(selectedCase.clientId)}</p>
              </div>
              <div>
                <p className="text-gray-400">السنة</p>
                <p className="text-white">{selectedCase.yearAr}</p>
              </div>
              <div>
                <p className="text-gray-400">المدعي</p>
                <p className="text-white">{selectedCase.plaintiffAr}</p>
              </div>
              <div>
                <p className="text-gray-400">المدعي عليه</p>
                <p className="text-white">{selectedCase.defendantAr}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-400">الحالة</p>
                <p className="text-white">{selectedCase.statusAr}</p>
              </div>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-2">الوصف</p>
              <p className="text-white leading-7">{selectedCase.descriptionAr || 'لا يوجد وصف'}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-2">صورة القضية</p>
              {selectedCase.image ? (
                <a
                  href={selectedCase.image}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-lg overflow-hidden border border-gold/20"
                >
                  <img
                    src={selectedCase.image}
                    alt={selectedCase.titleAr}
                    className="w-full max-h-72 object-cover"
                  />
                </a>
              ) : (
                <p className="text-gray-300">لا توجد صورة</p>
              )}
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-2">مرفقات القضية</p>
              {selectedCase.attachments?.length ? (
                <div className="space-y-2">
                  {selectedCase.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gold/20 bg-black/20"
                    >
                      <div className="text-right flex-1">
                        <p className="text-white text-sm">{attachment.nameAr}</p>
                        <p className="text-gray-500 text-xs">{attachment.fileName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenAttachment(attachment.dataUrl)}
                          disabled={!attachment.dataUrl}
                          className="px-2 py-1 rounded-md bg-gold/15 text-gold text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          فتح
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadAttachment(attachment.dataUrl, attachment.fileName)}
                          disabled={!attachment.dataUrl}
                          className="px-2 py-1 rounded-md bg-blue-500/15 text-blue-300 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          تحميل
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-300">لا توجد مرفقات</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}