import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

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

// Admin Pages
import AdminLayout from "@/pages/admin/AdminLayout";
import DashboardPage from "@/pages/admin/DashboardPage";
import PropertiesListPage from "@/pages/admin/PropertiesListPage";
import PropertyFormPage from "@/pages/admin/PropertyFormPage";
import InquiriesPage from "@/pages/admin/InquiriesPage";

function App() {
  return (
    <div className="App">
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
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="properties" element={<PropertiesListPage />} />
            <Route path="properties/new" element={<PropertyFormPage />} />
            <Route path="properties/:id/edit" element={<PropertyFormPage />} />
            <Route path="inquiries" element={<InquiriesPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
