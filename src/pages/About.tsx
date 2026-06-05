import { motion } from 'framer-motion'
// import TeamCard from '@/components/ui/TeamCard'
import { useLanguage } from '@/hooks/useLanguage'
import { useGetWhoAreWe } from '@/hooks/whoAreWe'
import { aboutData } from '@/data/mockData'
import Loading from '@/components/ui/Loading'
import Seo from '@/components/shared/Seo'
import { DEFAULT_SOCIAL_IMAGE, pageUrl } from '@/constants/site'

export default function About() {
  const { isArabic } = useLanguage()
  const { data, isLoading } = useGetWhoAreWe()
  const whoAreWe = data?.data

  const visionContent = isArabic
    ? whoAreWe?.visionAr || aboutData.vision
    : whoAreWe?.visionEn || whoAreWe?.visionAr || aboutData.visionEn

  const messageContent = isArabic
    ? whoAreWe?.messageAr || aboutData.mission
    : whoAreWe?.messageEn || whoAreWe?.messageAr || aboutData.missionEn

  return (
    <div dir="rtl" className="pt-24">
      <Seo
        title="من نحن"
        description="تعرف على مكتب مريم بنت محمد للمحاماة والاستشارات القانونية، ورؤيته ورسالة العمل والقيم التي يقوم عليها."
        url={pageUrl('/about')}
        image={DEFAULT_SOCIAL_IMAGE}
      />
      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-charcoal via-primary-black to-charcoal">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-heading-1 font-cairo font-bold mb-4 text-gradient">
              {isArabic ? 'من نحن' : 'About Us'}
            </h1>
            <div className="text-gray-300 font-cairo max-w-2xl mx-auto space-y-4">
              <p>
                {isArabic
                  ? 'شركاء في حماية الحقوق وصناعة الحلول القانونية'
                  : 'Committed to protecting rights and crafting legal solutions.'}
              </p>
              <p>
                {isArabic
                  ? 'في مكتب المحامية مريم بنت محمد للمحاماة والاستشارات القانونية، نؤمن بأن العمل القانوني لا يقتصر على تقديم الاستشارات أو الترافع فحسب، بل يبدأ بفهم احتياجات العميل وتقديم حلول قانونية واضحة تحمي مصالحه وتمنحه الثقة لاتخاذ قراراته.'
                  : 'At the office of Lawyer Maryam bint Mohammed, we believe legal work goes beyond advice and advocacy; it begins with understanding the client’s needs and delivering clear legal solutions that protect interests and build confidence.'}
              </p>
              <p>
                {isArabic
                  ? 'نقدم خدمات قانونية متخصصة للأفراد والشركات، مستندين إلى خبرة مهنية ومعرفة دقيقة بالأنظمة السعودية، مع التزام كامل بأعلى معايير الاحترافية والسرية والموثوقية.'
                  : 'We offer specialized legal services for individuals and businesses, backed by professional expertise and deep knowledge of Saudi regulations, fully committed to the highest standards of professionalism, confidentiality, and trustworthiness.'}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding bg-charcoal">
        <div className="container-max">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="p-8 bg-primary-black border-2 border-gold/30 rounded-lg text-right"
            >
              <h2 className="text-heading-2 font-cairo font-bold mb-4 text-gold">
                {isArabic ? 'رؤيتنا' : 'Our Vision'}
              </h2>
              <div className="text-gray-300 font-cairo text-lg min-h-[3rem] flex items-center justify-end">
                {isLoading ? <Loading inline message={isArabic ? 'جاري تحميل البيانات...' : 'Loading data...'} /> : visionContent}
              </div>
            </motion.div>

            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="p-8 bg-primary-black border-2 border-gold/30 rounded-lg text-right"
            >
              <h2 className="text-heading-2 font-cairo font-bold mb-4 text-gold">
                {isArabic ? 'رسالتنا' : 'Our Mission'}
              </h2>
              <div className="text-gray-300 font-cairo text-lg min-h-[3rem] flex items-center justify-end">
                {isLoading ? <Loading inline message={isArabic ? 'جاري تحميل البيانات...' : 'Loading data...'} /> : messageContent}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-primary-black">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-heading-1 font-cairo font-bold mb-4 text-gradient">
              قيمنا
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {aboutData.values.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="p-8 bg-charcoal border border-gold/20 rounded-lg text-center"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-heading-3 font-cairo font-bold text-gold">
                  {isArabic ? value.titleAr : value.titleEn}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      {/* <section className="section-padding bg-charcoal">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-heading-1 font-cairo font-bold mb-4 text-gradient">
              {isArabic ? 'فريقنا المتخصص' : 'Our Expert Team'}
            </h2>
            <p className="text-gray-300 font-cairo max-w-2xl mx-auto">
              {isArabic
                ? 'محامينا ذو خبرة عميقة وتخصصات متنوعة'
                : 'Our lawyers with deep expertise and diverse specializations'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {aboutData.team.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
              >
                <TeamCard
                  nameAr={member.nameAr}
                  nameEn={member.nameEn}
                  positionAr={member.positionAr}
                  positionEn={member.positionEn}
                  bio={member.bio}
                  bioEn={member.bioEn}
                  image={member.image}
                  specialties={member.specialties}
                  email={`${member.nameAr.replace(/\s+/g, '.').toLowerCase()}@lawfirm.sa`}
                  phone="+966112345678"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}
    </div>
  )
}