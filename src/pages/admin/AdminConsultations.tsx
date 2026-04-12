import { motion } from 'framer-motion'
import { useState } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import { useAdminStore, ConsultationBooking } from '@/store/adminStore'
import DataTable, { Column } from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'
import StatusBadge from '@/components/admin/StatusBadge'
import { toast } from 'sonner'
import { Download, Eye } from 'lucide-react'

export default function AdminConsultations() {
    const { isArabic } = useLanguage()
    const { consultations, deleteConsultation, updateConsultation } =
        useAdminStore()
    const [selectedConsultation, setSelectedConsultation] =
        useState<ConsultationBooking | null>(null)

    const handleDelete = (item: ConsultationBooking) => {
        deleteConsultation(item.id)
        toast.success(isArabic ? 'تم الحذف' : 'Deleted')
    }
    const handleConfirm = (item: ConsultationBooking) => {
        updateConsultation(item.id, {
            status: 'contacted'
        })

        toast.success(
            isArabic ? 'تم تأكيد الاستشارة' : 'Consultation confirmed'
        )
    }

    const handleView = (item: ConsultationBooking) => {
        setSelectedConsultation(item)
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
            key: 'consultationName',
            labelAr: 'اسم الاستشارة',
            labelEn: 'Consultation',
            render: (value) => value || '—',
        },
        {
            key: 'paidAmountSar',
            labelAr: 'المبلغ المدفوع',
            labelEn: 'Paid Amount',
            render: (value) => (value ? `${value} SAR` : '—'),
        },
        {
            key: 'nationalId',
            labelAr: 'الهوية الوطنية',
            labelEn: 'National ID',
            render: (value) => value || '—',
        },
        {
            key: 'nationalAddress',
            labelAr: 'العنوان الوطني',
            labelEn: 'National Address',
            render: (value) => (
                <span className="line-clamp-1 max-w-[220px]">{value || '—'}</span>
            ),
        },
        {
            key: 'service',
            labelAr: 'نوع الدعوى',
            labelEn: 'Case Type',
        },
        {
            key: 'details',
            labelAr: 'تفاصيل الاستشارة',
            labelEn: 'Complaint Text',
            render: (value) => (
                <span className="line-clamp-1 max-w-[200px]">{value}</span>
            ),
        },
        {
            key: 'paymentReceiptName',
            labelAr: 'إيصال الدفع',
            labelEn: 'Receipt',
            render: (value) => value || '—',
        },
        {
            key: 'caseAttachments',
            labelAr: 'مرفقات الدعوى',
            labelEn: 'Case Files',
            render: (value) =>
                Array.isArray(value) && value.length ? (
                    <span>{`${value.length} ملف`}</span>
                ) : (
                    '—'
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
                onView={handleView}
                onSubmit={handleConfirm}
                deleteTitleAr="حذف حجز الاستشارة"
                deleteTitleEn="Delete Consultation Booking"
                getDeleteLabel={(item) => item.consultationName || item.name || item.email}
            />

            <Modal
                isOpen={Boolean(selectedConsultation)}
                onClose={() => setSelectedConsultation(null)}
                title="Consultation Details"
                titleAr="تفاصيل الاستشارة"
            >
                {selectedConsultation && (
                    <div className="space-y-5 text-right font-cairo">
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-400">{isArabic ? 'الاسم' : 'Name'}</p>
                                <p className="text-white">{selectedConsultation.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">{isArabic ? 'الهاتف' : 'Phone'}</p>
                                <p className="text-white">{selectedConsultation.phone}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">{isArabic ? 'البريد' : 'Email'}</p>
                                <p className="text-white">{selectedConsultation.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">{isArabic ? 'رقم الهوية' : 'National ID'}</p>
                                <p className="text-white">{selectedConsultation.nationalId || '—'}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-gray-400">{isArabic ? 'العنوان الوطني' : 'National Address'}</p>
                                <p className="text-white">{selectedConsultation.nationalAddress || '—'}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">{isArabic ? 'نوع الدعوى' : 'Case Type'}</p>
                                <p className="text-white">{selectedConsultation.service}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">{isArabic ? 'اسم الاستشارة' : 'Consultation'}</p>
                                <p className="text-white">{selectedConsultation.consultationName || '—'}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">{isArabic ? 'المبلغ المدفوع' : 'Paid Amount'}</p>
                                <p className="text-white">{selectedConsultation.paidAmountSar ? `${selectedConsultation.paidAmountSar} SAR` : '—'}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">{isArabic ? 'حالة الدفع' : 'Payment Status'}</p>
                                <StatusBadge status={selectedConsultation.paymentStatus} />
                            </div>
                        </div>

                        <div>
                            <p className="text-gray-400 text-sm mb-2">{isArabic ? 'صورة الإيصال' : 'Receipt Image'}</p>
                            {selectedConsultation.paymentReceiptDataUrl ? (
                                selectedConsultation.paymentReceiptType?.startsWith('image/') ? (
                                    <a
                                        href={selectedConsultation.paymentReceiptDataUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block rounded-lg overflow-hidden border border-gold/20"
                                    >
                                        <img
                                            src={selectedConsultation.paymentReceiptDataUrl}
                                            alt={selectedConsultation.paymentReceiptName || 'Receipt'}
                                            className="w-full max-h-80 object-contain bg-black/20"
                                        />
                                    </a>
                                ) : (
                                    <a
                                        href={selectedConsultation.paymentReceiptDataUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 text-gold underline"
                                    >
                                        <Eye size={16} />
                                        {selectedConsultation.paymentReceiptName || 'Receipt'}
                                    </a>
                                )
                            ) : (
                                <p className="text-gray-300">{selectedConsultation.paymentReceiptName || '—'}</p>
                            )}
                        </div>

                        <div>
                            <p className="text-gray-400 text-sm mb-2">{isArabic ? 'مرفقات الدعوى' : 'Case Attachments'}</p>
                            <div className="space-y-2">
                                {selectedConsultation.caseAttachments?.length ? (
                                    selectedConsultation.caseAttachments.map((fileName, index) => {
                                        const filePayload = selectedConsultation.caseAttachmentFiles?.find(
                                            (item) => item.name === fileName
                                        )
                                        const isAvailable = Boolean(filePayload?.dataUrl)

                                        return (
                                        <div
                                            key={`${fileName}-${index}`}
                                            className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gold/20 bg-black/20"
                                        >
                                            <div className="flex items-center gap-2">
                                                {isAvailable ? (
                                                    <>
                                                        <a
                                                            href={filePayload?.dataUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gold/15 text-gold text-xs"
                                                        >
                                                            <Eye size={14} />
                                                            {isArabic ? 'فتح' : 'Open'}
                                                        </a>
                                                        <a
                                                            href={filePayload?.dataUrl}
                                                            download={fileName}
                                                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gold text-black text-xs"
                                                        >
                                                            <Download size={14} />
                                                            {isArabic ? 'تحميل' : 'Download'}
                                                        </a>
                                                    </>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-500/10 text-red-300 text-xs border border-red-500/20">
                                                        {isArabic ? 'مرفق قديم غير متاح للفتح' : 'Legacy file not available for preview'}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-white text-sm truncate">{fileName}</p>
                                        </div>
                                        )
                                    })
                                ) : (
                                    <span className="text-gray-400">—</span>
                                )}
                            </div>
                        </div>

                        <div>
                            <p className="text-gray-400 text-sm mb-2">{isArabic ? 'نص الشكوى' : 'Complaint Text'}</p>
                            <p className="text-white whitespace-pre-wrap leading-7">
                                {selectedConsultation.details}
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            {selectedConsultation.status === 'new' && selectedConsultation.paymentStatus === 'paid' && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleConfirm(selectedConsultation)
                                        setSelectedConsultation((current) =>
                                            current ? { ...current, status: 'contacted' } : current
                                        )
                                    }}
                                    className="px-4 py-2 rounded-lg bg-green-600 text-white font-cairo"
                                >
                                    {isArabic ? 'تأكيد الاستشارة' : 'Confirm Consultation'}
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => setSelectedConsultation(null)}
                                className="px-4 py-2 rounded-lg bg-charcoal text-gray-200 border border-gold/20 font-cairo"
                            >
                                {isArabic ? 'إغلاق' : 'Close'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}
