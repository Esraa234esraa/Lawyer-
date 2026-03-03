import { motion } from 'framer-motion'
import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import Modal from '@/components/admin/Modal'
import { useLanguage } from '@/hooks/useLanguage'
import { useAdminStore, Internship, Job } from '@/store/adminStore'
import { toast } from 'sonner'

// Union type مع حقل kind لتسهيل type narrowing
type OpportunityFormData =
  | (Partial<Internship> & { kind: 'internship' })
  | (Partial<Job> & { kind: 'job' })

export default function AdminOpportunities() {
  const { isArabic } = useLanguage()
  const {
    internships,
    jobs,
    addInternship,
    updateInternship,
    deleteInternship,
    addJob,
    updateJob,
    deleteJob,
  } = useAdminStore()

  const [activeTab, setActiveTab] = useState<'internships' | 'jobs'>('internships')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<OpportunityFormData>({ kind: 'internship' })

  const handleOpenModal = (item?: Internship | Job) => {
    if (activeTab === 'internships') {
      if (item && 'duration' in item) {
        setFormData({ ...item, kind: 'internship' })
        setEditingId(item.id)
      } else {
        setFormData({ kind: 'internship' })
        setEditingId(null)
      }
    } else {
      if (item && 'salary' in item) {
        setFormData({ ...item, kind: 'job' })
        setEditingId(item.id)
      } else {
        setFormData({ kind: 'job' })
        setEditingId(null)
      }
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
    setFormData(activeTab === 'internships' ? { kind: 'internship' } : { kind: 'job' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (activeTab === 'internships') {
      if (editingId && formData.kind === 'internship') {
        updateInternship(editingId, formData)
        toast.success(isArabic ? 'تم تحديث التدريب' : 'Internship updated')
      } else if (formData.kind === 'internship') {
        addInternship({
          titleAr: formData.titleAr || '',
          titleEn: formData.titleEn || '',
          descriptionAr: formData.descriptionAr || '',
          descriptionEn: formData.descriptionEn || '',
          detailsAr: formData.detailsAr || '',
          detailsEn: formData.detailsEn || '',
          requirements: [],
          duration: formData.duration || '',
          stipend: formData.stipend || '',
          createdAt: new Date().toISOString().split('T')[0],
          status: 'active',
        })
        toast.success(isArabic ? 'تم إضافة التدريب' : 'Internship added')
      }
    } else {
      if (editingId && formData.kind === 'job') {
        updateJob(editingId, formData)
        toast.success(isArabic ? 'تم تحديث الوظيفة' : 'Job updated')
      } else if (formData.kind === 'job') {
        addJob({
          titleAr: formData.titleAr || '',
          titleEn: formData.titleEn || '',
          descriptionAr: formData.descriptionAr || '',
          descriptionEn: formData.descriptionEn || '',
          detailsAr: formData.detailsAr || '',
          detailsEn: formData.detailsEn || '',
          requirements: [],
          salary: formData.salary || '',
          location: formData.location || '',
          type: formData.type || '',
          createdAt: new Date().toISOString().split('T')[0],
          status: 'active',
        })
        toast.success(isArabic ? 'تم إضافة الوظيفة' : 'Job added')
      }
    }

    handleCloseModal()
  }

  const handleDelete = (id: number) => {
    if (confirm(isArabic ? 'هل تريد الحذف؟' : 'Are you sure?')) {
      if (activeTab === 'internships') {
        deleteInternship(id)
        toast.success(isArabic ? 'تم حذف التدريب' : 'Internship deleted')
      } else {
        deleteJob(id)
        toast.success(isArabic ? 'تم حذف الوظيفة' : 'Job deleted')
      }
    }
  }

  const items = activeTab === 'internships' ? internships : jobs

  return (
    <div dir="rtl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8"
      >
        <Button onClick={() => handleOpenModal()} variant="primary" size="lg" className="font-cairo flex-row-reverse">
          <Plus size={20} className="me-2" />
          {activeTab === 'internships'
            ? isArabic
              ? 'إضافة تدريب'
              : 'Add Internship'
            : isArabic
            ? 'إضافة وظيفة'
            : 'Add Job'}
        </Button>
        <div>
          <h1 className="text-heading-1 font-cairo font-bold text-gradient">
            {activeTab === 'internships'
              ? isArabic
                ? 'إدارة التدريبات'
                : 'Manage Internships'
              : isArabic
              ? 'إدارة الوظائف'
              : 'Manage Jobs'}
          </h1>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 flex-row-reverse">
        <button
          onClick={() => setActiveTab('internships')}
          className={`px-6 py-3 rounded-lg font-cairo font-semibold transition-all ${
            activeTab === 'internships'
              ? 'bg-gold text-primary-black'
              : 'bg-charcoal border border-gold/20 text-gold hover:border-gold'
          }`}
        >
          {isArabic ? 'التدريبات' : 'Internships'}
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-6 py-3 rounded-lg font-cairo font-semibold transition-all ${
            activeTab === 'jobs'
              ? 'bg-gold text-primary-black'
              : 'bg-charcoal border border-gold/20 text-gold hover:border-gold'
          }`}
        >
          {isArabic ? 'الوظائف' : 'Jobs'}
        </button>
      </div>

      {/* Items List */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-12 bg-charcoal border border-gold/20 rounded-lg">
            <p className="text-gray-400 font-cairo">{isArabic ? 'لا توجد عناصر' : 'No items'}</p>
          </div>
        ) : (
          items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="p-6 bg-charcoal border border-gold/20 rounded-lg hover:border-gold/50 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 text-right">
                  <h3 className="text-heading-3 font-cairo font-bold text-gold mb-2">
                    {isArabic ? item.titleAr : item.titleEn}
                  </h3>
                  <p className="text-gray-300 font-cairo mb-2">
                    {isArabic ? item.descriptionAr : item.descriptionEn}
                  </p>
                  {item.status === 'active' && (
                    <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded text-xs font-cairo font-semibold">
                      ✓ {isArabic ? 'نشط' : 'Active'}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleOpenModal(item)} className="p-2 bg-gold/20 text-gold rounded-lg hover:bg-gold/30">
                    <Edit2 size={18} />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleDelete(item.id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30">
                    <Trash2 size={18} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={activeTab === 'internships' ? 'Add Internship' : 'Add Job'}
        titleAr={activeTab === 'internships' ? 'إضافة/تعديل تدريب' : 'إضافة/تعديل وظيفة'}
      >
        <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
          {/* Common Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">{isArabic ? 'العنوان بالعربية' : 'Title (Arabic)'}</label>
              <input type="text" name="titleAr" value={formData.titleAr || ''} onChange={handleChange} required className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right" />
            </div>
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">{isArabic ? 'العنوان بالإنجليزية' : 'Title (English)'}</label>
              <input type="text" name="titleEn" value={formData.titleEn || ''} onChange={handleChange} required className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">{isArabic ? 'الوصف' : 'Description'}</label>
            <textarea name="descriptionAr" value={formData.descriptionAr || ''} onChange={handleChange} rows={3} className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right resize-none" />
          </div>

          {/* Internship Fields */}
          {activeTab === 'internships' && formData.kind === 'internship' && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">{isArabic ? 'المدة' : 'Duration'}</label>
                <input type="text" name="duration" value={formData.duration || ''} onChange={handleChange} className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right" />
              </div>
              <div>
                <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">{isArabic ? 'المكافأة' : 'Stipend'}</label>
                <input type="text" name="stipend" value={formData.stipend || ''} onChange={handleChange} className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right" />
              </div>
            </div>
          )}

          {/* Job Fields */}
          {activeTab === 'jobs' && formData.kind === 'job' && (
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">{isArabic ? 'الراتب' : 'Salary'}</label>
                <input type="text" name="salary" value={formData.salary || ''} onChange={handleChange} className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right" />
              </div>
              <div>
                <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">{isArabic ? 'الموقع' : 'Location'}</label>
                <input type="text" name="location" value={formData.location || ''} onChange={handleChange} className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right" />
              </div>
              <div>
                <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">{isArabic ? 'النوع' : 'Type'}</label>
                <input type="text" name="type" value={formData.type || ''} onChange={handleChange} className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right" />
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button type="submit" variant="primary" className="flex-1 font-cairo">{isArabic ? 'حفظ' : 'Save'}</Button>
            <Button type="button" variant="secondary" onClick={handleCloseModal} className="flex-1 font-cairo">{isArabic ? 'إلغاء' : 'Cancel'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}