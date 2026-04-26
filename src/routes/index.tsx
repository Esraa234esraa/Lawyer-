import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from '@/layouts/PublicLayout'
import AdminLayout from '@/layouts/AdminLayout'
import ClientLayout from '@/layouts/ClientLayout'
import ProtectedRoute from '@/routes/ProtectedRoute'
// import { useAuth } from '@/hooks/useAuth'

// Public Pages
const Home = lazy(() => import('@/pages/Home'))
const Services = lazy(() => import('@/pages/Services'))
const About = lazy(() => import('@/pages/About'))
const Cases = lazy(() => import('@/pages/Cases'))
const News = lazy(() => import('@/pages/News'))
const Contact = lazy(() => import('@/pages/Contact'))
const Internships = lazy(() => import('@/pages/Internships'))
const Jobs = lazy(() => import('@/pages/Jobs'))
const FAQ = lazy(() => import('@/pages/FAQ'))
const Login = lazy(() => import('@/pages/Login'))
const Register = lazy(() => import('@/pages/Register'))
const PasswordResetPage = lazy(() => import('@/pages/PasswordReset'))

// Admin Pages
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'))
const AdminServices = lazy(() => import('@/pages/admin/Services'))
const AdminCases = lazy(() => import('@/pages/admin/Cases'))
const AdminCaseDetails = lazy(() => import('@/pages/admin/CaseDetails'))
const AdminNews = lazy(() => import('@/pages/admin/News'))
const AdminClients = lazy(() => import('@/pages/admin/Clients'))
const AdminInternships = lazy(() => import('@/pages/admin/Internships'))
const AdminApplicationDetails = lazy(() => import('@/pages/admin/ApplicationDetails'))
const AdminAbout = lazy(() => import('@/pages/admin/About'))
const AdminClientsFiles = lazy(() => import('@/pages/admin/ClientsFiles'))
const AdminChat = lazy(() => import('@/pages/admin/AdminChat'))
const AdminOpportunities = lazy(() => import('@/pages/admin/Opportunities'))
const AdminMessages = lazy(() => import('@/pages/admin/Messages'))

// Client Pages
const ClientDashboard = lazy(() => import('@/pages/client/Dashboard'))
const ClientCases = lazy(() => import('@/pages/client/Cases'))
const ClientProfile = lazy(() => import('@/pages/client/Profile'))
const CaseDetails = lazy(() => import('@/pages/client/CaseDetails'))
const ConsultationBookingForm = lazy(() => import('@/components/client/ConsultationBookingForm'))
const PaymentPage = lazy(() => import('@/components/client/PaymentPage'))
const AdminConsultations = lazy(() => import('@/pages/admin/AdminConsultations'))
const CasesAnalysisPage = lazy(() => import('@/pages/admin/CasesAnalysisPage'))
const AccountSummaryPage = lazy(() => import('@/pages/admin/AccountSummaryPage'))
const CaseTypes = lazy(() => import('@/pages/admin/CaseTypes'))

export default function AppRoutes() {
  // const { isAuthenticated, user } = useAuth()

  return (
    <Suspense fallback={<div className="text-gray-300 font-cairo p-6" dir="rtl">جاري التحميل...</div>}>
      <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/cases" element={<Cases />} />
        <Route path="/cases/:id" element={<Cases />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<News />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/book-consultation" element={<ConsultationBookingForm />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/internships" element={<Internships />} />
        <Route path="/internships/:id" element={<Internships />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<Jobs />} />
        <Route path="/faq" element={<FAQ />} />
      </Route>

      {/* Auth Route */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/password-reset" element={<PasswordResetPage />} />

      {/* Admin Routes */}
      <Route
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/services" element={<AdminServices />} />
        <Route path="/admin/cases" element={<AdminCases />} />
        <Route path="/admin/cases/:id" element={<AdminCaseDetails />} />
        <Route path="/admin/case-types" element={<CaseTypes />} />
        <Route path="/admin/news" element={<AdminNews />} />
        <Route path="/admin/clients" element={<AdminClients />} />
        <Route path="/admin/internships" element={<AdminInternships />} />
        <Route path="/admin/internships/:id" element={<AdminApplicationDetails />} />
        <Route path="/admin/about" element={<AdminAbout />} />
        <Route path="/admin/clients-files" element={<AdminClientsFiles />} />
        <Route path="/admin/chat" element={<AdminChat />} />
        <Route path="/admin/messages" element={<AdminMessages />} />
        <Route path="/admin/consultation" element={<AdminConsultations />} />
        <Route path="/admin/opportunities" element={<AdminOpportunities />} />
        <Route path="/admin/cases-analysis" element={<CasesAnalysisPage />} />
        <Route path="/admin/account-summary" element={<AccountSummaryPage />} />
      </Route>

      {/* Client Routes */}
      <Route
        element={
          <ProtectedRoute requiredRole="client">
            <ClientLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/client/dashboard" element={<ClientDashboard />} />
        <Route path="/client/cases" element={<ClientCases />} />
        <Route path="/client/profile" element={<ClientProfile />} />
        <Route path="/case/:id" element={<CaseDetails />} />
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}