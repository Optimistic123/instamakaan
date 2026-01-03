import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Pages
import HomePage from "@/pages/HomePage";
import PartnerPage from "@/pages/PartnerPage";
import PropertiesPage from "@/pages/PropertiesPage";
import PropertyDetailPage from "@/pages/PropertyDetailPage";
import BlogPage from "@/pages/BlogPage";
import AboutPage from "@/pages/AboutPage";
import ReferPage from "@/pages/ReferPage";
import FAQPage from "@/pages/FAQPage";
import ContactPage from "@/pages/ContactPage";

// Auth Pages
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

// Admin Pages
import AdminLayout from "@/pages/admin/AdminLayout";
import DashboardPage from "@/pages/admin/DashboardPage";
import PropertiesListPage from "@/pages/admin/PropertiesListPage";
import PropertyFormPage from "@/pages/admin/PropertyFormPage";
import InquiriesPage from "@/pages/admin/InquiriesPage";
import OwnersPage from "@/pages/admin/OwnersPage";
import OwnerDashboardPage from "@/pages/admin/OwnerDashboardPage";
import AgentsPage from "@/pages/admin/AgentsPage";
import AgentInquiriesPage from "@/pages/admin/AgentInquiriesPage";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/partner" element={<PartnerPage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/property/:id" element={<PropertyDetailPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/refer" element={<ReferPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Auth Routes */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            
            {/* Admin Routes - Protected */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="properties" element={<PropertiesListPage />} />
              <Route path="properties/new" element={<PropertyFormPage />} />
              <Route path="properties/:id/edit" element={<PropertyFormPage />} />
              <Route path="owners" element={<OwnersPage />} />
              <Route path="owners/:ownerId/dashboard" element={<OwnerDashboardPage />} />
              <Route path="agents" element={<AgentsPage />} />
              <Route path="agents/:agentId/inquiries" element={<AgentInquiriesPage />} />
              <Route path="inquiries" element={<InquiriesPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" />
      </AuthProvider>
    </div>
  );
}

export default App;
