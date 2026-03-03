import { Outlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import PageTransition from '@/components/ui/PageTransition'

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-charcoal" dir="rtl">
      <Header />
      <main className="flex-1 pt-16 md:pt-20">
        <AnimatePresence mode="wait">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}