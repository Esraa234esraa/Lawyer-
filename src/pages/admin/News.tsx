import { motion } from 'framer-motion'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import Button from '@/components/ui/Button'
import DataTable, { Column } from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'
import NewsForm from '@/components/admin/NewsForm'
import { useLanguage } from '@/hooks/useLanguage'
import { useFilteredNews } from '@/hooks/useFilteredNews'
import { useGetAllNews, useAddNews, useUpdateNews, useDeleteNews, useHideNews, useShowNews } from '@/hooks/news'
import { News, NewsCreateInput, NewsUpdateInput } from '@/types/news'
import { formatDate } from '@/utils/data'

export default function AdminNews() {
  const { isArabic } = useLanguage()
  const { data, isLoading, isFetching } = useGetAllNews()
  const addNewsMutation = useAddNews()
  const deleteNewsMutation = useDeleteNews()
  const hideNewsMutation = useHideNews()
  const showNewsMutation = useShowNews()

  const newsList = data?.data || []
  const news = useFilteredNews(newsList, {
    sortBy: 'date',
    sortOrder: 'desc',
  })

  const isMutating =
    addNewsMutation.isPending ||
    deleteNewsMutation.isPending ||
    hideNewsMutation.isPending ||
    showNewsMutation.isPending

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<News | null>(null)

  const editMutation = useUpdateNews(editingItem?.id || '', {
    onSuccess: () => {
      setIsModalOpen(false)
      setEditingItem(null)
    },
  })

  const isFormPending = addNewsMutation.isPending || editMutation.isPending

  const handleOpenModal = (newsItem?: News) => {
    if (newsItem) {
      setEditingItem(newsItem)
    } else {
      setEditingItem(null)
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    if (isFormPending) return
    setIsModalOpen(false)
    setEditingItem(null)
  }

  const handleSubmit = async (input: NewsCreateInput | NewsUpdateInput) => {
    if (editingItem) {
      await editMutation.mutateAsync(input as NewsUpdateInput)
      return
    }

    await addNewsMutation.mutateAsync(input as NewsCreateInput)
    setIsModalOpen(false)
  }

  const handleDelete = async (newsItem: News) => {
    if (isMutating) return
    await deleteNewsMutation.mutateAsync(newsItem.id)
  }

  const handleToggleVisibility = async (newsItem: News) => {
    if (isMutating) return

    if (newsItem.isVisible) {
      await hideNewsMutation.mutateAsync(newsItem.id)
      return
    }

    await showNewsMutation.mutateAsync(newsItem.id)
  }

  const columns: Column<News>[] = [
    {
      key: 'name',
      labelAr: 'العنوان',
      labelEn: 'Title',
      render: (value) => value,
    },
    {
      key: 'description',
      labelAr: 'الوصف',
      labelEn: 'Description',
      render: (value) => String(value).slice(0, 45) + (String(value).length > 45 ? '...' : ''),
    },
    {
      key: 'actionDate',
      labelAr: 'التاريخ',
      labelEn: 'Date',
      render: (value) => formatDate(value),
    },
    {
      key: 'isActive',
      labelAr: 'الحالة',
      labelEn: 'Status',
      render: (value) => (
        <span className={value ? 'text-green-400' : 'text-red-400'}>
          {value ? (isArabic ? 'نشط' : 'Active') : (isArabic ? 'غير نشط' : 'Inactive')}
        </span>
      ),
    },
    {
      key: 'isVisible',
      labelAr: 'الظهور',
      labelEn: 'Visibility',
      render: (_value, item) => (
        <Button
          type="button"
          variant={item.isVisible ? 'secondary' : 'primary'}
          size="sm"
          onClick={() => handleToggleVisibility(item)}
          disabled={isMutating}
          className="font-cairo"
        >
          {item.isVisible ? (isArabic ? 'إخفاء' : 'Hide') : (isArabic ? 'إظهار' : 'Show')}
        </Button>
      ),
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
          {isFetching && (
            <p className="text-gray-500 font-cairo text-xs mt-1">
              {isArabic ? 'جاري تحديث البيانات...' : 'Refreshing data...'}
            </p>
          )}
        </div>
        <Button
          onClick={() => handleOpenModal()}
          variant="primary"
          size="lg"
          className="font-cairo flex-row-reverse ms-auto"
          disabled={isMutating}
        >
          <Plus size={20} className="me-2" />
          {isArabic ? 'إضافة خبر' : 'Add News'}
        </Button>
      </motion.div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={news}
        isLoading={isLoading || isFetching}
        loadingMessage={isArabic ? 'جاري تحميل الأخبار...' : 'Loading news...'}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        deleteTitleAr="حذف الخبر"
        deleteTitleEn="Delete News"
        getDeleteLabel={(newsItem) => newsItem.name}
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? 'Edit News' : 'Add News'}
        titleAr="إضافة/تعديل خبر"
      >
        <NewsForm
          isArabic={isArabic}
          mode={editingItem ? 'edit' : 'create'}
          initialNews={editingItem}
          isPending={isFormPending}
          onCancel={handleCloseModal}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  )
}