import { motion } from "framer-motion"
import { useLanguage } from "@/hooks/useLanguage"
import CaseCard from "@/components/ui/CaseCard"
import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useAdminStore } from "@/store/adminStore"
import { useAuth } from "@/hooks/useAuth"

export default function ClientCases() {
  const { isArabic } = useLanguage()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cases, caseTypes, clients } = useAdminStore()

  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [loading, _setLoading] = useState(false)

  const linkedClientId = useMemo(() => {
    const linkedClient = clients.find((client) => client.email === user?.email)
    if (linkedClient) return linkedClient.id
    if (user?.email === "client@lawfirm.ar") return 2
    return null
  }, [clients, user?.email])

  const relatedCases = useMemo(() => {
    if (!linkedClientId) return []
    return cases.filter((caseItem) => caseItem.clientId === linkedClientId)
  }, [cases, linkedClientId])

  // 🎯 Filter + Search Logic
  const filteredCases = useMemo(() => {
    return relatedCases.filter((c) => {
      const caseTypeName = caseTypes.find((type) => type.id === c.typeArId)?.nameAr || "غير محدد"
      const matchesSearch = c.titleAr
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesFilter =
        filter === "all" ||
        caseTypeName === filter

      return matchesSearch && matchesFilter
    })
  }, [search, filter, relatedCases, caseTypes])

  const caseTypeOptions = useMemo(() => {
    const uniqueTypeIds = Array.from(new Set(relatedCases.map((caseItem) => caseItem.typeArId)))
    return uniqueTypeIds
      .map((typeId) => caseTypes.find((type) => type.id === typeId)?.nameAr)
      .filter((name): name is string => Boolean(name))
  }, [relatedCases, caseTypes])

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div dir={isArabic ? "rtl" : "ltr"} className="space-y-8">

      {/* Title */}
      <h1 className="text-heading-1 text-gradient font-cairo">
        {isArabic ? "قضاياي" : "My Cases"}
      </h1>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4">

        <input
          type="text"
          placeholder={isArabic ? "ابحث عن قضية..." : "Search cases..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-charcoal border border-gold/20 rounded-lg px-4 py-3 text-white focus:border-gold outline-none"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-charcoal border border-gold/20 rounded-lg px-4 py-3 text-white focus:border-gold outline-none"
        >
          <option value="all">
            {isArabic ? "كل الأنواع" : "All Types"}
          </option>
          {caseTypeOptions.map((typeName) => (
            <option key={typeName} value={typeName}>
              {typeName}
            </option>
          ))}
        </select>
      </div>

      {!linkedClientId && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-amber-200 font-cairo">
          {isArabic ? "لا يوجد ملف عميل مرتبط بحسابك حالياً. يرجى التواصل مع الإدارة لربط القضايا بحسابك." : "No client profile is linked to your account yet."}
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-64 bg-charcoal animate-pulse rounded-xl border border-gold/10"
            />
          ))}
        </div>
      ) : (

        /* Cards */
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredCases.length === 0 && (
            <div className="md:col-span-2 lg:col-span-3 rounded-xl border border-gold/20 bg-charcoal/40 px-6 py-10 text-center text-gray-300 font-cairo">
              {isArabic ? "لا توجد قضايا مرتبطة بهذا العميل حالياً" : "No cases are linked to this client yet"}
            </div>
          )}
          {filteredCases.map((caseItem) => (
            <motion.div key={caseItem.id} variants={item}>
              <CaseCard
                titleAr={caseItem.titleAr}
                titleEn={caseItem.titleAr}
                descriptionAr={caseItem.descriptionAr}
                descriptionEn={caseItem.descriptionAr}
                typeAr={caseTypes.find((type) => type.id === caseItem.typeArId)?.nameAr || "غير محدد"}
                typeEn={caseTypes.find((type) => type.id === caseItem.typeArId)?.nameAr || "غير محدد"}
                yearAr={caseItem.yearAr}
                yearEn={caseItem.yearAr}
                image={caseItem.image}
                onClick={() => navigate(`/case/${caseItem.id}`)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}