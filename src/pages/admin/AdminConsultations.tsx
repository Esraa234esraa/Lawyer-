import { motion } from 'framer-motion'
import { useState } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import {
    useGetAllConsultations,
    useDeleteConsultation,
    useConfirmConsultation,
} from '@/hooks/consultation'
import DataTable, { Column } from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'
import StatusBadge from '@/components/admin/StatusBadge'
import { toast } from 'sonner'

// Helper to get full URL for file paths
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://lawm.runasp.net';
function getFullUrl(path: string) {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    let clean = path.replace(/^wwwroot\//, '/').replace(/^wwwroot\//, '/');
    if (!clean.startsWith('/')) clean = '/' + clean;
    return BASE_URL.replace(/\/$/, '') + clean;
}
import { Eye } from 'lucide-react'
function ConfirmConsultationButton({ consultation }: { consultation: any }) {
    const { isArabic } = useLanguage();
    const [nationalNumber, setNationalNumber] = useState('');
    const [nationalIdentityPath, setNationalIdentityPath] = useState<File | null>(null);
    const [consultationRequesAttachemnt, setConsultationRequesAttachemnt] = useState<File | null>(null);
    const [details, setDetails] = useState('');
    const confirmMutation = useConfirmConsultation(consultation.id);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nationalNumber || !nationalIdentityPath || !consultationRequesAttachemnt) {
            toast.error(isArabic ? 'يرجى تعبئة جميع الحقول المطلوبة' : 'Please fill all required fields');
            return;
        }
        confirmMutation.mutate({
            nationalNumber,
            nationalIdentityPath,
            consultationRequesAttachemnt,
            details,
        });
    };

    if (consultation.isConfirmed) {
        return <span className="px-4 py-2 rounded-lg bg-green-600 text-white font-cairo">{isArabic ? 'تم التأكيد' : 'Confirmed'}</span>;
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 items-end">
            <input
                type="text"
                placeholder={isArabic ? 'رقم الهوية الوطنية' : 'National Number'}
                value={nationalNumber}
                onChange={e => setNationalNumber(e.target.value)}
                className="input-gold w-full"
                required
            />
            <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={e => setNationalIdentityPath(e.target.files?.[0] || null)}
                className="input-gold w-full"
                required
            />
            <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={e => setConsultationRequesAttachemnt(e.target.files?.[0] || null)}
                className="input-gold w-full"
                required
            />
            <textarea
                placeholder={isArabic ? 'تفاصيل إضافية (اختياري)' : 'Additional details (optional)'}
                value={details}
                onChange={e => setDetails(e.target.value)}
                className="input-gold w-full"
                rows={2}
            />
            <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-green-600 text-white font-cairo"
                disabled={confirmMutation.isPending}
            >
                {confirmMutation.isPending ? (isArabic ? 'جاري التأكيد...' : 'Confirming...') : (isArabic ? 'تأكيد الاستشارة' : 'Confirm Consultation')}
            </button>
        </form>
    );
}

export default function AdminConsultations() {
    const { isArabic } = useLanguage()
    const { data: consultations = [] } = useGetAllConsultations()
    const deleteMutation = useDeleteConsultation()
    const [selectedConsultation, setSelectedConsultation] = useState<any | null>(null)

    const handleDelete = (item: any) => {
        deleteMutation.mutate(item.id, {
            onSuccess: () => toast.success(isArabic ? 'تم الحذف' : 'Deleted'),
            onError: (err: any) => toast.error(err?.message || 'Delete failed'),
        })
    }
    // Confirmation will be handled in modal (see below)

    const handleView = (item: any) => {
        setSelectedConsultation(item)
    }
    const columns: Column<any>[] = [
        {
            key: 'fullName',
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
        // Add more columns as needed, mapping backend fields
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
                deleteTitleAr="حذف حجز الاستشارة"
                deleteTitleEn="Delete Consultation Booking"
                getDeleteLabel={(item) => item.fullName || item.email}
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
                                <p className="text-white">{selectedConsultation.fullName}</p>
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
                                <p className="text-white">{selectedConsultation.nationalNumber || '—'}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm mb-2">{isArabic ? 'إيصال الدفع' : 'Receipt'}</p>
                            <a
                                href={getFullUrl(selectedConsultation.paymentReceiptPath)}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 text-gold underline"
                            >
                                <Eye size={16} />
                                {isArabic ? 'عرض الإيصال' : 'View Receipt'}
                            </a>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm mb-2">{isArabic ? 'نص الشكوى' : 'Complaint Text'}</p>
                            <p className="text-white whitespace-pre-wrap leading-7">
                                {selectedConsultation.details}
                            </p>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <ConfirmConsultationButton consultation={selectedConsultation} />
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
