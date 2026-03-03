import { useParams, useNavigate } from "react-router-dom"
import { useLanguage } from "@/hooks/useLanguage"
import { motion } from "framer-motion"

export default function CaseDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isArabic } = useLanguage()

  // ⚠️ مؤقتاً بيانات ثابتة – بعدين تجيبيها من API حسب الـ id
  const caseData = {
    id,
    titleAr: "قضية نزاع عقاري",
    titleEn: "Real Estate Dispute",
    descriptionAr:
      "نزاع قانوني بين طرفين حول ملكية قطعة أرض في منطقة سكنية، وتشمل القضية مستندات ملكية وتقارير خبراء.",
    descriptionEn:
      "A legal dispute between two parties regarding ownership of residential land, including ownership documents and expert reports.",
    typeAr: "عقاري",
    typeEn: "Real Estate",
    yearAr: "2024",
    yearEn: "2024",
    statusAr: "قيد المراجعة",
    statusEn: "Under Review",
    image: "/images/case1.jpg",
    files: [
      { name: "عقد الملكية.pdf", url: "/files/contract.pdf" },
      { name: "تقرير الخبير.pdf", url: "/files/report.pdf" },
    ],
  }

  const statusColor =
    caseData.statusEn === "Under Review"
      ? "bg-yellow-500/20 text-yellow-400 border-yellow-400/30"
      : "bg-green-500/20 text-green-400 border-green-400/30"

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
        {isArabic ? caseData.titleAr : caseData.titleEn}
      </h1>

      {/* Image */}
      <div className="rounded-xl overflow-hidden border border-gold/20">
        <img
          src={caseData.image}
          alt={isArabic ? caseData.titleAr : caseData.titleEn}
          className="w-full h-72 object-cover"
        />
      </div>

      {/* Info Box */}
      <div className="bg-charcoal border border-gold/20 rounded-xl p-8 space-y-6">

        {/* Type + Year */}
        <div className="flex flex-wrap gap-4">
          <span className="bg-gold/20 text-gold px-4 py-2 rounded-full text-sm">
            {isArabic ? caseData.yearAr : caseData.yearEn}
          </span>

          <span className="border border-gold/30 text-gold px-4 py-2 rounded-full text-sm">
            {isArabic ? caseData.typeAr : caseData.typeEn}
          </span>

          <span
            className={`border px-4 py-2 rounded-full text-sm ${statusColor}`}
          >
            {isArabic ? caseData.statusAr : caseData.statusEn}
          </span>
        </div>

        {/* Description */}
        <div>
          <h2 className="text-gold mb-3 font-cairo">
            {isArabic ? "وصف القضية" : "Case Description"}
          </h2>

          <p className="text-gray-300 leading-relaxed font-cairo">
            {isArabic
              ? caseData.descriptionAr
              : caseData.descriptionEn}
          </p>
        </div>

        {/* Files */}
        {caseData.files.length > 0 && (
          <div>
            <h2 className="text-gold mb-4 font-cairo">
              {isArabic ? "ملفات القضية" : "Case Files"}
            </h2>

            <div className="space-y-3">
              {caseData.files.map((file, index) => (
                <a
                  key={index}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-between items-center bg-primary-black border border-gold/10 hover:border-gold/40 rounded-lg px-4 py-3 transition"
                >
                  <span className="text-gray-300">{file.name}</span>
                  <span className="text-gold text-sm">
                    {isArabic ? "تحميل" : "Download"}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}