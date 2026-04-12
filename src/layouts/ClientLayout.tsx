import { Outlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Header from '@/components/shared/Header'
import ClientSidebar from '@/components/shared/ClientSidebar'
import PageTransition from '@/components/ui/PageTransition'
import { useSidebarStore } from '@/store/useSidebarStore'

export default function ClientLayout() {
  const { collapsed } = useSidebarStore()
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024)

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="flex min-h-screen bg-charcoal overflow-x-hidden text-right" dir="rtl">
      <Header />
      <ClientSidebar />

      <motion.main
        animate={{
          paddingRight: isDesktop ? (collapsed ? 80 : 256) : 0,
        }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        className="flex-1 pt-28 overflow-x-hidden text-right"
      >
        <AnimatePresence mode="wait">
          <PageTransition>
            <div className="container-max py-8 px-4 md:px-0">
              <Outlet />
            </div>
          </PageTransition>
        </AnimatePresence>
      </motion.main>
    </div>
  )
}