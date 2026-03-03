import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import ProfileCard from '@/components/client/ProfiloCard'
import FileUploadSection from '@/components/client/FileUploadSection'
import FilesTable from '@/components/client/FileTable'
// import ChatInterface from '@/components/client/ChatInterface'
// import OnlineIndicator from '@/components/client/OnlineIndicator'

export default function ClientDashboard() {
  const { user } = useAuth()
  const { isArabic } = useLanguage()

  return (
    <div dir="rtl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-heading-1 font-cairo font-bold text-gradient mb-2">
          {isArabic ? 'أهلاً وسهلاً' : 'Welcome Back'}
        </h1>
        <p className="text-gray-400 font-cairo">
          {user?.nameAr || user?.nameEn}
        </p>
      </motion.div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column - Profile & Upload */}
        <div className="lg:col-span-2 space-y-6">
          <ProfileCard />
        </div>
        <div className="lg:col-span-1 space-y-6">

          <FileUploadSection />
          </div>

        {/* Right Column - Chat */}
        {/* <div className="lg:col-span-2">
          <OnlineIndicator />
          <ChatInterface />
        </div> */}
      </div>

      {/* Files Table */}
      <FilesTable />
    </div>
  )
}