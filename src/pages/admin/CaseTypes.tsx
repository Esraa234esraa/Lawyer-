import { motion } from 'framer-motion'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import Button from '@/components/ui/Button'
import DataTable, { Column } from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'
import { useAdminStore, CaseType, Case } from '@/store/adminStore'
import { toast } from 'sonner'

export default function CaseTypes() {
  const { caseTypes, addCaseType, updateCaseType, deleteCaseType, cases } = useAdminStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [selectedType, setSelectedType] = useState<number | null>(null)
  const [formData, setFormData] = useState<Omit<CaseType, 'id'>>({
    nameAr: '',
  })

  const handleOpenModal = (caseType?: CaseType) => {
    if (caseType) {
      setFormData({
        nameAr: caseType.nameAr,
      })
      setEditingId(caseType.id)
    } else {
      setFormData({
        nameAr: '',
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
    e: React.ChangeEvent<HTMLInputElement>
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
      updateCaseType(editingId, formData)
      toast.success('تم تحديث نوع القضية')
    } else {
      addCaseType(formData)
      toast.success('تمت إضافة نوع القضية')
    }

    handleCloseModal()
  }

  const handleDelete = (caseType: CaseType) => {
    deleteCaseType(caseType.id)
    toast.success('تم حذف نوع القضية')
  }

  const getCasesForType = (typeId: number) => {
    return cases.filter((c: Case) => c.typeArId === typeId)
  }

  const columns: Column<CaseType>[] = [
    {
      key: 'nameAr',
      labelAr: 'اسم النوع',
      labelEn: 'Type Name',
      render: (_value, item) => (
        <button
          type="button"
          onClick={() => setSelectedType(item.id)}
          className="font-cairo text-white hover:text-gold transition-colors"
        >
          {item.nameAr}
        </button>
      ),
    },
    {
      key: 'id',
      labelAr: 'عدد القضايا',
      labelEn: 'Cases Count',
      render: (_value, item) => (
        <button
          type="button"
          onClick={() => setSelectedType(item.id)}
          className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-gold/10 text-gold font-cairo text-sm hover:bg-gold/20 transition-colors"
        >
          {getCasesForType(item.id).length}
        </button>
      ),
    },
  ]

  const selectedTypeCases = selectedType ? getCasesForType(selectedType) : []

  const casesColumns: Column<Case>[] = [
    {
      key: 'titleAr',
      labelAr: 'عنوان القضية',
      labelEn: 'Case Title',
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
            إدارة أنواع القضايا
          </h1>
          <p className="text-gray-400 font-cairo text-sm">
            إجمالي الأنواع: {caseTypes.length}
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          variant="primary"
          size="lg"
          className="font-cairo flex-row-reverse ms-auto"
        >
          <Plus size={20} className="me-2" />
          إضافة نوع
        </Button>
      </motion.div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Types Table */}
        <div className="lg:col-span-1">
          <DataTable
            columns={columns}
            data={caseTypes}
            onView={(caseType) => setSelectedType(caseType.id)}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
            deleteTitleAr="حذف النوع"
            deleteTitleEn="Delete Type"
            getDeleteLabel={(caseType) => caseType.nameAr}
            actions={true}
          />
        </div>

        {/* Cases for Selected Type */}
        {selectedType && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedType(null)}
                  className="text-gold hover:text-gold-light transition-colors font-cairo text-sm"
                >
                  ← رجوع
                </button>
                <h2 className="text-heading-2 font-cairo font-bold text-gradient">
                  {caseTypes.find(t => t.id === selectedType)?.nameAr}
                </h2>
              </div>
              <p className="text-gray-400 font-cairo text-sm mt-2">
                عدد القضايا: {selectedTypeCases.length}
              </p>
            </div>
            
            {selectedTypeCases.length > 0 ? (
              <DataTable
                columns={casesColumns}
                data={selectedTypeCases}
                actions={false}
              />
            ) : (
              <div className="border border-gold/20 rounded-lg p-8 text-center">
                <p className="text-gray-400 font-cairo">
                  لا توجد قضايا من هذا النوع حالياً
                </p>
              </div>
            )}
          </motion.div>
        )}

        {!selectedType && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="border-2 border-dashed border-gold/20 rounded-lg p-12 text-center">
              <p className="text-gray-400 font-cairo text-lg">
                اختر نوع القضية لعرض القضايا المرتبطة بها
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add Case Type"
        titleAr="إضافة/تعديل نوع قضية"
      >
        <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
          <div>
            <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
              اسم النوع
            </label>
            <input
              type="text"
              name="nameAr"
              value={formData.nameAr}
              onChange={handleChange}
              required
              placeholder="مثال: نزاعات تجارية"
              className="w-full px-4 py-2 rounded border border-gold/30 bg-charcoal text-white font-cairo focus:border-gold outline-none transition-colors"
            />
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
    </div>
  )
}
