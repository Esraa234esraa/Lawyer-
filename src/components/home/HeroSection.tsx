import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'

export default function HeroSection() {
  return (
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
            مريم بنت محمد للمحاماة والاستشارات القانونية
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-4 font-cairo max-w-2xl mx-auto">
            حلول قانونية تحمي حقوقك وتمنحك الثقة لاتخاذ القرار الصحيح
          </p>

          <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-10 font-cairo max-w-3xl mx-auto">
            سواء كنت فردًا تواجه قضية شخصية، أو صاحب منشأة تسعى لحماية أعمالك، فإننا نقدم لك الدعم القانوني والخبرة التي تحتاجها للوصول إلى أفضل النتائج وفق الأنظمة المعمول بها في المملكة العربية السعودية.
          </p>

          <div className="flex justify-center mb-12">
            <Link to="/contact">
              <Button size="lg" variant="primary" className="font-cairo px-12 py-6 text-xl">
                احجز استشارتك الآن
              </Button>
            </Link>
          </div>

          <div className="pt-10 border-t border-gold/20">
            <h2 className="text-2xl sm:text-3xl font-cairo font-bold text-white mb-8">
              لماذا يثق بنا عملاؤنا؟
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-gold mb-2">+٢٠</p>
                <p className="text-xs sm:text-sm text-gray-400">سنة من الخبرة القانونية</p>
              </div>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-gold mb-2">+٥٠٠</p>
                <p className="text-xs sm:text-sm text-gray-400">قضية ناجحة</p>
              </div>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-gold mb-2">+١٠٠</p>
                <p className="text-xs sm:text-sm text-gray-400">عميل وثق بخدماتنا</p>
              </div>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-gold mb-2">١٥</p>
                <p className="text-xs sm:text-sm text-gray-400">محاميًا ومتخصصًا قانونيًا</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChevronDown className="absolute bottom-6 text-gold animate-bounce" size={28} />
    </section>
  )
}