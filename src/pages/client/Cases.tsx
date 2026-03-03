import { motion } from "framer-motion"
import { useLanguage } from "@/hooks/useLanguage"
import CaseCard from "@/components/ui/CaseCard"
import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"

export default function ClientCases() {
  const { isArabic } = useLanguage()
  const navigate = useNavigate()

  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [loading, _setLoading] = useState(false)

  const cases = [
    {
      id: 1,
      titleAr: "قضية نزاع عقاري",
      titleEn: "Real Estate Dispute",
      descriptionAr: "نزاع حول ملكية أرض.",
      descriptionEn: "Land ownership dispute.",
      typeAr: "عقاري",
      typeEn: "Real Estate",
      yearAr: "2024",
      yearEn: "2024",
      image: "/images/case1.jpg",
      files: [],
    },
    {
      id: 2,
      titleAr: "قضية تجارية",
      titleEn: "Commercial Case",
      descriptionAr: "نزاع متعلق بعقد تجاري.",
      descriptionEn: "Dispute regarding commercial contract.",
      typeAr: "تجاري",
      typeEn: "Commercial",
      yearAr: "2023",
      yearEn: "2023",
      image: "/images/case2.jpg",
      files: [],
    },
  ]

  // 🎯 Filter + Search Logic
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchesSearch = (isArabic ? c.titleAr : c.titleEn)
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesFilter =
        filter === "all" ||
        (isArabic ? c.typeAr : c.typeEn) === filter

      return matchesSearch && matchesFilter
    })
  }, [search, filter, isArabic])

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
          <option value={isArabic ? "عقاري" : "Real Estate"}>
            {isArabic ? "عقاري" : "Real Estate"}
          </option>
          <option value={isArabic ? "تجاري" : "Commercial"}>
            {isArabic ? "تجاري" : "Commercial"}
          </option>
        </select>
      </div>

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
          {filteredCases.map((caseItem) => (
            <motion.div key={caseItem.id} variants={item}>
              <CaseCard
                {...caseItem}
                onClick={() => navigate(`/case/${caseItem.id}`)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}