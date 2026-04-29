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
    { labelAr: 'الصفحة الرئيسية', labelEn: 'Home', href: '/' },
    { labelAr: 'الخدمات', labelEn: 'Services', href: '/services' },
    { labelAr: 'من نحن', labelEn: 'About', href: '/about' },
    { labelAr: 'الأخبار', labelEn: 'News', href: '/news' },
    { labelAr: 'التدريبات', labelEn: 'Internships', href: '/internships' },
    { labelAr: 'الوظائف', labelEn: 'Jobs', href: '/jobs' },
    { labelAr: 'تواصل معنا', labelEn: 'Contact', href: '/contact' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-2 md:px-5 pt-2" dir="rtl">
      <nav className="bg-charcoal/95 backdrop-blur-xl border border-gold/15 shadow-[0_12px_40px_rgba(0,0,0,0.28)] rounded-2xl max-w-[1600px] mx-auto">
        <div className="container-max py-2.5 md:py-3 px-3 md:px-5">

          <div className="flex items-center justify-start lg:justify-between gap-3">

            {/* Logo */}
            <Link to="/" onClick={() => setIsOpen(false)} className={isAdminArea ? 'block' : 'hidden lg:block'}>
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
                  <Logo className="w-16 h-16 md:w-24 md:h-24 object-contain rounded-xl" />
                )}
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            {!isAdminArea && (
              <div className="hidden lg:flex items-center gap-3 xl:gap-4 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.href

                  return (
                    <Link key={item.href} to={item.href} className="group">
                      <motion.span
                        whileHover={{ color: '#C6A75E', y: -1 }}
                        className={`
                          relative font-cairo text-sm xl:text-base font-medium transition-all
                          ${isActive ? 'text-gold' : 'text-white/90'}
                        `}
                      >
                        {isArabic ? item.labelAr : item.labelEn}

                        {/* underline */}
                        <span
                          className={`
                            absolute left-0 -bottom-1 h-[2px] bg-gold transition-all duration-300
                            ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}
                          `}
                        />
                      </motion.span>
                    </Link>
                  )
                })}
              </div>
            )}

            {/* Auth */}
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
                        className="px-3 md:px-4 py-1.5 bg-gradient-to-r from-gold to-gold-light text-primary-black rounded-full font-cairo text-xs md:text-sm"
                      >
                        {isArabic ? 'لوحة التحكم' : 'Dashboard'}
                      </motion.button>
                    </Link>
                  )}

                  <span className="hidden md:inline-flex px-3 py-2 rounded-full bg-white/5 text-xs text-gold">
                    {user?.nameAr || user?.nameEn}
                  </span>

                  <button
                    onClick={logout}
                    className="px-3 py-1.5 bg-white/5 text-gold rounded-full text-xs"
                  >
                    {isArabic ? 'خروج' : 'Logout'}
                  </button>

                </div>
              ) : (
                !isAdminArea && (
                  <div className="flex items-center gap-2 flex-row-reverse">

                    <Link to="/login">
                      <button className="px-3 py-1.5 bg-gold text-black rounded-full text-xs">
                        {isArabic ? 'دخول' : 'Login'}
                      </button>
                    </Link>

                  </div>
                )
              )}

              {/* Mobile menu button */}
              {!isAdminArea && (
                <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-gold">
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
              {navItems.map((item) => {
                const isActive = location.pathname === item.href

                return (
                  <Link key={item.href} to={item.href}>
                    <div
                      onClick={() => setIsOpen(false)}
                      className={`
                        font-cairo text-sm py-2 transition-colors
                        ${isActive ? 'text-gold underline' : 'text-white/90'}
                      `}
                    >
                      {isArabic ? item.labelAr : item.labelEn}
                    </div>
                  </Link>
                )
              })}
            </motion.div>
          )}

        </div>
      </nav>
    </header>
  )
}