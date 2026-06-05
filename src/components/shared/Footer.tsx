import { motion } from 'framer-motion'
import { Mail, Phone, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/hooks/useLanguage'
import Logo from '@/components/ui/Logo'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { isArabic } = useLanguage()

  const footerLinks = [
    { labelAr: 'الرئيسية', labelEn: 'Home', href: '/' },
    { labelAr: 'الخدمات', labelEn: 'Services', href: '/services' },
    { labelAr: 'من نحن', labelEn: 'About', href: '/about' },
    // { labelAr: 'القضايا', labelEn: 'Cases', href: '/cases' },
    { labelAr: 'الأخبار', labelEn: 'News', href: '/news' },
    { labelAr: 'التدريبات', labelEn: 'Internships', href: '/internships' },
    { labelAr: 'الوظائف', labelEn: 'Jobs', href: '/jobs' },
    // { labelAr: 'الأسئلة الشائعة', labelEn: 'FAQ', href: '/faq' },
  ]

  return (
    <footer className="bg-primary-black border-t border-gold/20" dir="rtl">
      <div className="container-max py-section">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-right"
          >
            <div className="flex flex-col items-center justify-end gap-4 mb-4">
              <Logo variant="dark" className=" h-36 object-contain rounded-md" />
              <h3 className="font-cairo text-xl font-bold text-gold">
                مكتب مريم بنت محمد
              </h3>
            </div>
            <p className="text-gray-400 text-sm font-cairo">
              للمحاماة والاستشارات القانونية بخبرة واحترافية عالية
            </p>
          </motion.div>

          {/* Quick Links Part 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-right"
          >
            <h4 className="text-white font-semibold mb-4 font-cairo">الروابط السريعة</h4>
            <ul className="space-y-2 text-sm text-gray-400 font-cairo">
              {footerLinks.slice(0, 4).map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="hover:text-gold transition-colors"
                  >
                    {isArabic ? link.labelAr : link.labelEn}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Quick Links Part 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-right"
          >
            <h4 className="text-white font-semibold mb-4 font-cairo">المزيد</h4>
            <ul className="space-y-2 text-sm text-gray-400 font-cairo">
              {footerLinks.slice(4, 8).map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="hover:text-gold transition-colors"
                  >
                    {isArabic ? link.labelAr : link.labelEn}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-right"
          >
            <h4 className="text-white font-semibold mb-4 font-cairo">تواصل معنا</h4>
            <ul className="space-y-3 text-sm text-gray-400 font-cairo">
              <li className="flex items-center gap-2 flex-row-reverse">
                <Phone size={16} className="text-gold" />
                <a
                  href="tel:+966112345678"
                  className="hover:text-gold transition-colors"
                >
                  +966 11 234 5678
                </a>
              </li>
              <li className="flex items-center gap-2 flex-row-reverse">
                <Mail size={16} className="text-gold" />
                <a
                  href="mailto:info@lawfirm.sa"
                  className="hover:text-gold transition-colors"
                >
                  info@lawfirm.sa
                </a>
              </li>
              <li className="flex items-center gap-2 flex-row-reverse">
                <MapPin size={16} className="text-gold" />
                الرياض، السعودية
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-gold/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-right">
            <p className="text-gray-500 text-sm font-cairo">
              © {currentYear} مكتب مريم بنت محمد للمحاماة والاستشارات القانونية. جميع الحقوق محفوظة.
            </p>
            {/* <div className="flex gap-6 mt-4 md:mt-0">
              <Link
                to="#"
                className="text-gray-500 hover:text-gold text-sm transition-colors font-cairo"
              >
                سياسة الخصوصية
              </Link>
              <Link
                to="#"
                className="text-gray-500 hover:text-gold text-sm transition-colors font-cairo"
              >
                شروط الخدمة
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  )
}