import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Plus, Edit2, Trash2, Eye } from 'lucide-react'
import Button from '@/components/ui/Button'
import Loading from '@/components/ui/Loading'
import Modal from '@/components/admin/Modal'
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal'
import { useLanguage } from '@/hooks/useLanguage'
import { useAddOffer, useDeleteOffer, useGetAllOffers, useGetOfferById, useUpdateOffer } from '@/hooks/offers'
import { Offer, OfferSubmitInput } from '@/types/offer'
import { toast } from 'sonner'

interface OpportunityFormData {
  nameAr: string
  nameEn: string
  description: string
  duration: string
  award: string
  salary: string
  location: string
  requirements: string
  jobType: string
}

const defaultFormData: OpportunityFormData = {
  nameAr: '',
  nameEn: '',
  description: '',
  duration: '',
  award: '',
  salary: '',
  location: '',
  requirements: '',
  jobType: '',
}

const FALLBACK_TEXT = 'غير محدد'

const normalizeText = (value?: string | null, fallback = FALLBACK_TEXT): string => {
  if (typeof value !== 'string') return fallback
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : fallback
}

const formatDuration = (value?: string | null): string => {
  const normalized = normalizeText(value)
  if (normalized === FALLBACK_TEXT) return normalized

  if (/[ء-ي]+\s*(شهر|أشهر|أسبوع|أسابيع|سنة|سنوات)|month|months|week|weeks|year|years/i.test(normalized)) {
    return normalized
  }

  const singleNumber = normalized.match(/^\d+$/)
  if (singleNumber) {
    const count = Number(singleNumber[0])
    if (Number.isFinite(count)) {
      return count === 1 ? '1 شهر' : `${count} أشهر`
    }
  }

  const range = normalized.match(/^(\d+)\s*[-–]\s*(\d+)$/)
  if (range) {
    return `${range[1]}-${range[2]} أشهر`
  }

  return normalized
}

const mapOfferToFormData = (offer: Offer): OpportunityFormData => ({
  nameAr: offer.nameAr,
  nameEn: offer.nameEn,
  description: offer.description,
  duration: offer.duration,
  award: offer.award,
  salary: offer.salary,
  location: offer.location,
  requirements: offer.requirements,
  jobType: offer.type === 'Training' ? '' : offer.type,
})

