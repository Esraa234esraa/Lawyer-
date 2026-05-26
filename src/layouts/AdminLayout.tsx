import { Outlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Header from '@/components/shared/Header'
import AdminSidebar from '@/components/shared/AdminSidebar'
import PageTransition from '@/components/ui/PageTransition'
import { useSidebarStore } from '@/store/useSidebarStore'
import { useQueryClient } from '@tanstack/react-query'
import { getAllSessions } from '@/services/sessions.service'
import { SESSION_QUERY_KEYS } from '@/constants/sessions'

export default function AdminLayout() {
  const { collapsed } = useSidebarStore()
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)
  const queryClient = useQueryClient()

  useEffect(() => {
    // Prefetch sessions to warm cache for faster admin list load
    void queryClient.prefetchQuery({
      queryKey: SESSION_QUERY_KEYS.list(),
      queryFn: () => getAllSessions(),
      staleTime: 10 * 60 * 1000,
    })

    const handleResize = () => setIsDesktop(window.innerWidth >= 1024)

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="flex min-h-screen bg-charcoal overflow-x-hidden text-right" dir="rtl">
      <Header />
      <AdminSidebar />

      <motion.main
        animate={{
          paddingRight: isDesktop ? (collapsed ? 80 : 256) : 0,
        }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        className="flex-1 pt-28 lg:pt-28 overflow-x-hidden text-right"
      >
        <AnimatePresence mode="wait">
          <PageTransition>
            <div className="container-xl py-8 px-4 md:px-8">
              <Outlet />
            </div>
          </PageTransition>
        </AnimatePresence>
      </motion.main>
    </div>
  )
}