import { motion } from 'framer-motion'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import ServiceCard from '@/components/ui/ServiceCard'
import NewsCard from '@/components/ui/NewsCard'
// import TestimonialCard from '@/components/ui/TestimonialCard'
import { useLanguage } from '@/hooks/useLanguage'
import {  statsData } from '@/data/mockData'
// import { useAdminStore } from '@/store/adminStore'
import { Link } from 'react-router-dom'
import { useGetServices } from '@/hooks/services'
import { useGetVisibleNews } from '@/hooks/news'
export default function Home() {
  const { isArabic } = useLanguage()
  const [_selectedService, _setSelectedService] = useState<number | null>(null)
  // ✅ Services API
  const { data: servicesData, isLoading: servicesLoading } = useGetServices()
  const services = servicesData?.data || []

  // ✅ News API
  const { data: newsResponse, isLoading: newsLoading } = useGetVisibleNews()
  const newsList = newsResponse?.data || []
  // const containerVariants = {
  //   hidden: { opacity: 0 },
  //   visible: {
  //     opacity: 1,
  //     transition: {
  //       staggerChildren: 0.1,
  //       delayChildren: 0.3,
  //     },
  //   },
  // }
   // ✅ fix image path
  const resolveImagePath = (filePath: string) => {
    if (!filePath) return ''
    const trimmedPath = filePath.trim()
    if (trimmedPath.startsWith('http')) return trimmedPath
    const normalized = trimmedPath.replace(/^\/?wwwroot\/?/i, '').replace(/^\/+/, '')
    return `https://lawm.runasp.net/${normalized}`
  }

  // const itemVariants = {
  //   hidden: { opacity: 0, y: 20 },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     transition: { duration: 0.8 },
  //   },
  // }

  // const headingTextAr = 'أهلاً بك في مكتبي القانوني'
  // const headingTextEn = 'Welcome to my law office'
  // const headingLetters = (isArabic ? headingTextAr : headingTextEn).split('')

  // const headingContainer = {
  //   hidden: { opacity: 0 },
  //   visible: {
  //     opacity: 1,
  //     transition: {
  //       staggerChildren: 0.04,
  //       delayChildren: 0.2,
  //     },
  //   },
  // }

  // const headingLetter = {
  //   hidden: { opacity: 0, y: 8 },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     transition: { duration: 0.25 },
  //   },
  // }

  
  // const nameLetters = (isArabic ? nameTextAr : nameTextEn).split('')

  // const nameContainer = {
  //   hidden: { opacity: 0 },
  //   visible: {
  //     opacity: 1,
  //     transition: {
  //       staggerChildren: 0.05,
  //       delayChildren: 0.4,
  //     },
  //   },
  // }

  // const nameLetter = {
  //   hidden: { opacity: 0, y: 10 },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     transition: { duration: 0.25 },
  //   },
  // }

  return (
    <div dir="rtl">
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-24 pb-10 px-4 sm:px-6">

        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400&h=900&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-primary-black/80 to-primary-black z-10" />

        <div className="container-max relative z-20">
          <div className="text-center max-w-4xl mx-auto">

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-cairo font-bold mb-6 md:pb-8 text-gradient leading-tight">
              {isArabic ? 'أهلاً بك في مكتبي القانوني' : 'Welcome to my law office'}
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 font-cairo max-w-2xl mx-auto">
              {isArabic
                ? 'يُعد مكتب المحامية مريم بنت محمد جهة قانونية متخصصة تقدم حلولًا عملية لحماية حقوقك.'
                : 'A specialized law office providing practical legal solutions to protect your rights.'}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link to="/contact">
                <Button size="lg" variant="primary" className="font-cairo flex-row-reverse">
                  {isArabic ? 'احجز استشارة' : 'Book Consultation'}
                  <ArrowLeft className="me-2" size={20} />
                </Button>
              </Link>

              <Link to="/services">
                <Button size="lg" variant="secondary" className="font-cairo">
                  {isArabic ? 'الخدمات' : 'Services'}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gold/20">
              {statsData.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-gold mb-2">
                    {isArabic ? stat.numberAr : stat.numberEn}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {isArabic ? stat.labelAr : stat.labelEn}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>

        <ChevronDown className="absolute bottom-6 text-gold animate-bounce" size={28} />
      </section>

      {/* Services Section */}
      {/* <section className="section-padding bg-primary-black">
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
            {services.map((service) => (
              <motion.div key={service.id} variants={itemVariants}>
                <ServiceCard
                  titleAr={service.titleAr}
                  titleEn={service.titleEn || service.titleAr}
                  descriptionAr={service.descriptionAr}
                  descriptionEn={service.descriptionEn || service.descriptionAr}
                  icon={service.icon}
                  priceAr={service.priceAr}
                  priceEn={service.priceEn || service.priceAr}
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
      </section> */}
 <section className="section-padding bg-primary-black">
        <div className="container-max">

          <h2 className="text-heading-1 text-center text-gradient mb-12">
            {isArabic ? 'خدماتنا المتخصصة' : 'Our Services'}
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {servicesLoading ? (
              <p className="text-center text-gray-400 col-span-3">
                جاري تحميل الخدمات...
              </p>
            ) : (
              services.slice(0, 6).map((service) => (
                <motion.div key={service.id}>
                  <Link to={`/services/${service.id}`}>
                    <ServiceCard
                      titleAr={service.title}
                      titleEn={service.title}
                      descriptionAr={service.description}
                      descriptionEn={service.description}
                      priceAr={service.price ? `${service.price} ر.س` : ''}
                      priceEn={service.price ? `${service.price} SAR` : ''}
                      icon={''}
                      imageUrl={resolveImagePath(service.serviceImagePath || '')}
                      features={(service.childernTheServices || []).map(c => c.term)}
                    />
                  </Link>
                </motion.div>
              ))
            )}
          </div>

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
              {isArabic ? 'عن مكتب المحامية مريم بنت محمد' : 'About Maryam bint Mohammed Law Office'}
              </h2>
              <p className="text-gray-300 font-cairo mb-4">
                {isArabic
                  ? 'يقدم مكتب المحامية مريم بنت محمد خدمات قانونية متميزة تستند إلى خبرة عملية ومعرفة عميقة بالأنظمة والإجراءات القضائية.'
                  : 'Maryam bint Mohammed Law Office delivers distinguished legal services built on extensive practical experience and deep understanding of regulations and court procedures.'}
              </p>
              <p className="text-gray-300 font-cairo mb-6">
                {isArabic
                  ? 'يضم المكتب فريقًا قانونيًا متخصصًا يدعم العملاء في إدارة القضايا، وصياغة ومراجعة العقود، وتقديم الاستشارات القانونية المتقدمة.'
                  : 'The office is supported by a specialized legal team assisting clients in managing disputes, drafting and reviewing contracts, and providing advanced legal advice.'}
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
      {/* <section className="section-padding bg-primary-black">
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
      </section> */}
 <section className="section-padding bg-charcoal">
        <div className="container-max">

          <h2 className="text-heading-1 text-center text-gradient mb-12">
            {isArabic ? 'آخر الأخبار' : 'Latest News'}
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {newsLoading ? (
              <p className="text-center text-gray-400 col-span-3">
                جاري تحميل الأخبار...
              </p>
            ) : (
              newsList.slice(0, 3).map((news) => (
                <motion.div key={news.id}>
                  <Link to={`/news/${news.id}`}>
                    <NewsCard
                      titleAr={news.name}
                      titleEn={news.name}
                      descriptionAr={news.description}
                      descriptionEn={news.description}
                      date={String(news.actionDate)}
                      categoryAr={news.isActive ? 'نشط' : 'غير نشط'}
                      categoryEn={news.isActive ? 'Active' : 'Inactive'}
                      image={resolveImagePath(news.filePath)}
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
              {isArabic ? 'ابدأ خطواتك القانونية بثقة مع مكتبنا' : 'Start your legal steps with confidence'}
            </h2>
            <p className="text-primary-black/80 mb-8 max-w-2xl mx-auto font-cairo">
              {isArabic
                ? 'تواصل مع مكتب المحامية مريم بنت محمد لحجز استشارة قانونية مهنية تساعدك على اتخاذ قرارات واضحة ومبنية على أسس نظامية.'
                : 'Contact Maryam bint Mohammed Law Office to book a professional legal consultation that helps you make clear, well‑grounded decisions.'}
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