export default function AdminOpportunities() {
  const { isArabic } = useLanguage()
  const [activeTab, setActiveTab] = useState<'internships' | 'jobs'>('internships')
  const hiringAndTraning = activeTab === 'internships' ? 2 : 1
  const { data, isLoading, isFetching } = useGetAllOffers(hiringAndTraning)
  const addOfferMutation = useAddOffer()
  const updateOfferMutation = useUpdateOffer()
  const deleteOfferMutation = useDeleteOffer()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Offer | null>(null)
  const [detailsItemId, setDetailsItemId] = useState<string>('')
  const [itemToDelete, setItemToDelete] = useState<Offer | null>(null)
  const [formData, setFormData] = useState<OpportunityFormData>(defaultFormData)

  const {
    data: detailsResponse,
    isLoading: isDetailsLoading,
    isFetching: isDetailsFetching,
  } = useGetOfferById(detailsItemId, hiringAndTraning, isDetailsModalOpen && Boolean(detailsItemId))

  const detailsItem = detailsResponse?.data

  const offers = data?.data || []
  const internships = useMemo(() => offers, [offers])
  const jobs = useMemo(() => offers, [offers])

  const isPending =
    addOfferMutation.isPending ||
    updateOfferMutation.isPending ||
    deleteOfferMutation.isPending

  const validateFormData = (input: OpportunityFormData): string | null => {
    if (!input.nameAr.trim()) {
      return isArabic ? 'الاسم بالعربية مطلوب' : 'Arabic name is required'
    }
    if (!input.description.trim()) {
      return isArabic ? 'الوصف مطلوب' : 'Description is required'
    }
    if (activeTab === 'internships' && !input.duration.trim()) {
      return isArabic ? 'المدة مطلوبة للتدريب' : 'Duration is required for training'
    }
    if (activeTab === 'internships' && !input.award.trim()) {
      return isArabic ? 'المكافأة مطلوبة للتدريب' : 'Award is required for training'
    }
    if (activeTab === 'jobs' && !input.location.trim()) {
      return isArabic ? 'الموقع مطلوب للوظيفة' : 'Location is required for job'
    }
    if (activeTab === 'jobs' && !input.salary.trim()) {
      return isArabic ? 'الراتب مطلوب للوظيفة' : 'Salary is required for job'
    }
    if (activeTab === 'jobs' && !input.jobType.trim()) {
      return isArabic ? 'نوع الوظيفة مطلوب' : 'Job type is required'
    }
    return null
  }

  const toOfferPayload = (input: OpportunityFormData): OfferSubmitInput => ({
    nameAr: input.nameAr.trim(),
    nameEn: input.nameEn.trim(),
    description: input.description.trim(),
    duration: activeTab === 'internships' ? input.duration.trim() : '',
    award: activeTab === 'internships' ? input.award.trim() : '',
    salary: activeTab === 'jobs' ? input.salary.trim() : '',
    location: activeTab === 'jobs' ? input.location.trim() : '',
    requirements: input.requirements.trim(),
    type: activeTab === 'internships' ? 'Training' : input.jobType.trim(),
    hiringAndTraning: activeTab === 'internships' ? 2 : 1,
  })

  const handleOpenModal = (item?: Offer) => {
    if (item) {
      setEditingItem(item)
      setFormData(mapOfferToFormData(item))
    } else {
      setEditingItem(null)
      setFormData({
        ...defaultFormData,
        jobType: activeTab === 'jobs' ? 'Full Time' : '',
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    if (isPending) return
    setIsModalOpen(false)
    setEditingItem(null)
    setFormData({
      ...defaultFormData,
      jobType: activeTab === 'jobs' ? 'Full Time' : '',
    })
  }

  const handleOpenDetailsModal = (itemId: string) => {
    setDetailsItemId(itemId)
    setIsDetailsModalOpen(true)
  }

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false)
    setDetailsItemId('')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateFormData(formData)
    if (validationError) {
      toast.error(validationError)
      return
    }

    const payload = toOfferPayload(formData)

    if (editingItem) {
      await updateOfferMutation.mutateAsync({
        id: editingItem.id,
        payload,
      })
    } else {
      await addOfferMutation.mutateAsync(payload)
    }

    handleCloseModal()
  }

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return

    await deleteOfferMutation.mutateAsync(itemToDelete.id)

    setItemToDelete(null)
  }

  const items = activeTab === 'internships'
    ? internships.filter((item) => item.hiringAndTraning === 2)
    : jobs.filter((item) => item.hiringAndTraning === 1)

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
            {isArabic
              ? activeTab === 'internships'
                ? 'البرامج التدريبية'
                : 'الفرص الوظيفية'
              : activeTab === 'internships'
              ? 'Internships'
              : 'Job Opportunities'}
          </h1>
          <p className="text-gray-400 font-cairo text-sm">
            {isArabic
              ? `إجمالي ${activeTab === 'internships' ? 'البرامج' : 'الوظائف'}: ${items.length}`
              : `Total ${activeTab === 'internships' ? 'Internships' : 'Jobs'}: ${items.length}`}
          </p>
          {isFetching && (
            <p className="text-gray-500 font-cairo text-xs mt-1">
              {isArabic ? 'جاري تحديث البيانات...' : 'Refreshing data...'}
            </p>
          )}
        </div>
        <Button onClick={() => handleOpenModal()} variant="primary" size="lg" className="font-cairo flex-row-reverse ms-auto" disabled={isPending}>
          <Plus size={20} className="me-2" />
          {activeTab === 'internships'
            ? isArabic
              ? 'إضافة تدريب'
              : 'Add Internship'
            : isArabic
            ? 'إضافة وظيفة'
            : 'Add Job'}
        </Button>
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

      {isLoading && (
        <div className="mb-4 flex justify-end">
          <Loading inline message={isArabic ? 'جاري تحميل العروض...' : 'Loading offers...'} />
        </div>
      )}

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
                    {normalizeText(isArabic ? item.nameAr : item.nameEn || item.nameAr)}
                  </h3>
                  <p className="text-gray-300 font-cairo mb-2">
                    {normalizeText(item.description)}
                  </p>
                  <p className="text-gray-400 font-cairo text-sm mb-2">
                    {isArabic ? 'الموقع:' : 'Location:'} {normalizeText(item.location)}
                  </p>
                  {item.isActive !== false && (
                    <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded text-xs font-cairo font-semibold">
                      ✓ {isArabic ? 'نشط' : 'Active'}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleOpenDetailsModal(item.id)} className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30">
                    <Eye size={18} />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleOpenModal(item)} disabled={isPending} className="p-2 bg-gold/20 text-gold rounded-lg hover:bg-gold/30 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Edit2 size={18} />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} onClick={() => setItemToDelete(item)} disabled={isPending} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Trash2 size={18} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      <DeleteConfirmModal
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteConfirm}
        titleAr={isArabic ? (activeTab === 'internships' ? 'حذف التدريب' : 'حذف الوظيفة') : undefined}
        titleEn={activeTab === 'internships' ? 'Delete Internship' : 'Delete Job'}
        itemLabel={
          itemToDelete
            ? isArabic
              ? itemToDelete.nameAr
              : itemToDelete.nameEn || itemToDelete.nameAr
            : undefined
        }
      />

      <Modal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        title={activeTab === 'internships' ? 'Training Details' : 'Job Details'}
        titleAr={activeTab === 'internships' ? 'تفاصيل التدريب' : 'تفاصيل الوظيفة'}
      >
        <div className="space-y-4 text-right" dir="rtl">
          {(isDetailsLoading || isDetailsFetching) && (
            <div className="flex justify-end">
              <Loading inline message={isArabic ? 'جاري تحميل التفاصيل...' : 'Loading details...'} />
            </div>
          )}

          {!isDetailsLoading && !isDetailsFetching && detailsItem && (
            <>
              <div>
                <p className="text-xs text-gray-400 font-cairo mb-1">{isArabic ? 'العنوان' : 'Title'}</p>
                <p className="text-gold font-cairo font-semibold">{normalizeText(isArabic ? detailsItem.nameAr : detailsItem.nameEn || detailsItem.nameAr)}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-cairo mb-1">{isArabic ? 'الوصف' : 'Description'}</p>
                <p className="text-gray-200 font-cairo">{normalizeText(detailsItem.description)}</p>
              </div>

              {activeTab === 'internships' ? (
                <>
                  <div>
                    <p className="text-xs text-gray-400 font-cairo mb-1">{isArabic ? 'المدة' : 'Duration'}</p>
                    <p className="text-gray-200 font-cairo">{formatDuration(detailsItem.duration)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-cairo mb-1">{isArabic ? 'المكافأة' : 'Award'}</p>
                    <p className="text-gray-200 font-cairo">{normalizeText(detailsItem.award)}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-xs text-gray-400 font-cairo mb-1">{isArabic ? 'الراتب' : 'Salary'}</p>
                    <p className="text-gray-200 font-cairo">{normalizeText(detailsItem.salary)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-cairo mb-1">{isArabic ? 'نوع الوظيفة' : 'Job Type'}</p>
                    <p className="text-gray-200 font-cairo">{normalizeText(detailsItem.type)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-cairo mb-1">{isArabic ? 'الموقع' : 'Location'}</p>
                    <p className="text-gray-200 font-cairo">{normalizeText(detailsItem.location)}</p>
                  </div>
                </>
              )}

              <div>
                <p className="text-xs text-gray-400 font-cairo mb-1">{isArabic ? 'المتطلبات' : 'Requirements'}</p>
                <p className="text-gray-200 font-cairo whitespace-pre-line">{normalizeText(detailsItem.requirements)}</p>
              </div>
            </>
          )}

          {!isDetailsLoading && !isDetailsFetching && !detailsItem && (
            <p className="text-gray-400 font-cairo text-sm">
              {isArabic ? 'لا توجد تفاصيل متاحة' : 'No details available'}
            </p>
          )}
        </div>
      </Modal>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? (activeTab === 'internships' ? 'Edit Internship' : 'Edit Job') : (activeTab === 'internships' ? 'Add Internship' : 'Add Job')}
        titleAr={activeTab === 'internships' ? 'إضافة/تعديل تدريب' : 'إضافة/تعديل وظيفة'}
      >
        <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
          {/* Common Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">{isArabic ? 'العنوان بالعربية' : 'Title (Arabic)'}</label>
              <input type="text" name="nameAr" value={formData.nameAr} onChange={handleChange} required className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right" />
            </div>
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">{isArabic ? 'العنوان بالإنجليزية' : 'Title (English)'}</label>
              <input type="text" name="nameEn" value={formData.nameEn} onChange={handleChange} className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">{isArabic ? 'الوصف' : 'Description'}</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} required className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right resize-none" />
          </div>

          <div>
            <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">{isArabic ? 'المتطلبات' : 'Requirements'}</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right resize-none"
              placeholder={isArabic ? 'كل متطلب في سطر منفصل' : 'Write each requirement on a new line'}
            />
          </div>

          {/* Internship Fields */}
          {activeTab === 'internships' && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">{isArabic ? 'المدة' : 'Duration'}</label>
                <input type="text" name="duration" value={formData.duration} onChange={handleChange} required className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right" />
              </div>
              <div>
                <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">{isArabic ? 'المكافأة' : 'Stipend'}</label>
                <input type="text" name="award" value={formData.award} onChange={handleChange} required className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right" />
              </div>
            </div>
          )}

          {/* Job Fields */}
          {activeTab === 'jobs' && (
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">{isArabic ? 'الراتب' : 'Salary'}</label>
                <input type="text" name="salary" value={formData.salary} onChange={handleChange} required className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right" />
              </div>
              <div>
                <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">{isArabic ? 'الموقع' : 'Location'}</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right" />
              </div>
              <div>
                <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">{isArabic ? 'النوع' : 'Type'}</label>
                <input type="text" name="jobType" value={formData.jobType} onChange={handleChange} required className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right" placeholder={isArabic ? 'مثال: دوام كامل' : 'Example: Full Time'} />
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button type="submit" variant="primary" className="flex-1 font-cairo" isLoading={addOfferMutation.isPending || updateOfferMutation.isPending} disabled={isPending}>{isArabic ? 'حفظ' : 'Save'}</Button>
            <Button type="button" variant="secondary" onClick={handleCloseModal} className="flex-1 font-cairo" disabled={isPending}>{isArabic ? 'إلغاء' : 'Cancel'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}