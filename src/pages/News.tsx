import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import NewsCard from '@/components/ui/NewsCard'
import { useGetVisibleNews } from '@/hooks/news'
import { ArrowRight } from 'lucide-react'
import Loading from '@/components/ui/Loading'
import Seo from '@/components/shared/Seo'
import { DEFAULT_SOCIAL_IMAGE, pageUrl } from '@/constants/site'

export default function News() {
  const { id } = useParams()
  const { data, error, isLoading, isFetching } = useGetVisibleNews()

  const newsData = (data?.data || []).filter((news) => news.isActive && news.isVisible)

  const resolveImagePath = (filePath: string) => {
    if (!filePath) return ''
    if (filePath.startsWith('http')) return filePath

    const normalized = filePath.replace(/^\/?wwwroot\/?/i, '')
    return `https://lawm.runasp.net/${normalized}`
  }

  const newsItem = useMemo(() => {
    if (!id) return null
    return newsData.find((n) => n.id === id) || null
  }, [id, newsData])

  const relatedNews = useMemo(() => {
    if (!newsItem) return newsData.slice(0, 3)
    return newsData.filter((n) => n.id !== newsItem.id).slice(0, 3)
  }, [newsData, newsItem])

  const noNewsMessage = useMemo(() => {
    if (error instanceof Error && error.message.trim().length > 0) {
      return error.message
    }

    return 'لا توجد أخبار متاحة حالياً'
  }, [error])

  if (id && newsItem) {
    return (
      <div dir="rtl" className="pt-24">
        <Seo
          title={newsItem.name}
          description={newsItem.description}
          image={resolveImagePath(newsItem.filePath) || DEFAULT_SOCIAL_IMAGE}
          url={pageUrl(`/news/${newsItem.id}`)}
          type="article"
        />
        <section className="section-padding bg-charcoal">
          <div className="container-max">
            <Link to="/news" className="text-gold hover:text-gold-light mb-4 inline-flex items-center gap-2 font-cairo">
              <ArrowRight size={20} />
              العودة للأخبار
            </Link>

            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div className="md:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <img
                    src={resolveImagePath(newsItem.filePath)}
                    alt={newsItem.name}
                    className="rounded-lg border-2 border-gold/20 w-full mb-8"
                  />

                  <div className="mb-4">
                    <span className="text-xs text-gold font-cairo">أخبار المكتب</span>
                  </div>

                  <h1 className="text-heading-1 font-cairo font-bold mb-4 text-gradient">
                    {newsItem.name}
                  </h1>

                  <div className="flex items-center gap-4 text-gray-400 font-cairo mb-8 flex-row-reverse">
                    <span>أخبار المكتب</span>
                    <span>•</span>
                    <span>{new Date(newsItem.actionDate).toLocaleDateString('ar-SA')}</span>
                  </div>

                  <div className="prose prose-invert max-w-none text-gray-300 font-cairo text-right leading-relaxed">
                    <p className="mb-4">{newsItem.description}</p>
                    <p className="mb-4">{newsItem.description}</p>
                    <p>{newsItem.description}</p>
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
                  أخبار ذات صلة
                </h3>
                <div className="space-y-4">
                  {relatedNews.map((news) => (
                    <Link key={news.id} to={`/news/${news.id}`}>
                      <div className="p-4 bg-primary-black border border-gold/20 rounded-lg hover:border-gold/50 transition-all cursor-pointer text-right">
                        <h4 className="text-sm font-cairo font-semibold text-gold mb-2">
                          {news.name}
                        </h4>
                        <p className="text-xs text-gray-400 font-cairo">
                          {new Date(news.actionDate).toLocaleDateString('ar-SA')}
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

  return (
    <div dir="rtl" className="pt-24">
      <Seo
        title="الأخبار والمقالات"
        description="تابع أحدث الأخبار والمقالات القانونية الصادرة عن مكتب مريم بنت محمد للمحاماة والاستشارات القانونية."
        url={pageUrl('/news')}
        image={DEFAULT_SOCIAL_IMAGE}
      />
      {/* Hero */}
      <section className="section-padding bg-charcoal">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-heading-1 font-cairo font-bold mb-4 text-gradient">الأخبار والمقالات</h1>
            <p className="text-gray-300 font-cairo max-w-2xl mx-auto">تابع أحدث التطورات القانونية والمقالات المتخصصة</p>
          </motion.div>
        </div>
      </section>

      {(isLoading || isFetching) && (
        <section className="py-4 bg-charcoal">
          <div className="container-max">
            <Loading inline message="جاري تحميل الأخبار..." />
          </div>
        </section>
      )}

      {/* News Grid */}
      <section className="section-padding bg-charcoal">
        <div className="container-max">
          {!isLoading && newsData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-300 font-cairo text-lg">{noNewsMessage}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {newsData.map((news) => (
                <motion.div
                  key={news.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Link to={`/news/${news.id}`}>
                    <NewsCard
                      titleAr={news.name}
                      titleEn={news.name}
                      descriptionAr={news.description}
                      descriptionEn={news.description}
                      date={String(news.actionDate)}
                      image={resolveImagePath(news.filePath)}
                      authorAr="أخبار المكتب"
                      authorEn="Firm News"
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}