import { motion } from 'framer-motion'
import { useState } from 'react'
import { Download, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Modal from '@/components/admin/Modal'
// import StatusBadge from '@/components/admin/StatusBadge'
import { useLanguage } from '@/hooks/useLanguage'
import { useClientStore, CaseFile } from '@/store/clientStore'
import { toast } from 'sonner'

export default function AdminClientsFiles() {
  const { isArabic } = useLanguage()
  const { caseFiles, updateFileStatus } = useClientStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<CaseFile | null>(null)

  // const handleViewFile = (file: CaseFile) => {
  //   setSelectedFile(file)
  //   setIsModalOpen(true)
  // }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedFile(null)
  }

  const handleApprove = (file: CaseFile) => {
    updateFileStatus(file.id, 'approved')
    toast.success(isArabic ? 'تم قبول الملف' : 'File approved')
  }

  const handleReview = (file: CaseFile) => {
    updateFileStatus(file.id, 'reviewed')
    toast.success(isArabic ? 'تم مراجعة الملف' : 'File reviewed')
  }

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case 'approved':
  //       return 'text-green-400'
  //     case 'reviewed':
  //       return 'text-blue-400'
  //     case 'pending':
  //       return 'text-yellow-400'
  //     default:
  //       return 'text-gray-400'
  //   }
  // }

  const pendingFiles = caseFiles.filter((f) => f.status === 'pending').length
  const reviewedFiles = caseFiles.filter((f) => f.status === 'reviewed').length
  const approvedFiles = caseFiles.filter((f) => f.status === 'approved').length

  return (
    <div dir="rtl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-heading-1 font-cairo font-bold text-gradient mb-4">
          {isArabic ? 'ملفات العملاء' : 'Client Files'}
        </h1>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-charcoal border border-yellow-500/20 rounded-lg">
            <p className="text-gray-400 font-cairo text-sm mb-2">
              {isArabic ? 'قيد الانتظار' : 'Pending'}
            </p>
            <p className="text-3xl font-bold text-yellow-400">{pendingFiles}</p>
          </div>
          <div className="p-4 bg-charcoal border border-blue-500/20 rounded-lg">
            <p className="text-gray-400 font-cairo text-sm mb-2">
              {isArabic ? 'تحت المراجعة' : 'Under Review'}
            </p>
            <p className="text-3xl font-bold text-blue-400">{reviewedFiles}</p>
          </div>
          <div className="p-4 bg-charcoal border border-green-500/20 rounded-lg">
            <p className="text-gray-400 font-cairo text-sm mb-2">
              {isArabic ? 'موافق عليه' : 'Approved'}
            </p>
            <p className="text-3xl font-bold text-green-400">{approvedFiles}</p>
          </div>
        </div>
      </motion.div>

      {/* Files List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        {caseFiles.length === 0 ? (
          <div className="text-center py-12 bg-charcoal border border-gold/20 rounded-lg">
            <p className="text-gray-400 font-cairo">
              {isArabic ? 'لا توجد ملفات' : 'No files available'}
            </p>
          </div>
        ) : (
          caseFiles.map((file, idx) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="p-6 bg-charcoal border border-gold/20 rounded-lg hover:border-gold/50 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                {/* File Info */}
                <div className="flex-1 text-right">
                  <div className="flex items-center justify-end gap-3 mb-3">
                    <div>
                      <h3 className="text-heading-3 font-cairo font-bold text-white mb-1">
                        {isArabic ? file.nameAr : file.nameEn}
                      </h3>
                      <p className="text-gray-400 font-cairo text-sm">
                        {isArabic ? 'العميل: أحمد محمد' : 'Client: Ahmed Mohammed'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-4 mb-3 flex-wrap">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-cairo mb-1">
                        {isArabic ? 'النوع' : 'Type'}
                      </p>
                      <span className="px-2 py-1 bg-gold/10 text-gold rounded text-xs font-semibold font-cairo">
                        {file.type}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-cairo mb-1">
                        {isArabic ? 'الحجم' : 'Size'}
                      </p>
                      <p className="text-sm font-cairo font-semibold text-white">
                        {file.size}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-cairo mb-1">
                        {isArabic ? 'التاريخ' : 'Date'}
                      </p>
                      <p className="text-sm font-cairo font-semibold text-white">
                        {new Date(file.uploadedAt).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                   
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  {/* <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleViewFile(file)}
                    className="p-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                    title={isArabic ? 'عرض' : 'View'}
                  >
                    <Eye size={20} />
                  </motion.button> */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors"
                    title={isArabic ? 'تحميل' : 'Download'}
                  >
                    <Download size={20} />
                  </motion.button>

                  {file.status === 'pending' && (
                    <>
                      {/* <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleReview(file)}
                        className="p-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                        title={isArabic ? 'قيد المراجعة' : 'Mark as Reviewed'}
                      >
                        <AlertCircle size={20} />
                      </motion.button> */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleApprove(file)}
                        className="p-3 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                        title={isArabic ? 'قبول' : 'Approve'}
                      >
                        <CheckCircle size={20} />
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* File Preview Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="File Preview"
        titleAr="معاينة الملف"
      >
        {selectedFile && (
          <div dir="rtl" className="space-y-6">
            {/* File Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-primary-black rounded-lg text-right">
                <p className="text-gray-400 text-sm font-cairo mb-1">
                  {isArabic ? 'اسم الملف' : 'File Name'}
                </p>
                <p className="text-white font-cairo font-semibold">
                  {isArabic ? selectedFile.nameAr : selectedFile.nameEn}
                </p>
              </div>
              <div className="p-4 bg-primary-black rounded-lg text-right">
                <p className="text-gray-400 text-sm font-cairo mb-1">
                  {isArabic ? 'النوع' : 'Type'}
                </p>
                <p className="text-white font-cairo font-semibold">
                  {selectedFile.type}
                </p>
              </div>
              <div className="p-4 bg-primary-black rounded-lg text-right">
                <p className="text-gray-400 text-sm font-cairo mb-1">
                  {isArabic ? 'الحجم' : 'Size'}
                </p>
                <p className="text-white font-cairo font-semibold">
                  {selectedFile.size}
                </p>
              </div>
              <div className="p-4 bg-primary-black rounded-lg text-right">
                <p className="text-gray-400 text-sm font-cairo mb-1">
                  {isArabic ? 'التاريخ' : 'Date'}
                </p>
                <p className="text-white font-cairo font-semibold">
                  {new Date(selectedFile.uploadedAt).toLocaleDateString(
                    'ar-SA'
                  )}
                </p>
              </div>
            </div>

            {/* File Preview */}
            <div className="bg-primary-black rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-gray-400 font-cairo mb-6">
                {isArabic ? 'معاينة الملف غير متاحة' : 'File preview not available'}
              </p>
              <a
                href="#"
                className="inline-block px-6 py-2 bg-gold text-primary-black rounded-lg font-cairo font-semibold hover:bg-gold-light transition-colors"
              >
                {isArabic ? 'تحميل الملف' : 'Download File'}
              </a>
            </div>

            {/* Status Actions */}
            {selectedFile.status === 'pending' && (
              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    handleApprove(selectedFile)
                    handleCloseModal()
                  }}
                  variant="primary"
                  className="flex-1 font-cairo"
                >
                  {isArabic ? 'قبول الملف' : 'Approve File'}
                </Button>
                <Button
                  onClick={() => {
                    handleReview(selectedFile)
                    handleCloseModal()
                  }}
                  variant="secondary"
                  className="flex-1 font-cairo"
                >
                  {isArabic ? 'قيد المراجعة' : 'Under Review'}
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}