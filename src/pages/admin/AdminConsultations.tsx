import { motion } from 'framer-motion'
import { useState } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import {
    useGetAllConsultations,
    useDeleteConsultation,
    useConfirmConsultation,
} from '@/hooks/consultation'
import DataTable, { Column } from '@/components/admin/DataTable'
import { CheckSquare, Square } from 'lucide-react'
import Modal from '@/components/admin/Modal'
// import StatusBadge from '@/components/admin/StatusBadge'
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

export default function AdminConsultations() {
    const { isArabic } = useLanguage();
    const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
    const [confirmingId, setConfirmingId] = useState<number | null>(null);
    const { data: consultations = [] } = useGetAllConsultations();
    const deleteMutation = useDeleteConsultation();
    const [confirmMutationId, setConfirmMutationId] = useState<number | null>(null);
    const confirmMutation = useConfirmConsultation(confirmMutationId ?? 0);

    // Handlers
    const handleDelete = async (item: any) => {
        try {
            await deleteMutation.mutateAsync(item.id);
            toast.success(isArabic ? 'تم حذف الحجز بنجاح' : 'Consultation deleted successfully');
        } catch {
            toast.error(isArabic ? 'حدث خطأ أثناء الحذف' : 'Error deleting consultation');
        }
    };
    const handleView = (item: any) => setSelectedConsultation(item);
    const handleConfirm = async (item: any) => {
        setConfirmingId(item.id);
        setConfirmMutationId(item.id);
        try {
            await confirmMutation.mutateAsync({
                nationalNumber: item.nationalNumber,
                nationalIdentityPath: item.nationalIdentityPath,
                consultationRequesAttachemnt: item.consultationRequesAttachemnt,
                details: item.details,
            });
            toast.success(isArabic ? 'تم تأكيد الدفع' : 'Payment confirmed');
        } catch {
            toast.error(isArabic ? 'حدث خطأ أثناء التأكيد' : 'Error confirming payment');
        } finally {
            setConfirmingId(null);
            setConfirmMutationId(null);
        }
    };
        const safeRender = (value: any) => {
            if (value === null || value === undefined) return '—';
            if (typeof value === 'object') return Array.isArray(value) ? (value.length ? `${value.length} عنصر` : '—') : '—';
            return String(value);
        };
        const columns: Column<any>[] = [
            { key: 'fullName', labelAr: 'الاسم', labelEn: 'Name', render: safeRender },
            { key: 'email', labelAr: 'البريد الإلكتروني', labelEn: 'Email', render: safeRender },
            { key: 'phone', labelAr: 'رقم الجوال', labelEn: 'Phone', render: safeRender },
            { key: 'nationalNumber', labelAr: 'رقم الهوية الوطنية', labelEn: 'National Number', render: safeRender },
            { key: 'nationalIdentityPath', labelAr: 'الهوية الوطنية (ملف)', labelEn: 'National ID File', render: (value) => (typeof value === 'string' && value) ? (<a href={getFullUrl(value)} target="_blank" rel="noreferrer" className="text-gold underline">{isArabic ? 'عرض' : 'View'}</a>) : '—' },
            { key: 'details', labelAr: 'تفاصيل الشكوى', labelEn: 'Complaint Details', render: safeRender },
            { key: 'paymentReceiptPath', labelAr: 'إيصال الدفع', labelEn: 'Receipt', render: (value) => (typeof value === 'string' && value) ? (<a href={getFullUrl(value)} target="_blank" rel="noreferrer" className="text-gold underline">{isArabic ? 'عرض' : 'View'}</a>) : '—' },
            { key: 'isConfirmed', labelAr: 'تأكيد الدفع', labelEn: 'Confirm Payment', render: (value, item) => value ? (<span className="flex items-center gap-1 text-green-500 font-cairo"><CheckSquare size={18} />{isArabic ? 'تم التأكيد' : 'Confirmed'}</span>) : (<button className="flex items-center gap-1 px-2 py-1 bg-gold/20 text-gold rounded hover:bg-gold/40 transition disabled:opacity-60" onClick={() => handleConfirm(item)} disabled={confirmMutation.isPending && confirmingId === item.id}><Square size={18} />{confirmMutation.isPending && confirmingId === item.id ? (isArabic ? 'جاري التأكيد...' : 'Confirming...') : (isArabic ? 'تأكيد الدفع' : 'Confirm Payment')}</button>) },
        ];

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
