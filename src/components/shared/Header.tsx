import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Home, Menu, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import Logo from '@/components/ui/Logo'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuth()
  const { isArabic } = useLanguage()
  const isAdminArea = location.pathname.startsWith('/admin')

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
    <header className="fixed top-0 left-0 right-0 z-40 px-2 md:px-5 pt-2" dir="rtl">
      <nav className="bg-charcoal/95 backdrop-blur-xl border border-gold/15 shadow-[0_12px_40px_rgba(0,0,0,0.28)] rounded-2xl max-w-[1600px] mx-auto">
        <div className="container-max py-2.5 md:py-3 px-3 md:px-5">
        <div className="flex items-center justify-start lg:justify-between gap-3">
          {/* Logo */}
          <Link to="/" onClick={() => setIsOpen(false)} className="hidden lg:block">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 md:gap-3 font-cairo text-lg md:text-2xl font-bold text-gold"
            >
              {isAdminArea ? (
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-gold/10 border border-gold/20 text-gold">
                  <Home size={20} className="md:hidden" />
                  <Home size={22} className="hidden md:block" />
                </div>
              ) : (
                <Logo variant="dark" className="w-16 h-16 md:w-24 md:h-24 object-contain rounded-xl" />
              )}
              {!isAdminArea && (
                <span className="hidden sm:inline text-white/90 text-sm md:text-base lg:text-lg font-semibold">
                  {isArabic ? 'مكتب المحامية مريم بنت محمد' : 'Maryam bint Mohammed Law Office'}
                </span>
              )}
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          {!isAdminArea && (
            <div className="hidden lg:flex items-center gap-3 xl:gap-4 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
              {navItems.map((item) => (
                <Link key={item.href} to={item.href}>
                  <motion.span
                    whileHover={{ color: '#C6A75E', y: -1 }}
                    className="text-white/90 transition-colors font-cairo text-sm xl:text-base font-medium"
                  >
                    {isArabic ? item.labelAr : item.labelEn}
                  </motion.span>
                </Link>
              ))}
            </div>
          )}

          {/* Auth Actions */}
          <div className="flex items-center gap-2 md:gap-3 flex-row-reverse lg:mr-0 mr-auto">
            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 md:gap-2.5 flex-row-reverse">
                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="px-3 md:px-4 py-1.5 bg-gradient-to-r from-gold to-gold-light text-primary-black rounded-full font-cairo font-semibold text-xs md:text-sm shadow-lg shadow-gold/20"
                    >
                      {isArabic ? 'لوحة التحكم' : 'Dashboard'}
                    </motion.button>
                  </Link>
                )}
                {user?.role === 'client' && (
                  !isAdminArea && (
                  <Link to="/client/dashboard">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="px-3 md:px-4 py-1.5 bg-gradient-to-r from-gold to-gold-light text-primary-black rounded-full font-cairo font-semibold text-xs md:text-sm shadow-lg shadow-gold/20"
                    >
                      {isArabic ? 'حسابي' : 'My Account'}
                    </motion.button>
                  </Link>
                  )
                )}
                <span className="hidden md:inline-flex items-center px-3 py-2 rounded-full bg-white/5 text-xs md:text-sm text-gold font-cairo border border-gold/10">
                  {user?.nameAr || user?.nameEn}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={logout}
                  className="px-3 md:px-4 py-1.5 bg-white/5 text-gold rounded-full hover:bg-gold/15 border border-gold/15 font-cairo text-xs md:text-sm"
                >
                  {isArabic ? 'خروج' : 'Logout'}
                </motion.button>
              </div>
            ) : (
              !isAdminArea && (
                <div className="flex items-center gap-2 md:gap-2.5 flex-row-reverse">
                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="px-3 md:px-4 py-1.5 bg-white/5 text-gold rounded-full hover:bg-gold/15 border border-gold/15 font-cairo text-xs md:text-sm"
                    >
                      {isArabic ? 'إنشاء حساب' : 'Register'}
                    </motion.button>
                  </Link>
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="px-3 md:px-4 py-1.5 bg-gradient-to-r from-gold to-gold-light text-primary-black rounded-full font-semibold font-cairo text-xs md:text-sm shadow-lg shadow-gold/20"
                    >
                      {isArabic ? 'دخول' : 'Login'}
                    </motion.button>
                  </Link>
                </div>
              )
            )}

            {/* Mobile Menu Button */}
            {!isAdminArea && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden text-gold"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {!isAdminArea && isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden mt-4 pt-4 border-t border-gold/20 space-y-3 text-right"
          >
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <motion.div
                  onClick={() => setIsOpen(false)}
                  className="text-white/90 hover:text-gold transition-colors font-cairo text-sm py-2"
                >
                  {isArabic ? item.labelAr : item.labelEn}
                </motion.div>
              </Link>
            ))}

            {isAuthenticated && (
              <div className="pt-3 border-t border-gold/20 space-y-2">
                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard" onClick={() => setIsOpen(false)}>
                    <div className="text-white hover:text-gold font-cairo text-sm py-2">
                      {isArabic ? 'لوحة التحكم' : 'Dashboard'}
                    </div>
                  </Link>
                )}
                {user?.role === 'client' && (
                  <Link to="/client/dashboard" onClick={() => setIsOpen(false)}>
                    <div className="text-white hover:text-gold font-cairo text-sm py-2">
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

            {!isAuthenticated && (
              <div className="pt-3 border-t border-gold/20 space-y-2">
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <div className="text-white hover:text-gold font-cairo text-sm py-2">
                    {isArabic ? 'تسجيل الدخول' : 'Login'}
                  </div>
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <div className="text-white hover:text-gold font-cairo text-sm py-2">
                    {isArabic ? 'إنشاء حساب' : 'Register'}
                  </div>
                </Link>
              </div>
            )}
          </motion.div>
        )}
        </div>
      </nav>
    </header>
  )
}