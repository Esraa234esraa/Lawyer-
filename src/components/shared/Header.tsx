import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import Logo from '@/components/ui/Logo'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const { isArabic } = useLanguage()

  const navItems = [
    { labelAr: 'الخدمات', labelEn: 'Services', href: '/services' },
    { labelAr: 'من نحن', labelEn: 'About', href: '/about' },
    // { labelAr: 'القضايا', labelEn: 'Cases', href: '/cases' },
    { labelAr: 'الأخبار', labelEn: 'News', href: '/news' },
    { labelAr: 'التدريبات', labelEn: 'Internships', href: '/internships' },
    { labelAr: 'الوظائف', labelEn: 'Jobs', href: '/jobs' },
    // { labelAr: 'الأسئلة الشائعة', labelEn: 'FAQ', href: '/faq' },
    { labelAr: 'تواصل معنا', labelEn: 'Contact', href: '/contact' },
  ]

  return (
    <header className="fixed w-full top-0 z-50 bg-charcoal border-b border-gold/20" dir="rtl">
      <nav className="container-max py-3 md:py-4 px-4 md:px-0">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" onClick={() => setIsOpen(false)}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 font-cairo text-lg md:text-2xl font-bold text-gold"
            >
              <Logo variant="dark" className="w-16 h-16 md:w-[12rem] md:h-20 object-contain rounded-md" />
              {/* <span className="hidden sm:inline">
                {isArabic ? 'مكتب المحامية مريم بنت محمد' : 'Maryam bint Mohammed Law Office'}
              </span> */}
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <motion.span
                  whileHover={{ color: '#C6A75E' }}
                  className="text-white transition-colors font-cairo text-xs xl:text-sm"
                >
                  {isArabic ? item.labelAr : item.labelEn}
                </motion.span>
              </Link>
            ))}
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-2 md:gap-4 flex-row-reverse">
            <LanguageSwitcher />

            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2 md:gap-4 flex-row-reverse">
                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="px-2 md:px-4 py-2 bg-gold text-primary-black rounded-lg font-cairo font-semibold text-xs md:text-sm"
                    >
                      {isArabic ? 'لوحة التحكم' : 'Dashboard'}
                    </motion.button>
                  </Link>
                )}
                {user?.role === 'client' && (
                  <Link to="/client/dashboard">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="px-2 md:px-4 py-2 bg-gold text-primary-black rounded-lg font-cairo font-semibold text-xs md:text-sm"
                    >
                      {isArabic ? 'حسابي' : 'My Account'}
                    </motion.button>
                  </Link>
                )}
                <span className="text-xs md:text-sm text-gold font-cairo hidden md:inline">
                  {user?.nameAr || user?.nameEn}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={logout}
                  className="px-2 md:px-4 py-2 bg-gold/20 text-gold rounded-lg hover:bg-gold/30 font-cairo text-xs md:text-sm"
                >
                  {isArabic ? 'خروج' : 'Logout'}
                </motion.button>
              </div>
            ) : (
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-2 md:px-4 py-2 bg-gold text-primary-black rounded-lg font-semibold font-cairo text-xs md:text-sm"
                >
                  {isArabic ? 'دخول' : 'Login'}
                </motion.button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-gold"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden mt-4 pt-4 border-t border-gold/20 space-y-3 text-right"
          >
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <motion.div
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gold transition-colors font-cairo text-sm"
                >
                  {isArabic ? item.labelAr : item.labelEn}
                </motion.div>
              </Link>
            ))}

            {isAuthenticated && (
              <div className="pt-3 border-t border-gold/20 space-y-2">
                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard" onClick={() => setIsOpen(false)}>
                    <div className="text-white hover:text-gold font-cairo text-sm">
                      {isArabic ? 'لوحة التحكم' : 'Dashboard'}
                    </div>
                  </Link>
                )}
                {user?.role === 'client' && (
                  <Link to="/client/dashboard" onClick={() => setIsOpen(false)}>
                    <div className="text-white hover:text-gold font-cairo text-sm">
                      {isArabic ? 'حسابي' : 'My Account'}
                    </div>
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout()
                    setIsOpen(false)
                  }}
                  className="text-gold hover:text-gold-light font-cairo text-sm"
                >
                  {isArabic ? 'تسجيل الخروج' : 'Logout'}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </nav>
    </header>
  )
}