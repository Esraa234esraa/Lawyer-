import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from '@/layouts/PublicLayout'
import AdminLayout from '@/layouts/AdminLayout'
import ClientLayout from '@/layouts/ClientLayout'
import ProtectedRoute from '@/routes/ProtectedRoute'
// import { useAuth } from '@/hooks/useAuth'

// Public Pages
import Home from '@/pages/Home'
import Services from '@/pages/Services'
import About from '@/pages/About'
import Cases from '@/pages/Cases'
import News from '@/pages/News'
import Contact from '@/pages/Contact'
import Internships from '@/pages/Internships'
import Jobs from '@/pages/Jobs'
import FAQ from '@/pages/FAQ'
import Login from '@/pages/Login'
import Register from '@/pages/Register'

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard'
import AdminServices from '@/pages/admin/Services'
import AdminCases from '@/pages/admin/Cases'
import AdminNews from '@/pages/admin/News'
import AdminClients from '@/pages/admin/Clients'
import AdminInternships from '@/pages/admin/Internships'
import AdminAbout from '@/pages/admin/About'
import AdminClientsFiles from '@/pages/admin/ClientsFiles'
import AdminChat from '@/pages/admin/AdminChat'
import AdminOpportunities from '@/pages/admin/Opportunities'

// Client Pages
import ClientDashboard from '@/pages/client/Dashboard'
import ClientCases from '@/pages/client/Cases'
import ClientProfile from '@/pages/client/Profile'
import CaseDetails from "@/pages/client/CaseDetails"
import ConsultationBookingForm from '@/components/client/ConsultationBookingForm'
import PaymentPage from '@/components/client/PaymentPage'
import AdminConsultations from '@/pages/admin/AdminConsultations'
import CasesAnalysisPage from '@/pages/admin/CasesAnalysisPage'
import AccountSummaryPage from '@/pages/admin/AccountSummaryPage'
import CaseTypes from '@/pages/admin/CaseTypes'

export default function AppRoutes() {
  // const { isAuthenticated, user } = useAuth()

  return (
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
        <Route path="/admin/case-types" element={<CaseTypes />} />
        <Route path="/admin/news" element={<AdminNews />} />
        <Route path="/admin/clients" element={<AdminClients />} />
        <Route path="/admin/internships" element={<AdminInternships />} />
        <Route path="/admin/about" element={<AdminAbout />} />
        <Route path="/admin/clients-files" element={<AdminClientsFiles />} />
        <Route path="/admin/chat" element={<AdminChat />} />
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
  )
}