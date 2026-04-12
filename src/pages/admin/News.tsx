import { motion } from 'framer-motion'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import Button from '@/components/ui/Button'
import DataTable, { Column } from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'
import { useLanguage } from '@/hooks/useLanguage'
import { useAdminStore, News } from '@/store/adminStore'
import { toast } from 'sonner'
import { formatDate } from '@/utils/data'

export default function AdminNews() {
  const { isArabic } = useLanguage()
  const { news, addNews, updateNews, deleteNews } = useAdminStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Omit<News, 'id'>>({
    titleAr: '',
    titleEn: '',
    descriptionAr: '',
    descriptionEn: '',
    content: '',
    contentEn: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    categoryEn: '',
    image: '',
    author: '',
    authorEn: '',
  })

  const handleOpenModal = (newsItem?: News) => {
    if (newsItem) {
      setFormData({
        titleAr: newsItem.titleAr,
        titleEn: newsItem.titleEn,
        descriptionAr: newsItem.descriptionAr,
        descriptionEn: newsItem.descriptionEn,
        content: newsItem.content,
        contentEn: newsItem.contentEn,
        date: newsItem.date,
        category: newsItem.category,
        categoryEn: newsItem.categoryEn,
        image: newsItem.image,
        author: newsItem.author,
        authorEn: newsItem.authorEn,
      })
      setEditingId(newsItem.id)
    } else {
      setFormData({
        titleAr: '',
        titleEn: '',
        descriptionAr: '',
        descriptionEn: '',
        content: '',
        contentEn: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        categoryEn: '',
        image: '',
        author: '',
        authorEn: '',
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
      updateNews(editingId, formData)
      toast.success(isArabic ? 'تم تحديث الخبر' : 'News updated')
    } else {
      addNews(formData)
      toast.success(isArabic ? 'تمت إضافة الخبر' : 'News added')
    }

    handleCloseModal()
  }

  const handleDelete = (newsItem: News) => {
    deleteNews(newsItem.id)
    toast.success(isArabic ? 'تم حذف الخبر' : 'News deleted')
  }

  const columns: Column<News>[] = [
    {
      key: 'titleAr',
      labelAr: 'العنوان',
      labelEn: 'Title',
      render: (_value, item) => isArabic ? item.titleAr : item.titleEn,
    },
    {
      key: 'category',
      labelAr: 'الفئة',
      labelEn: 'Category',
      render: (_value, item) => isArabic ? item.category : item.categoryEn,
    },
    {
      key: 'date',
      labelAr: 'التاريخ',
      labelEn: 'Date',
      render: (value) => formatDate(value),
    },
    {
      key: 'author',
      labelAr: 'الكاتب',
      labelEn: 'Author',
      render: (_value, item) => isArabic ? item.author : item.authorEn,
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
            {isArabic ? 'إدارة الأخبار' : 'Manage News'}
          </h1>
          <p className="text-gray-400 font-cairo text-sm">
            {isArabic
              ? `إجمالي الأخبار: ${news.length}`
              : `Total News: ${news.length}`}
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          variant="primary"
          size="lg"
          className="font-cairo flex-row-reverse ms-auto"
        >
          <Plus size={20} className="me-2" />
          {isArabic ? 'إضافة خبر' : 'Add News'}
        </Button>
      </motion.div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={news}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        deleteTitleAr="حذف الخبر"
        deleteTitleEn="Delete News"
        getDeleteLabel={(newsItem) => (isArabic ? newsItem.titleAr : newsItem.titleEn)}
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add News"
        titleAr="إضافة/تعديل خبر"
      >
        <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                {isArabic ? 'العنوان (عربي)' : 'Title (Arabic)'}
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
                {isArabic ? 'العنوان (إنجليزي)' : 'Title (English)'}
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
                {isArabic ? 'الفئة (عربي)' : 'Category (Arabic)'}
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
              />
            </div>
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                {isArabic ? 'الفئة (إنجليزي)' : 'Category (English)'}
              </label>
              <input
                type="text"
                name="categoryEn"
                value={formData.categoryEn}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                {isArabic ? 'التاريخ' : 'Date'}
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
              />
            </div>
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                {isArabic ? 'الكاتب (عربي)' : 'Author (Arabic)'}
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
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