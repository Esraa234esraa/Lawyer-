import { motion } from 'framer-motion'
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import NewsCard from '@/components/ui/NewsCard'
import { useLanguage } from '@/hooks/useLanguage'
import { newsData } from '@/data/mockData'
import { ArrowRight } from 'lucide-react'

export default function News() {
  const { isArabic } = useLanguage()
  const { id } = useParams()
  const [filter, setFilter] = useState<string | null>(null)

  const newsItem = id ? newsData.find((n) => n.id === parseInt(id)) : null

  if (id && newsItem) {
    return (
      <div dir="rtl" className="pt-24">
        <section className="section-padding bg-charcoal">
          <div className="container-max">
            <Link to="/news" className="text-gold hover:text-gold-light mb-4 inline-flex items-center gap-2 font-cairo">
              <ArrowRight size={20} />
              {isArabic ? 'العودة للأخبار' : 'Back to News'}
            </Link>

            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div className="md:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <img
                    src={newsItem.image}
                    alt={isArabic ? newsItem.titleAr : newsItem.titleEn}
                    className="rounded-lg border-2 border-gold/20 w-full mb-8"
                  />

                  <div className="mb-4">
                    <span className="text-xs bg-gold/20 text-gold px-3 py-1 rounded-full font-cairo">
                      {isArabic ? newsItem.category : newsItem.categoryEn}
                    </span>
                  </div>

                  <h1 className="text-heading-1 font-cairo font-bold mb-4 text-gradient">
                    {isArabic ? newsItem.titleAr : newsItem.titleEn}
                  </h1>

                  <div className="flex items-center gap-4 text-gray-400 font-cairo mb-8 flex-row-reverse">
                    <span>{isArabic ? newsItem.author : newsItem.authorEn}</span>
                    <span>•</span>
                    <span>{new Date(newsItem.date).toLocaleDateString('ar-SA')}</span>
                  </div>

                  <div className="prose prose-invert max-w-none text-gray-300 font-cairo text-right leading-relaxed">
                    <p className="mb-4">{isArabic ? newsItem.content : newsItem.contentEn}</p>
                    <p className="mb-4">{isArabic ? newsItem.content : newsItem.contentEn}</p>
                    <p>{isArabic ? newsItem.content : newsItem.contentEn}</p>
                  </div>
                </motion.div>
              </div>

              {/* Related News */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h3 className="text-heading-3 font-cairo font-bold mb-4 text-gold">
                  {isArabic ? 'أخبار ذات صلة' : 'Related News'}
                </h3>
                <div className="space-y-4">
                  {newsData.slice(0, 3).map((news) => (
                    <Link key={news.id} to={`/news/${news.id}`}>
                      <div className="p-4 bg-primary-black border border-gold/20 rounded-lg hover:border-gold/50 transition-all cursor-pointer text-right">
                        <h4 className="text-sm font-cairo font-semibold text-gold mb-2">
                          {isArabic ? news.titleAr : news.titleEn}
                        </h4>
                        <p className="text-xs text-gray-400 font-cairo">
                          {new Date(news.date).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  const categories = [...new Set(newsData.map((n) => n.category))]
  const filteredNews = filter
    ? newsData.filter((n) => n.category === filter)
    : newsData

  return (
    <div dir="rtl" className="pt-24">
      {/* Hero */}
      <section className="section-padding bg-charcoal">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-heading-1 font-cairo font-bold mb-4 text-gradient">
              {isArabic ? 'الأخبار والمقالات' : 'News & Articles'}
            </h1>
            <p className="text-gray-300 font-cairo max-w-2xl mx-auto">
              {isArabic
                ? 'تابع أحدث التطورات القانونية والمقالات المتخصصة'
                : 'Follow the latest legal developments and specialized articles'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-primary-black border-b border-gold/20">
        <div className="container-max">
          <div className="flex justify-end gap-3 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setFilter(null)}
              className={`px-4 py-2 rounded-lg font-cairo transition-all ${
                !filter
                  ? 'bg-gold text-primary-black'
                  : 'bg-charcoal border border-gold/20 text-gold hover:border-gold'
              }`}
            >
              {isArabic ? 'الكل' : 'All'}
            </motion.button>
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-lg font-cairo transition-all ${
                  filter === category
                    ? 'bg-gold text-primary-black'
                    : 'bg-charcoal border border-gold/20 text-gold hover:border-gold'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="section-padding bg-charcoal">
        <div className="container-max">
          <div className="grid md:grid-cols-3 gap-8">
            {filteredNews.map((news) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Link to={`/news/${news.id}`}>
                  <NewsCard
                    titleAr={news.titleAr}
                    titleEn={news.titleEn}
                    descriptionAr={news.descriptionAr}
                    descriptionEn={news.contentEn}
                    date={news.date}
                    categoryAr={news.category}
                    categoryEn={news.categoryEn}
                    image={news.image}
                    authorAr={news.author}
                    authorEn={news.authorEn}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}