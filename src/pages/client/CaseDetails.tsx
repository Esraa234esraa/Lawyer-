import { useParams, useNavigate } from "react-router-dom"
import { useLanguage } from "@/hooks/useLanguage"
import { motion } from "framer-motion"
import { useAdminStore } from "@/store/adminStore"

export default function CaseDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isArabic } = useLanguage()
  const { cases, caseTypes, clients } = useAdminStore()

  const caseId = Number(id)
  const caseData = cases.find((item) => item.id === caseId)
  const caseTypeName = caseData ? (caseTypes.find((type) => type.id === caseData.typeArId)?.nameAr || "غير محدد") : ""
  const clientName = caseData ? (clients.find((client) => client.id === caseData.clientId)?.nameAr || "غير محدد") : ""

  const handleOpenAttachment = (url?: string) => {
    if (!url) return
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleDownloadAttachment = (url: string | undefined, fileName: string) => {
    if (!url) return
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!caseData) {
    return (
      <div dir={isArabic ? "rtl" : "ltr"} className="space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="text-gold hover:underline font-cairo"
        >
          {isArabic ? "← رجوع" : "← Back"}
        </button>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-200 font-cairo">
          {isArabic ? "القضية غير موجودة أو تم حذفها." : "Case not found or deleted."}
        </div>
      </div>
    )
  }

  const statusColor =
    caseData.statusAr === "قيد العمل"
      ? "bg-blue-500/20 text-blue-300 border-blue-400/30"
      : caseData.statusAr === "عاجلة"
      ? "bg-red-500/20 text-red-300 border-red-400/30"
      : caseData.statusAr === "مغلقة"
      ? "bg-purple-500/20 text-purple-300 border-purple-400/30"
      : caseData.statusAr === "منتهية"
      ? "bg-green-500/20 text-green-300 border-green-400/30"
      : "bg-gray-500/20 text-gray-300 border-gray-400/30"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      dir={isArabic ? "rtl" : "ltr"}
      className="space-y-8"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="text-gold hover:underline font-cairo"
      >
        {isArabic ? "← رجوع" : "← Back"}
      </button>

      {/* Title */}
      <h1 className="text-heading-1 text-gold font-cairo">
        {caseData.titleAr}
      </h1>

      {/* Image */}
      <div className="rounded-xl overflow-hidden border border-gold/20">
        <img
          src={caseData.image}
          alt={caseData.titleAr}
          className="w-full h-72 object-cover"
        />
      </div>

      {/* Info Box */}
      <div className="bg-charcoal border border-gold/20 rounded-xl p-8 space-y-6">

        {/* Type + Year */}
        <div className="flex flex-wrap gap-4">
          <span className="bg-gold/20 text-gold px-4 py-2 rounded-full text-sm">
            {caseData.yearAr}
          </span>

          <span className="border border-gold/30 text-gold px-4 py-2 rounded-full text-sm">
            {caseTypeName}
          </span>

          <span className="border border-gold/30 text-gold px-4 py-2 rounded-full text-sm">
            {isArabic ? `العميل: ${clientName}` : `Client: ${clientName}`}
          </span>

          <span
            className={`border px-4 py-2 rounded-full text-sm ${statusColor}`}
          >
            {caseData.statusAr}
          </span>
        </div>

        {/* Description */}
        <div>
          <h2 className="text-gold mb-3 font-cairo">
            {isArabic ? "وصف القضية" : "Case Description"}
          </h2>

          <p className="text-gray-300 leading-relaxed font-cairo">
            {caseData.descriptionAr}
          </p>
        </div>

        {/* Files */}
        {caseData.attachments.length > 0 && (
          <div>
            <h2 className="text-gold mb-4 font-cairo">
              {isArabic ? "مرفقات القضية" : "Case Attachments"}
            </h2>

            <div className="space-y-3">
              {caseData.attachments.map((file) => (
                <div
                  key={file.id}
                  className="flex flex-wrap justify-between items-center gap-3 bg-primary-black border border-gold/10 hover:border-gold/40 rounded-lg px-4 py-3 transition"
                >
                  <div className="space-y-1">
                    <p className="text-gray-200 font-cairo">{file.nameAr}</p>
                    <p className="text-xs text-gray-400">{file.fileName}</p>
                    <p className="text-xs text-gray-500">
                      {(file.fileSize / 1024).toFixed(2)} KB - {file.uploadedAt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenAttachment(file.dataUrl)}
                      disabled={!file.dataUrl}
                      className="px-2 py-1 rounded-md bg-gold/15 text-gold text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isArabic ? "فتح" : "Open"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadAttachment(file.dataUrl, file.fileName)}
                      disabled={!file.dataUrl}
                      className="px-2 py-1 rounded-md bg-blue-500/15 text-blue-300 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isArabic ? "تحميل" : "Download"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}