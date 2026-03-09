import { motion } from 'framer-motion'
import { useLanguage } from '@/hooks/useLanguage'
import { useAdminStore, ConsultationBooking } from '@/store/adminStore'
import DataTable, { Column } from '@/components/admin/DataTable'
import StatusBadge from '@/components/admin/StatusBadge'
import { toast } from 'sonner'

export default function AdminConsultations() {
    const { isArabic } = useLanguage()
    const { consultations, deleteConsultation, updateConsultation } =
        useAdminStore()

    const handleDelete = (item: ConsultationBooking) => {
        if (confirm(isArabic ? 'حذف الحجز؟' : 'Delete booking?')) {
            deleteConsultation(item.id)
            toast.success(isArabic ? 'تم الحذف' : 'Deleted')
        }
    }
    const handleConfirm = (item: ConsultationBooking) => {
        updateConsultation(item.id, {
            status: 'contacted'
        })

        toast.success(
            isArabic ? 'تم تأكيد الاستشارة' : 'Consultation confirmed'
        )
    }
    const columns: Column<ConsultationBooking>[] = [
        {
            key: 'name',
            labelAr: 'الاسم',
            labelEn: 'Name',
        },
        {
            key: 'email',
            labelAr: 'البريد',
            labelEn: 'Email',
        },
        {
            key: 'phone',
            labelAr: 'الهاتف',
            labelEn: 'Phone',
        },
        {
            key: 'service',
            labelAr: 'الخدمة',
            labelEn: 'Service',
        },
        {
            key: 'details',
            labelAr: 'تفاصيل الاستشارة',
            labelEn: 'Details',
            render: (value) => (
                <span className="line-clamp-1 max-w-[200px]">{value}</span>
            ),
        },
        {
            key: 'attachment',
            labelAr: 'الملف',
            labelEn: 'File',
            render: (value) =>
                value ? (
                    <a
                        href={value}
                        target="_blank"
                        className="text-gold underline"
                    >
                        عرض
                    </a>
                ) : (
                    '-'
                ),
        },
        {
            key: 'paymentStatus',
            labelAr: 'الدفع',
            labelEn: 'Payment',
            render: (value) => <StatusBadge status={value} />,
        },
        {
            key: 'paymentReference',
            labelAr: 'تفاصيل الدفع',
            labelEn: 'Payment Ref',
            render: (_value, item) =>
                item.paymentStatus === 'paid'
                    ? item.paymentReference || '—'
                    : 'لم يتم الدفع',
        },
        {
            key: 'createdAt',
            labelAr: 'التاريخ',
            labelEn: 'Date',
        },
    ]

    return (
        <div dir="rtl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-heading-1 font-cairo font-bold text-gradient">
                    {isArabic ? 'إدارة حجوزات الاستشارات' : 'Manage Consultations'}
                </h1>
                <p className="text-gray-400 text-sm">
                    {isArabic
                        ? `إجمالي الحجوزات: ${consultations.length}`
                        : `Total Bookings: ${consultations.length}`}
                </p>
            </motion.div>

            <DataTable
                columns={columns}
                data={consultations}
                onDelete={handleDelete}
                onSubmit={handleConfirm}
            />
        </div>
    )
}
