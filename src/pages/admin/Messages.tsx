import { motion } from 'framer-motion'
import { useMemo } from 'react'
import DataTable, { Column } from '@/components/admin/DataTable'
import { useLanguage } from '@/hooks/useLanguage'
import { useGetAllContacts } from '@/hooks/contacts'
import type { Contact } from '@/types/contact'

type ContactRow = Contact & {
  id: string
}

export default function AdminMessages() {
  const { isArabic } = useLanguage()
  const { data, isLoading, isFetching } = useGetAllContacts()

  const contacts = data?.data || []

  const rows = useMemo<ContactRow[]>(
    () =>
      contacts.map((contact, index) => ({
        ...contact,
        id: `${index}-${contact.fullName}-${contact.phoneNumber}`,
      })),
    [contacts]
  )

  const columns: Column<ContactRow>[] = [
    {
      key: 'fullName',
      labelAr: 'الاسم الكامل',
      labelEn: 'Full Name',
    },
    {
      key: 'phoneNumber',
      labelAr: 'رقم الهاتف',
      labelEn: 'Phone Number',
    },
    {
      key: 'email',
      labelAr: 'البريد الإلكتروني',
      labelEn: 'Email',
      render: (value) => value || '—',
    },
    {
      key: 'subject',
      labelAr: 'الموضوع',
      labelEn: 'Subject',
      render: (value) => value || '—',
    },
    {
      key: 'mesage',
      labelAr: 'الرسالة',
      labelEn: 'Message',
      render: (value) => (
        <span className="line-clamp-2 max-w-[420px] whitespace-normal block">
          {value || '—'}
        </span>
      ),
    },
  ]

  return (
    <div dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-heading-1 font-cairo font-bold text-gradient">
          {isArabic ? 'رسائل تواصل معنا' : 'Contact Messages'}
        </h1>
        <p className="text-gray-400 text-sm">
          {isArabic
            ? `إجمالي الرسائل: ${rows.length}`
            : `Total Messages: ${rows.length}`}
        </p>
        {isFetching && (
          <p className="text-gray-500 text-xs mt-1 font-cairo">
            {isArabic ? 'جاري تحديث الرسائل...' : 'Refreshing messages...'}
          </p>
        )}
      </motion.div>

      {isLoading && (
        <div className="mb-4 text-gray-300 font-cairo text-sm">
          {isArabic ? 'جاري تحميل الرسائل...' : 'Loading messages...'}
        </div>
      )}

      <DataTable columns={columns} data={rows} actions={false} />
    </div>
  )
}
