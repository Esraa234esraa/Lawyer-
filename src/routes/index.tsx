import { lazy, Suspense } from 'react'
import Loading from '@/components/ui/Loading'
import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from '@/layouts/PublicLayout'
import AdminLayout from '@/layouts/AdminLayout'
import ClientLayout from '@/layouts/ClientLayout'
import ProtectedRoute from '@/routes/ProtectedRoute'

// helper عشان نمنع مشكلة object بدل component
const lazyImport = (factory: () => Promise<any>) =>
  lazy(() =>
    factory().then((module) => ({
      default: module.default,
    }))
  )

// Public Pages
const Home = lazyImport(() => import('@/pages/Home'))
const Services = lazyImport(() => import('@/pages/Services'))
const About = lazyImport(() => import('@/pages/About'))
const Cases = lazyImport(() => import('@/pages/Cases'))
const News = lazyImport(() => import('@/pages/News'))
const Contact = lazyImport(() => import('@/pages/Contact'))
const Internships = lazyImport(() => import('@/pages/Internships'))
const Jobs = lazyImport(() => import('@/pages/Jobs'))
const FAQ = lazyImport(() => import('@/pages/FAQ'))
const Login = lazyImport(() => import('@/pages/Login'))
const Register = lazyImport(() => import('@/pages/Register'))
const PasswordResetPage = lazyImport(() => import('@/pages/PasswordReset'))

// Admin Pages
const AdminDashboard = lazyImport(() => import('@/pages/admin/Dashboard'))
const AdminServices = lazyImport(() => import('@/pages/admin/Services'))
const AdminCases = lazyImport(() => import('@/pages/admin/Cases'))
const AdminCaseDetails = lazyImport(() => import('@/pages/admin/CaseDetails'))
const AdminNews = lazyImport(() => import('@/pages/admin/News'))
const AdminClients = lazyImport(() => import('@/pages/admin/Clients'))
const AdminInternships = lazyImport(() => import('@/pages/admin/Internships'))
const AdminApplicationDetails = lazyImport(() => import('@/pages/admin/ApplicationDetails'))
const AdminAbout = lazyImport(() => import('@/pages/admin/About'))
const AdminClientsFiles = lazyImport(() => import('@/pages/admin/ClientsFiles'))
const AdminChat = lazyImport(() => import('@/pages/admin/AdminChat'))
const AdminOpportunities = lazyImport(() => import('@/pages/admin/Opportunities'))
const AdminMessages = lazyImport(() => import('@/pages/admin/Messages'))
const AdminConsultations = lazyImport(() => import('@/pages/admin/AdminConsultations'))
const CasesAnalysisPage = lazyImport(() => import('@/pages/admin/CasesAnalysisPage'))
const AccountSummaryPage = lazyImport(() => import('@/pages/admin/AccountSummaryPage'))
const CaseTypes = lazyImport(() => import('@/pages/admin/CaseTypes'))
const SessionsListPage = lazyImport(() => import('@/pages/admin/sessions/SessionsListPage'))
const AddSessionPage = lazyImport(() => import('@/pages/admin/sessions/AddSessionPage'))
const EditSessionPage = lazyImport(() => import('@/pages/admin/sessions/EditSessionPage'))
const SessionDetailsPage = lazyImport(() => import('@/pages/admin/sessions/SessionDetailsPage'))

// Client Pages
const ClientDashboard = lazyImport(() => import('@/pages/client/Dashboard'))
const ClientCases = lazyImport(() => import('@/pages/client/Cases'))
const ClientProfile = lazyImport(() => import('@/pages/client/Profile'))
const CaseDetails = lazyImport(() => import('@/pages/client/CaseDetails'))
const ConsultationBookingForm = lazyImport(() => import('@/components/client/ConsultationBookingForm'))
const PaymentPage = lazyImport(() => import('@/components/client/PaymentPage'))

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>

        {/* Public */}
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

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password-reset" element={<PasswordResetPage />} />

        {/* Admin */}
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
          <Route path="/admin/sessions" element={<SessionsListPage />} />
          <Route path="/admin/sessions/new" element={<AddSessionPage />} />
          <Route path="/admin/sessions/:id" element={<SessionDetailsPage />} />
          <Route path="/admin/sessions/:id/edit" element={<EditSessionPage />} />
        </Route>

        {/* Client */}
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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}