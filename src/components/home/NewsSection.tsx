import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Loading from '@/components/ui/Loading'
import NewsCard from '@/components/ui/NewsCard'

type NewsSectionProps = {
  news: any[]
  isLoading: boolean
  resolveImagePath: (filePath?: string | null) => string
}

export default function NewsSection({ news, isLoading, resolveImagePath }: NewsSectionProps) {
  return (
    <section className="section-padding bg-charcoal">
      <div className="container-max">
        <h2 className="text-heading-1 text-center text-gradient mb-12">آخر المستجدات القانونية</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-3">
              <Loading inline message="جاري تحميل الأخبار..." />
            </div>
          ) : (
            news.slice(0, 3).map((item) => (
              <motion.div key={item.id}>
                <Link to={`/news/${item.id}`}>
                  <NewsCard
                    titleAr={item.name}
                    titleEn={item.name}
                    descriptionAr={item.description}
                    descriptionEn={item.description}
                    date={String(item.actionDate)}
                    image={resolveImagePath(item.filePath)}
                    authorAr="أخبار المكتب"
                    authorEn="Firm News"
                  />
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}