import { motion } from 'framer-motion'
import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/hooks/useLanguage'
import { useClientStore } from '@/store/clientStore'
import { toast } from 'sonner'

export default function FileUploadSection() {
  const { isArabic } = useLanguage()
  const { uploadFile } = useClientStore()
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileDescription, setFileDescription] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error(isArabic ? 'يرجى اختيار ملف' : 'Please select a file')
      return
    }

    setIsUploading(true)

    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const fileSize = (selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB'

    uploadFile({
      nameAr: fileDescription || selectedFile.name,
      nameEn: selectedFile.name,
      type: selectedFile.name.split('.').pop()?.toUpperCase() || 'FILE',
      size: fileSize,
      uploadedAt: new Date().toISOString().split('T')[0],
      status: 'pending',
    })

    toast.success(
      isArabic ? 'تم تحميل الملف بنجاح' : 'File uploaded successfully'
    )

    setSelectedFile(null)
    setFileDescription('')
    setIsUploading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 bg-charcoal border border-gold/20 rounded-lg"
      dir="rtl"
    >
      <h2 className="text-heading-2 font-cairo font-bold text-gold mb-2">
        {isArabic ? 'رفع ملف قضية' : 'Upload Case File'}
      </h2>
      <p className="text-gray-400 font-cairo text-sm mb-6">
        {isArabic ? 'قم بتحميل ملفات إضافية متعلقة بقضيتك' : 'Upload additional files related to your case'}
      </p>

      <div className="space-y-6">
        {/* Drag and Drop Zone */}
        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          animate={{
            borderColor: isDragging ? '#C6A75E' : 'rgba(198, 167, 94, 0.2)',
            backgroundColor: isDragging ? 'rgba(198, 167, 94, 0.05)' : 'transparent',
          }}
          className="border-2 border-dashed border-gold/20 rounded-lg p-8 text-center cursor-pointer transition-all"
        >
          <input
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            id="file-input"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.zip"
          />

          <label htmlFor="file-input" className="cursor-pointer">
            <div className="flex flex-col items-center justify-center gap-3">
              <motion.div
                animate={{ y: isDragging ? -4 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Upload size={48} className="text-gold mx-auto" />
              </motion.div>

              <div>
                <p className="text-gold font-cairo font-semibold mb-1">
                  {isArabic ? 'اسحب الملف هنا' : 'Drag file here'}
                </p>
                <p className="text-gray-400 font-cairo text-sm">
                  {isArabic ? 'أو انقر لاختيار ملف' : 'or click to select'}
                </p>
              </div>

              <p className="text-xs text-gray-500 font-cairo mt-2">
                {isArabic
                  ? 'الملفات المدعومة: PDF, DOC, DOCX, ZIP, صور'
                  : 'Supported: PDF, DOC, DOCX, ZIP, Images'}
              </p>
            </div>
          </label>
        </motion.div>

        {/* Selected File Preview */}
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-primary-black border border-gold/30 rounded-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setSelectedFile(null)}
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                <X size={20} />
              </button>
              <div className="text-right flex-1">
                <p className="font-cairo font-semibold text-white">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-400 font-cairo">
                  {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-cairo font-semibold text-gold mb-2 text-right">
                {isArabic ? 'وصف الملف (اختياري)' : 'File Description (Optional)'}
              </label>
              <input
                type="text"
                value={fileDescription}
                onChange={(e) => setFileDescription(e.target.value)}
                placeholder={isArabic ? 'مثال: عقد التوظيف' : 'Example: Employment Contract'}
                className="w-full px-4 py-2 bg-charcoal border border-gold/20 rounded-lg text-white focus:border-gold focus:outline-none font-cairo text-right"
              />
            </div>
          </motion.div>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!selectedFile}
          variant="primary"
          size="lg"
          isLoading={isUploading}
          className="w-full font-cairo"
        >
          {isArabic ? 'رفع الملف' : 'Upload File'}
        </Button>
      </div>
    </motion.div>
  )
}