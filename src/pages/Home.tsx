import HeroSection from '@/components/home/HeroSection'
import ServicesSection from '@/components/home/ServicesSection'
import AboutSection from '@/components/home/AboutSection'
import OpportunitiesSection from '@/components/home/OpportunitiesSection'
import NewsSection from '@/components/home/NewsSection'
import CtaSection from '@/components/home/CtaSection'
import { useGetServices } from '@/hooks/services'
import { useGetVisibleNews } from '@/hooks/news'
import Seo from '@/components/shared/Seo'
import { DEFAULT_SOCIAL_IMAGE, pageUrl } from '@/constants/site'
export default function Home() {
  const { data: servicesData, isLoading: servicesLoading } = useGetServices()
  const services = servicesData?.data || []

  const { data: newsResponse, isLoading: newsLoading } = useGetVisibleNews()
  const newsList = newsResponse?.data || []

  const resolveImagePath = (filePath?: string | null) => {
    if (!filePath) return ''
    const trimmedPath = filePath.trim()
    if (trimmedPath.startsWith('http')) return trimmedPath
    const normalized = trimmedPath.replace(/^\/?wwwroot\/?/i, '').replace(/^\/+/, '')
    return `https://lawm.runasp.net/${normalized}`
  }

  return (
    <div dir="rtl">
      <Seo
        title="الرئيسية"
        description="مكتب مريم بنت محمد للمحاماة والاستشارات القانونية يقدم خدمات قانونية موثوقة وحلولاً مهنية متكاملة للأفراد والشركات."
        url={pageUrl('/')}
        image={DEFAULT_SOCIAL_IMAGE}
      />
      <HeroSection />
      <ServicesSection services={services} isLoading={servicesLoading} resolveImagePath={resolveImagePath} />
      <AboutSection />
      <OpportunitiesSection />
      <NewsSection news={newsList} isLoading={newsLoading} resolveImagePath={resolveImagePath} />
      <CtaSection />
    </div>
  )
}
