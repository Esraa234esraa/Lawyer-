import { motion } from 'framer-motion'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import ServiceCard from '@/components/ui/ServiceCard'
import NewsCard from '@/components/ui/NewsCard'
// import TestimonialCard from '@/components/ui/TestimonialCard'
import { useLanguage } from '@/hooks/useLanguage'
import { servicesData, newsData, statsData } from '@/data/mockData'
import { Link } from 'react-router-dom'

export default function Home() {
  const { isArabic } = useLanguage()
  const [_selectedService, setSelectedService] = useState<number | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  }

  return (
    <div dir="rtl">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400&h=900&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-primary-black/80 to-primary-black z-10" />

        {/* Content */}
        <div className="container-max relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              className="text-display font-cairo font-bold mb-6 text-gradient"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              {isArabic ? 'التميز القانوني للمؤسسات الحديثة' : 'Premium Legal Excellence for Modern Business'}
            </motion.h1>

            <motion.p
              className="text-lg text-gray-300 mb-8 font-cairo max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              {isArabic
                ? 'نقدم خدمات قانونية متخصصة عالية الجودة للشركات والأفراد مع التزام تام بالشفافية والنزاهة'
                : 'Providing specialized high-quality legal services for corporations and individuals with full commitment to transparency and integrity'}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <Link to="/contact">
                <Button size="lg" variant="primary" className="font-cairo flex-row-reverse">
                  {isArabic ? 'احجز استشارة مجانية' : 'Schedule Free Consultation'}
                  <ArrowLeft className="me-2" size={20} />
                </Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="secondary" className="font-cairo">
                  {isArabic ? 'اكتشف الخدمات' : 'Discover Services'}
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-gold/20"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {statsData.map((stat, idx) => (
                <motion.div key={idx} variants={itemVariants} className="text-center">
                  <p className="text-3xl font-bold text-gold font-cairo mb-2">{isArabic ? stat.numberAr : stat.numberEn}</p>
                  <p className="text-sm text-gray-400 font-cairo">{isArabic ? stat.labelAr : stat.labelEn}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <ChevronDown size={32} className="text-gold" />
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-primary-black">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-heading-1 font-cairo font-bold mb-4 text-gradient">
              {isArabic ? 'خدماتنا المتخصصة' : 'Our Specialized Services'}
            </h2>
            <p className="text-gray-300 font-cairo max-w-2xl mx-auto">
              {isArabic
                ? 'نقدم مجموعة شاملة من الخدمات القانونية المتخصصة لجميع القطاعات'
                : 'We provide a comprehensive range of specialized legal services for all sectors'}
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {servicesData.map((service) => (
              <motion.div key={service.id} variants={itemVariants}>
                <ServiceCard
                  titleAr={service.titleAr}
                  titleEn={service.titleEn}
                  descriptionAr={service.descriptionAr}
                  descriptionEn={service.descriptionEn}
                  icon={service.icon}
                  features={service.features}
                  onClick={() => setSelectedService(service.id)}
                />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Link to="/services">
              <Button size="lg" variant="secondary" className="font-cairo">
                {isArabic ? 'عرض جميع الخدمات' : 'View All Services'}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding bg-charcoal">
        <div className="container-max">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=500&fit=crop"
                alt="About"
                className="rounded-lg border-2 border-gold/20"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-right"
            >
              <h2 className="text-heading-1 font-cairo font-bold mb-4 text-gradient">
                {isArabic ? 'من نحن' : 'About Us'}
              </h2>
              <p className="text-gray-300 font-cairo mb-4">
                {isArabic
                  ? 'نحن مكتب متخصص في تقديم الخدمات القانونية المتميزة مع أكثر من 20 سنة من الخبرة في مجال القانون'
                  : 'We are a specialized law office providing premium legal services with over 20 years of experience'}
              </p>
              <p className="text-gray-300 font-cairo mb-6">
                {isArabic
                  ? 'فريقنا يتكون من محامين وخبراء قانونيين متخصصين في مختلف المجالات القانونية'
                  : 'Our team consists of lawyers and legal experts specialized in various fields of law'}
              </p>
              <Link to="/about">
                <Button size="lg" variant="primary" className="font-cairo flex-row-reverse">
                  {isArabic ? 'تعرف على المزيد' : 'Learn More'}
                  <ArrowLeft className="me-2" size={20} />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Opportunities Section - جديد */}
      <section className="section-padding bg-primary-black">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-heading-1 font-cairo font-bold mb-4 text-gradient">
              {isArabic ? 'الفرص الوظيفية والتدريبات' : 'Job Opportunities & Internships'}
            </h2>
            <p className="text-gray-300 font-cairo max-w-2xl mx-auto">
              {isArabic
                ? 'انضم إلى فريقنا واستفيد من فرص التدريب والعمل المميزة'
                : 'Join our team and take advantage of exceptional job and internship opportunities'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Internships Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="p-8 bg-charcoal border-2 border-gold/20 rounded-lg hover:border-gold/50 transition-all text-right"
            >
              <div className="text-5xl mb-4">🎓</div>
              <h3 className="text-heading-2 font-cairo font-bold text-gold mb-4">
                {isArabic ? 'برامج التدريب' : 'Internship Programs'}
              </h3>
              <p className="text-gray-300 font-cairo mb-6">
                {isArabic
                  ? 'برامج تدريب متخصصة تحت إشراف محامين ذوي خبرة في مختلف المجالات القانونية'
                  : 'Specialized internship programs under the supervision of experienced lawyers in various legal fields'}
              </p>
              <div className="space-y-2 mb-6">
                <p className="text-gold font-cairo font-semibold">✓ {isArabic ? 'مدة 3-6 أشهر' : '3-6 Months Duration'}</p>
                <p className="text-gold font-cairo font-semibold">✓ {isArabic ? 'خبرة عملية حقيقية' : 'Real Practical Experience'}</p>
                <p className="text-gold font-cairo font-semibold">✓ {isArabic ? 'شهادة معترف بها' : 'Recognized Certificate'}</p>
              </div>
              <Link to="/internships">
                <Button size="lg" variant="primary" className="w-full font-cairo flex-row-reverse">
                  {isArabic ? 'اختر التدريب' : 'Browse Internships'}
                  <ArrowLeft className="me-2" size={20} />
                </Button>
              </Link>
            </motion.div>

            {/* Jobs Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="p-8 bg-charcoal border-2 border-gold/20 rounded-lg hover:border-gold/50 transition-all text-right"
            >
              <div className="text-5xl mb-4">💼</div>
              <h3 className="text-heading-2 font-cairo font-bold text-gold mb-4">
                {isArabic ? 'الوظائف الشاغرة' : 'Job Openings'}
              </h3>
              <p className="text-gray-300 font-cairo mb-6">
                {isArabic
                  ? 'فرص وظيفية متميزة لمحامين وخبراء قانونيين بخبرات مختلفة'
                  : 'Exceptional job opportunities for lawyers and legal experts with various experience levels'}
              </p>
              <div className="space-y-2 mb-6">
                <p className="text-gold font-cairo font-semibold">✓ {isArabic ? 'رواتب منافسة' : 'Competitive Salaries'}</p>
                <p className="text-gold font-cairo font-semibold">✓ {isArabic ? 'فريق محترف' : 'Professional Team'}</p>
                <p className="text-gold font-cairo font-semibold">✓ {isArabic ? 'فرص تطور' : 'Career Growth'}</p>
              </div>
              <Link to="/jobs">
                <Button size="lg" variant="primary" className="w-full font-cairo flex-row-reverse">
                  {isArabic ? 'اختر الوظيفة' : 'Browse Jobs'}
                  <ArrowLeft className="me-2" size={20} />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="section-padding bg-primary-black">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-heading-1 font-cairo font-bold mb-4 text-gradient">
              {isArabic ? 'آخر الأخبار والمقالات' : 'Latest News & Articles'}
            </h2>
            <p className="text-gray-300 font-cairo max-w-2xl mx-auto">
              {isArabic
                ? 'تابع أحدث التطورات والتحديثات القانونية'
                : 'Follow the latest legal developments and updates'}
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {newsData.slice(0, 3).map((news) => (
              <motion.div key={news.id} variants={itemVariants}>
                <NewsCard
                  titleAr={news.titleAr}
                  titleEn={news.titleEn}
                  descriptionAr={news.descriptionAr}
                  descriptionEn=""
                  date={news.date}
                  categoryAr={news.category}
                  categoryEn={news.categoryEn}
                  image={news.image}
                  authorAr={news.author}
                  authorEn={news.authorEn}
                />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Link to="/news">
              <Button size="lg" variant="secondary" className="font-cairo">
                {isArabic ? 'عرض جميع الأخبار' : 'View All News'}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section className="section-padding bg-charcoal">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-heading-1 font-cairo font-bold mb-4 text-gradient">
              {isArabic ? 'تقييمات عملائنا' : 'Client Testimonials'}
            </h2>
            <p className="text-gray-300 font-cairo max-w-2xl mx-auto">
              {isArabic
                ? 'ماذا يقول عملاؤنا عن خدماتنا'
                : 'What our clients say about our services'}
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {testimonialData.map((testimonial) => (
              <motion.div key={testimonial.id} variants={itemVariants}>
                <TestimonialCard
                  nameAr={testimonial.nameAr}
                  nameEn={testimonial.nameEn}
                  positionAr={testimonial.positionAr}
                  positionEn={testimonial.positionEn}
                  testimonialAr={testimonial.testimonialAr}
                  testimonialEn={testimonial.testimonialEn}
                  rating={testimonial.rating}
                  image={testimonial.image}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-gold to-gold-light">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-heading-2 font-cairo font-bold mb-4 text-primary-black">
              {isArabic ? 'هل أنت مستعد للبدء؟' : 'Ready to Get Started?'}
            </h2>
            <p className="text-primary-black/80 mb-8 max-w-2xl mx-auto font-cairo">
              {isArabic
                ? 'تواصل معنا اليوم لحجز استشارة مجانية مع أحد محاميينا المتخصصين'
                : 'Contact us today to schedule a free consultation with one of our specialists'}
            </p>
            <Link to="/contact">
              <Button
                size="lg"
                variant="dark"
                className="font-cairo flex-row-reverse"
              >
                {isArabic ? 'احجز الآن' : 'Book Now'}
                <ArrowLeft className="me-2" size={20} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}