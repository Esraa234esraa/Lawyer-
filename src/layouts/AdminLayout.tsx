import { Outlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Header from '@/components/shared/Header'
import AdminSidebar from '@/components/shared/AdminSidebar'
import PageTransition from '@/components/ui/PageTransition'
import { useSidebarStore } from '@/store/useSidebarStore'

export default function AdminLayout() {
  const { collapsed } = useSidebarStore()

  return (
    <div className="flex min-h-screen bg-charcoal" dir="rtl">
      <Header />
      <AdminSidebar />

      <motion.main
        animate={{
          paddingRight: collapsed ? 80 : 256,
        }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        className="flex-1 pt-20 lg:pt-20"
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