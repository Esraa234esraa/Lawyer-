import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Briefcase,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { useAuth } from '@/hooks/useAuth'
import { useSwipe } from '@/hooks/useSwipe'
import { useSidebarStore } from '@/store/useSidebarStore' // Zustand store
import Logo from '@/components/ui/Logo'

export default function ClientSidebar() {
  const location = useLocation()
  const { isArabic } = useLanguage()
  const { logout } = useAuth()
  const { collapsed, toggle } = useSidebarStore()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [_isMobile, setIsMobile] = useState(window.innerWidth < 1024)

  const { handleTouchStart, handleTouchEnd } = useSwipe({
    onSwipeLeft: () => setIsMobileOpen(false),
    onSwipeRight: () => setIsMobileOpen(true),
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) setIsMobileOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const menuItems = [
    { labelAr: 'لوحة التحكم', labelEn: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
    { labelAr: 'القضايا', labelEn: 'Cases', href: '/client/cases', icon: Briefcase },
    { labelAr: 'الملف الشخصي', labelEn: 'Profile', href: '/client/profile', icon: User },
  ]

  return (
    <>
      {/* Mobile Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed bottom-8 right-8 z-99999 w-14 h-14 bg-gradient-to-br from-gold to-gold-light text-primary-black rounded-full flex items-center justify-center shadow-lg"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 256 }}
        transition={{ duration: 0.3 }}
        className="hidden lg:block fixed right-0 top-20 h-screen bg-primary-black border-l border-gold/20 overflow-y-auto backdrop-blur-lg bg-opacity-95 z-30"
        dir="rtl"
      >
        <nav className="p-4 space-y-2 h-full flex flex-col">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggle}
            className="p-3 rounded-lg hover:bg-gold/10 transition-colors self-start mb-4"
          >
            {collapsed ? <ChevronLeft size={20} className="text-gold" /> : <ChevronRight size={20} className="text-gold" />}
          </motion.button>

          <div className="space-y-2 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link key={item.href} to={item.href}>
                  <motion.div
                    whileHover={{ x: collapsed ? 0 : -4 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-cairo flex-row-reverse ${
                      isActive
                        ? 'bg-gradient-to-r from-gold/30 to-gold/10 text-gold border-r-2 border-gold shadow-lg'
                        : 'text-gray-400 hover:text-gold hover:bg-gold/10'
                    }`}
                    title={collapsed ? (isArabic ? item.labelAr : item.labelEn) : ''}
                  >
                    <Icon size={20} />
                    {!collapsed && <span className="font-medium text-sm truncate">{isArabic ? item.labelAr : item.labelEn}</span>}
                  </motion.div>
                </Link>
              )
            })}
          </div>

          <div className="my-4 border-t border-gold/20" />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all font-cairo flex-row-reverse"
            title={collapsed ? (isArabic ? 'تسجيل الخروج' : 'Logout') : ''}
          >
            <LogOut size={20} />
            {!collapsed && <span className="font-medium text-sm">{isArabic ? 'تسجيل الخروج' : 'Logout'}</span>}
          </motion.button>
        </nav>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
            />

            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 20 }}
              onTouchStart={(e) => handleTouchStart(e as any)}
              onTouchEnd={(e) => handleTouchEnd(e as any)}
              className="lg:hidden fixed right-0 top-0 bottom-0 w-64 bg-gradient-to-b from-primary-black via-primary-black to-charcoal border-l-2 border-gold/30 overflow-y-auto backdrop-blur-xl bg-opacity-98 z-50"
              dir="rtl"
            >
              <nav className="p-6 space-y-2 h-full flex flex-col">
                <div className="pb-4 mb-4 border-b border-gold/20">
                  <div className="flex items-center gap-3 flex-row-reverse">
                    <Logo variant="dark" className="w-10 h-10 rounded-full object-contain border border-gold/50 bg-primary-black" />
                    <div className="text-right">
                      <p className="text-gold text-sm font-cairo font-semibold">
                        مكتب مريم بنت محمد
                      </p>
                      <p className="text-[11px] text-gray-500 font-cairo">
                        للمحاماة والاستشارات القانونية
                      </p>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-gold/10 transition-colors self-start mb-4"
                >
                  <X size={24} className="text-gold" />
                </motion.button>

                <div className="space-y-2 flex-1">
                  {menuItems.map((item, idx) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.href
                    return (
                      <motion.div key={item.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
                        <Link to={item.href} onClick={() => setIsMobileOpen(false)}>
                          <motion.div
                            whileHover={{ scale: 1.02, x: -4 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-cairo flex-row-reverse ${
                              isActive
                                ? 'bg-gradient-to-r from-gold/30 to-gold/10 text-gold border-r-2 border-gold shadow-lg'
                                : 'text-gray-400 hover:text-gold hover:bg-gold/10'
                            }`}
                          >
                            <Icon size={20} />
                            <span className="font-medium">{isArabic ? item.labelAr : item.labelEn}</span>
                          </motion.div>
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    logout()
                    setIsMobileOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all font-cairo flex-row-reverse"
                >
                  <LogOut size={20} />
                  <span className="font-medium">{isArabic ? 'تسجيل الخروج' : 'Logout'}</span>
                </motion.button>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}