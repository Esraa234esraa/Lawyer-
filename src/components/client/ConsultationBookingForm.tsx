import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Upload, X, XCircle } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/hooks/useLanguage'
import { toast } from 'sonner'
import { useApplyConsultation } from '@/hooks/consultation'
import barcodeImg from './barcode-consultation.jpeg'
interface ConsultationBookingFormProps {
  onClose?: () => void
}

export default function ConsultationBookingForm({ onClose }: ConsultationBookingFormProps) {
  const { isArabic } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const pageSpacing = onClose ? '' : 'mt-20 md:mt-28'
  const { mutate: applyConsultation, isPending: isApplying } = useApplyConsultation()

  const steps = [
    { id: 1, titleAr: 'الدفع عبر الباركود', titleEn: 'Pay via Barcode' },
    { id: 2, titleAr: 'إيصال الدفع', titleEn: 'Receipt Upload' },
    { id: 3, titleAr: 'بيانات الدعوى', titleEn: 'Case Details' },
    { id: 4, titleAr: 'المرفقات ونص الشكوى', titleEn: 'Attachments & Complaint' },
  ]

  // TODO: Replace with backend fetch if needed
  type Service = {
    id: number;
    titleAr: string;
    titleEn?: string;
    priceAr: string;
  };
  const services: Service[] = [] // Placeholder, should be fetched from backend if not already
  const consultationOptions = services.map((service) => ({
    key: String(service.id),
    nameAr: service.titleAr,
    nameEn: service.titleEn || service.titleAr,
    amountSar: Number(service.priceAr.replace(/[^0-9]/g, '')) || 750,
  }))

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    consultationKey: '',
    service: '',
    nationalNumber: '',
    details: '',
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  // Removed unused: receiptPreview, setReceiptPreview
  const [nationalIdFile, setNationalIdFile] = useState<File | null>(null)
  const [caseFiles, setCaseFiles] = useState<File[]>([])
  // Removed unused: paymentCompleted
  const [submitted, setSubmitted] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const state = location.state as {
      serviceId?: number
      serviceNameAr?: string
      serviceNameEn?: string
      servicePriceSar?: number
    } | null

    const queryServiceId = new URLSearchParams(location.search).get('service')
    const serviceIdFromState = state?.serviceId
    const serviceId = serviceIdFromState || (queryServiceId ? Number(queryServiceId) : undefined)

    if (!serviceId) return

    const matchedOption = consultationOptions.find((option) => option.key === String(serviceId))
    if (!matchedOption) return

    setFormData((prev) => ({
      ...prev,
      consultationKey: matchedOption.key,
      service:
        prev.service ||
        (isArabic
          ? state?.serviceNameAr || matchedOption.nameAr
          : state?.serviceNameEn || matchedOption.nameEn),
      name: prev.name || '',
      email: prev.email || '',
      phone: prev.phone || '',
      nationalNumber: prev.nationalNumber || '',
      details: prev.details || '',
    }))
  }, [consultationOptions, isArabic, location.search, location.state])

  // Removed unused: fileToDataUrl

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReceiptFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        // Removed setReceiptPreview usage
      }
      reader.readAsDataURL(file)
      toast.success(isArabic ? `تم تحميل: ${file.name}` : `Uploaded: ${file.name}`)
    }
  }

  const handleCaseFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const totalFiles = caseFiles.length + files.length
    if (totalFiles > 10) {
      toast.error(isArabic ? 'الحد الأقصى 10 ملفات' : 'Maximum 10 files allowed')
      return
    }
    setCaseFiles((prev) => [...prev, ...files])
  }

  const handleNationalIdFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNationalIdFile(file)
      toast.success(isArabic ? `تم تحميل: ${file.name}` : `Uploaded: ${file.name}`)
    }
  }

  const removeCaseFile = (index: number) => {
    setCaseFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index))
  }

  const validateStep = (step: number) => {
    if (step === 1) {
      // Always allow moving from barcode to receipt upload
      return true
    }
    if (step === 2) {
      if (!receiptFile) {
        toast.error(isArabic ? 'يرجى رفع صورة الإيصال' : 'Please upload the payment receipt')
        return false
      }
      return true
    }
    if (step === 3) {
      if (!formData.name || !formData.email || !formData.phone || !formData.nationalNumber || !nationalIdFile) {
        toast.error(isArabic ? 'يرجى استكمال جميع البيانات ورفع الهوية الوطنية' : 'Please complete all details and upload National ID file')
        return false
      }
      return true
    }
    if (step === 4) {
      if (!formData.details.trim()) {
        toast.error(isArabic ? 'يرجى كتابة نص الشكوى' : 'Please enter the complaint text')
        return false
      }
      if (caseFiles.length < 1) {
        toast.error(isArabic ? 'يرجى رفع مرفق واحد على الأقل' : 'At least 1 attachment is required')
        return false
      }
      if (caseFiles.length > 10) {
        toast.error(isArabic ? 'الحد الأقصى 10 ملفات' : 'Maximum 10 files allowed')
        return false
      }
      return true
    }
    return false
  }

  const handleNext = () => {
    if (!validateStep(currentStep)) return
    setCurrentStep((prev) => Math.min(prev + 1, steps.length))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  // Removed unused: handleConfirmPayment

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (currentStep < steps.length) {
      handleNext()
      return
    }

    if (!validateStep(4)) return

    setIsLoading(true)
    try {
      // تحقق من القيم قبل الإرسال
      if (!formData.name || !formData.email || !formData.phone || !formData.nationalNumber || !receiptFile || !nationalIdFile) {
        toast.error(isArabic ? 'يرجى تعبئة جميع الحقول المطلوبة ورفع الملفات' : 'Please fill all required fields and upload files')
        setIsLoading(false)
        return
      }
      // طباعة القيم في الكونسول للمراجعة
      console.log('FullName:', formData.name)
      console.log('Email:', formData.email)
      console.log('Phone:', formData.phone)
      console.log('PaymentReceiptPath:', receiptFile)
      console.log('NationalNumber:', formData.nationalNumber)
      console.log('NationalIdentityPath:', nationalIdFile)
      console.log('ConsultationRequesAttachemnt:', caseFiles)
      console.log('Details:', formData.details)

      // إرسال القيم مباشرة كـ input object وليس FormData
      await new Promise((resolve, reject) => {
        applyConsultation(
          {
            fullName: formData.name,
            email: formData.email,
            phone: formData.phone,
            paymentReceiptPath: receiptFile!,
            nationalNumber: formData.nationalNumber,
            nationalIdentityPath: nationalIdFile!,
            consultationRequesAttachemnt: caseFiles[0],
            details: formData.details,
          },
          {
            onSuccess: () => {
              setSubmitted(true)
              toast.success(isArabic ? 'تم إرسال طلب الاستشارة بنجاح' : 'Consultation request submitted successfully')
              resolve(true)
            },
            onError: (err: any) => {
              toast.error(err?.message || (isArabic ? 'تعذر إرسال الطلب' : 'Failed to submit request'))
              reject(err)
            },
          }
        )
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`p-8 bg-primary-black border-2 border-gold/20 rounded-xl max-w-3xl mx-auto shadow-2xl text-center ${pageSpacing}`}
        dir="rtl"
      >
        <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-6">
          <Check size={28} className="text-green-400" />
        </div>
        <h2 className="text-heading-2 font-cairo font-bold text-gold mb-3">
          {isArabic ? 'تم استلام طلبك' : 'Your request has been received'}
        </h2>
        <p className="text-gray-300 font-cairo mb-6">
          {isArabic
            ? 'سيقوم فريقنا بمراجعة الدفع والإيصال ومرفقات الدعوى والتواصل معك قريباً.'
            : 'Our team will review the payment, receipt, and case attachments and contact you soon.'}
        </p>
        <Button
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-gradient-to-r from-gold to-gold-light text-black rounded-xl font-cairo"
        >
          {isArabic ? 'العودة للرئيسية' : 'Back to Home'}
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`p-8 bg-primary-black border-2 border-gold/20 rounded-xl max-w-3xl mx-auto shadow-2xl ${pageSpacing}`}
      dir="rtl"
    >
      <div className="flex items-center justify-between mb-6 gap-4">
        {onClose && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={onClose}
            className="text-gray-400 hover:text-gold transition-colors"
          >
            <X size={24} />
          </motion.button>
        )}
        <h2 className="text-heading-2 font-cairo font-bold text-gold flex-1 text-right">
          {isArabic ? 'حجز استشارة قانونية' : 'Book a Legal Consultation'}
        </h2>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between gap-2 mb-3">
          {steps.map((step) => {
            const active = step.id === currentStep
            const completed = step.id < currentStep
            return (
              <div key={step.id} className="flex-1 text-center">
                <div className={`mx-auto w-9 h-9 rounded-full flex items-center justify-center border text-sm font-bold ${completed ? 'bg-gold text-black border-gold' : active ? 'bg-gold/20 text-gold border-gold' : 'bg-charcoal text-gray-400 border-gold/20'}`}>
                  {completed ? <Check size={16} /> : step.id}
                </div>
                <p className={`mt-2 text-xs font-cairo ${active || completed ? 'text-gold' : 'text-gray-500'}`}>
                  {isArabic ? step.titleAr : step.titleEn}
                </p>
              </div>
            )
          })}
        </div>
        <div className="h-2 bg-charcoal rounded-full overflow-hidden border border-gold/10">
          <div
            className="h-full bg-gradient-to-r from-gold to-gold-light transition-all duration-500"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-6 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center">
              {/* Show service name and price if available */}
              {formData.service && (
                <>
                  <h3 className="text-xl font-cairo font-bold text-gold mb-1 text-center">
                    {isArabic ? 'الخدمة:' : 'Service:'} {formData.service}
                  </h3>
                  <p className="text-lg font-cairo text-gold-light mb-2 text-center">
                    {isArabic ? 'المبلغ:' : 'Amount:'} {consultationOptions.find(opt => opt.key === formData.consultationKey)?.amountSar || 750} {isArabic ? 'ر.س' : 'SAR'}
                  </p>
                </>
              )}
              <img src={barcodeImg} alt="barcode" className="w-56 h-56 rounded-lg border-2 border-gold/30 bg-white" />
              <p className="mt-4 text-lg text-gold font-cairo font-bold text-center">
                {isArabic ? 'يرجى مسح الباركود أعلاه والدفع عبر التطبيق البنكي، ثم اضغط متابعة لرفع إيصال الدفع.' : 'Please scan the barcode above and pay via your banking app, then click continue to upload the payment receipt.'}
              </p>
            </div>
            <Button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="w-full font-cairo py-5 text-lg bg-gradient-to-r from-gold to-gold-light text-black rounded-xl shadow-xl hover:scale-105 transition-all duration-300"
            >
              {isArabic ? 'تم الدفع - المتابعة' : 'Payment done - Continue'}
            </Button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <label className="label-gold">
                {isArabic ? 'صورة إيصال الدفع *' : 'Payment Receipt Image *'}
              </label>
              <label className="flex items-center justify-center gap-3 px-4 py-4 bg-charcoal border-2 border-dashed border-gold/30 rounded-lg hover:border-gold/60 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  onChange={handleReceiptChange}
                  className="hidden"
                />
                <Upload size={20} className="text-gold" />
                <span className="text-gold font-cairo">
                  {receiptFile
                    ? receiptFile.name
                    : isArabic
                      ? 'اختر صورة الإيصال'
                      : 'Choose receipt image'}
                </span>
              </label>
            </div>

            <p className="text-sm text-gray-400 font-cairo">
              {isArabic
                ? 'يجب إرفاق صورة واضحة للإيصال قبل الانتقال للخطوة التالية.'
                : 'A clear receipt image is required before moving to the next step.'}
            </p>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label-gold">
                  {isArabic ? 'الاسم الكامل *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-gold"
                />
              </div>
              <div>
                <label className="label-gold">
                  {isArabic ? 'رقم الهوية الوطنية *' : 'National ID Number *'}
                </label>
                <input
                  type="text"
                  name="nationalNumber"
                  value={formData.nationalNumber}
                  onChange={handleChange}
                  required
                  className="input-gold"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label-gold">
                  {isArabic ? 'رقم الجوال *' : 'Phone *'}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="input-gold"
                />
              </div>
              <div>
                <label className="label-gold">
                  {isArabic ? 'البريد الإلكتروني *' : 'Email *'}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-gold"
                />
              </div>
            </div>
            <div>
              <label className="label-gold">
                {isArabic ? 'رفع الهوية الوطنية *' : 'Upload National ID *'}
              </label>
              <label className="flex items-center justify-center gap-3 px-4 py-4 bg-charcoal border-2 border-dashed border-gold/30 rounded-lg hover:border-gold/60 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleNationalIdFileChange}
                  className="hidden"
                />
                <Upload size={20} className="text-gold" />
                <span className="text-gold font-cairo">
                  {nationalIdFile ? nationalIdFile.name : (isArabic ? 'اختر ملف الهوية الوطنية' : 'Choose National ID file')}
                </span>
              </label>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-5">
            <div>
              <label className="label-gold">
                {isArabic ? 'نص الشكوى *' : 'Complaint Text *'}
              </label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                rows={5}
                required
                className="input-gold resize-none"
                placeholder={isArabic ? 'اكتب ملخص الواقعة والطلبات المطلوبة' : 'Write a summary of the facts and requested relief'}
              />
            </div>

            <div>
              <label className="label-gold">
                {isArabic ? 'مرفقات الاستشارة *' : 'Consultation Attachments *'}
              </label>
              <label className="flex items-center justify-center gap-3 px-4 py-4 bg-charcoal border-2 border-dashed border-gold/30 rounded-lg hover:border-gold/60 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  multiple
                  onChange={handleCaseFilesChange}
                  className="hidden"
                />
                <Upload size={20} className="text-gold" />
                <span className="text-gold font-cairo">
                  {isArabic ? 'اختر مرفق أو أكثر' : 'Choose one or more attachments'}
                </span>
              </label>
              <p className="text-xs text-gray-500 font-cairo mt-2">
                {isArabic
                  ? 'الحد الأدنى مرفق واحد والحد الأقصى 10 مرفقات.'
                  : 'Minimum 1 and maximum 10 attachments.'}
              </p>
            </div>

            <div className="space-y-3">
              {caseFiles.map((file, index) => (
                <div key={`${file.name}-${index}`} className="flex items-center justify-between gap-4 p-3 rounded-lg border border-gold/15 bg-charcoal">
                  <button
                    type="button"
                    onClick={() => removeCaseFile(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <XCircle size={18} />
                  </button>
                  <div className="text-right flex-1">
                    <p className="text-white font-cairo text-sm">{file.name}</p>
                    <p className="text-gray-500 text-xs font-cairo">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          {currentStep > 1 ? (
            <Button
              type="button"
              onClick={handleBack}
              className="flex-1 font-cairo py-4 border border-gold/20 bg-transparent text-gold rounded-xl"
            >
              <ArrowRight size={18} />
              {isArabic ? 'رجوع' : 'Back'}
            </Button>
          ) : (
            <div className="flex-1" />
          )}

          {currentStep < steps.length ? (
            <Button
              type="button"
              onClick={handleNext}
              className="flex-1 font-cairo py-4 bg-gradient-to-r from-gold to-gold-light text-black rounded-xl shadow-xl hover:scale-105 transition-all duration-300"
            >
              {isArabic ? 'التالي' : 'Next'}
              <ArrowLeft size={18} />
            </Button>
          ) : (
            <Button
              type="submit"
              isLoading={isLoading || isApplying}
              className="flex-1 font-cairo py-4 bg-gradient-to-r from-gold to-gold-light text-black rounded-xl shadow-xl hover:scale-105 transition-all duration-300"
            >
              {isArabic ? 'إرسال الطلب' : 'Submit Request'}
            </Button>
          )}
        </div>
      </form>
    </motion.div>
  )
}