import { Toaster } from 'sonner'
import AppRoutes from '@/routes'
import { useScrollToTop } from '@/hooks/useScrollTop'

function AppContent() {
  useScrollToTop()
  return (
    <>
      <AppRoutes />
      <Toaster position="top-center" richColors />
    </>
  )
}

export default function App() {
  return (
      <AppContent />
  )
}