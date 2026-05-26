import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import Button from '@/components/ui/Button'
import Loading from '@/components/ui/Loading'
import DataTable, { Column } from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'
import { toast } from 'sonner'
import ServiceForm from '@/components/admin/ServiceForm'

import {
  useGetServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
  useGetServiceById,
} from '@/hooks/services'

import type { Service } from '@/types/service'

export default function AdminServices() {
  // ================= API =================
  const { data, isLoading, isError, error } = useGetServices()
  const createMutation = useCreateService()
  const updateMutation = useUpdateService()
  const deleteMutation = useDeleteService()

  const services: Service[] = data?.data || []

  // ================= DETAILS API =================
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)

  const { data: serviceDetails, isLoading: detailsLoading } =
    useGetServiceById(selectedServiceId ?? '')

  // ================= STATE =================
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  // ================= OPEN MODAL (CREATE / EDIT) =================
  const handleOpenModal = (service?: Service) => {
    setEditingService(service || null)

    if (service) {
      setSelectedServiceId(service.id) // 👈 مهم للتعديل
    }

    setIsModalOpen(true)
  }

  const resolveImagePath = (filePath?: string) => {
    if (!filePath) return ''
    const trimmedPath = filePath.trim()
    if (trimmedPath.startsWith('http')) return trimmedPath

    const normalized = trimmedPath.replace(/^\/?wwwroot\/?/i, '')
    return `https://lawm.runasp.net/${normalized.replace(/\\/g, '/')}`
  }

  // ================= FILL FORM AFTER API =================
  useEffect(() => {
    if (serviceDetails?.data && editingService) {
      setEditingService(serviceDetails.data)
    }
  }, [serviceDetails])

  // ================= DETAILS =================
  const handleOpenDetails = (service: Service) => {
    setSelectedServiceId(service.id)
    setIsDetailsOpen(true)
  }

  const handleCloseDetails = () => {
    setIsDetailsOpen(false)
    setSelectedServiceId(null)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingService(null)
    setSelectedServiceId(null)
  }

  // ================= DELETE =================
  const handleDelete = async (service: Service) => {
    try {
      await deleteMutation.mutateAsync(service.id)
      toast.success('تم حذف الخدمة')
    } catch (err: any) {
      toast.error(err.message || 'حدث خطأ')
    }
  }

  // ================= TABLE =================
  const columns: Column<Service>[] = [
    {
      key: 'serviceImagePath',
      labelAr: 'صورة الخدمة',
      labelEn: 'Image',
      render: (_v, item) =>
        item.serviceImagePath ? (
          <img
            src={resolveImagePath(item.serviceImagePath)} alt="Service"
            className="w-16 h-16 object-cover rounded-lg"
          />
        ) : (
          <span className="text-gray-500">No Image</span>
        ),
    },
    {
      key: 'title',
      labelAr: 'عنوان الخدمة',
      labelEn: 'Service Title',
      render: (_v, item) => item.title,
    },
    {
      key: 'price',
      labelAr: 'السعر',
      labelEn: 'Price',
      render: (v) => v,
    },
    {
      key: 'description',
      labelAr: 'الوصف',
      labelEn: 'Description',
      render: (v) => `${v.slice(0, 40)}...`,
    },
    {
      key: 'childernTheServices',
      labelAr: 'التفاصيل',
      labelEn: 'Details',
      render: (v) => (v?.length || 0) + ' عناصر',
    },
  ]

  const backendMessage = !isLoading && data?.success === false ? data.message : ''
  const errorMessage = error instanceof Error ? error.message : 'حدث خطأ في تحميل البيانات'
  const tableMessage = backendMessage || (isError ? errorMessage : services.length === 0 ? 'لا توجد خدمات حالياً' : '')
  const tableColSpan = columns.length + 1

  return (
    <div dir="rtl">

      {/* Header */}
      <motion.div className="flex justify-between mb-6">
        <h1 className="text-white text-2xl font-bold">إدارة الخدمات</h1>

        <Button onClick={() => handleOpenModal()}>
          <Plus size={18} />
          إضافة خدمة
        </Button>
      </motion.div>

      {/* TABLE */}
      <div className="border border-gold/20 rounded-lg overflow-hidden max-w-full bg-charcoal/40">
        {isLoading ? (
          <div className="w-full overflow-x-auto">
            <table className="min-w-full text-right">
              <thead className="bg-primary-black border-b border-gold/20">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={String(column.key)}
                      className="px-6 py-4 text-sm font-cairo font-semibold text-gold text-right whitespace-nowrap"
                    >
                      {column.labelAr}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-sm font-cairo font-semibold text-gold text-right whitespace-nowrap">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={tableColSpan} className="px-6 py-16 text-center text-gray-300 font-cairo">
                    <Loading inline message="جاري تحميل الخدمات..." />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : tableMessage ? (
          <div className="w-full overflow-x-auto">
            <table className="min-w-full text-right">
              <thead className="bg-primary-black border-b border-gold/20">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={String(column.key)}
                      className="px-6 py-4 text-sm font-cairo font-semibold text-gold text-right whitespace-nowrap"
                    >
                      {column.labelAr}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-sm font-cairo font-semibold text-gold text-right whitespace-nowrap">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={tableColSpan} className="px-6 py-16 text-center text-gray-300 font-cairo">
                    {tableMessage}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <DataTable
            data={services}
            columns={columns}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
            onView={handleOpenDetails}
            deleteTitleAr="حذف الخدمة"
            deleteTitleEn="Delete Service"
            getDeleteLabel={(service) => service.title}
          />
        )}
      </div>

      {/* FORM MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingService ? 'Edit Service' : 'Add Service'}
        titleAr={editingService ? 'تعديل الخدمة' : 'إضافة خدمة'}
      >
        <ServiceForm
          isArabic={true}
          initialService={editingService}
          isPending={createMutation.isPending || updateMutation.isPending}
          onSubmit={async (data) => {
            if (editingService) {
              await updateMutation.mutateAsync({
                id: editingService.id,
                payload: data,
              })
              toast.success('تم التحديث')
            } else {
              await createMutation.mutateAsync(data)
              toast.success('تمت الإضافة')
            }

            setIsModalOpen(false)
            setEditingService(null)
          }}
          onCancel={handleCloseModal}
        />
      </Modal>

      {/* DETAILS MODAL */}
      <Modal isOpen={isDetailsOpen} onClose={handleCloseDetails} title="Service Details" titleAr="تفاصيل الخدمة">
        {detailsLoading ? (
          <div className="py-6 flex justify-center">
            <Loading inline message="جاري تحميل التفاصيل..." />
          </div>
        ) : serviceDetails?.data ? (
          <div className="space-y-4 text-right">
            {serviceDetails.data.serviceImagePath && (
              <img
                src={resolveImagePath(serviceDetails.data.serviceImagePath)} alt="Service Image"
                className="w-full h-60 object-cover rounded-lg mb-4"
              />
            )}
            <h2 className="text-xl font-bold text-white">
              {serviceDetails.data.title}
            </h2>

            <p className="text-gray-300">
              {serviceDetails.data.description}
            </p>

            <p className="text-gold font-bold">
              {serviceDetails.data.price} ر.س
            </p>


            <div>
              <p className="text-gray-400 mb-2">التفاصيل:</p>
              <ul className="space-y-2">
                {serviceDetails.data.childernTheServices?.map((c) => (
                  <li key={c.id || c.term} className="text-gold">
                    ✓ {c.term}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}