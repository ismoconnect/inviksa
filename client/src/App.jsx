import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FooterMobile from './components/FooterMobile';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Services from './pages/Services';
import Cards from './pages/Cards'; // Public Cards page
import FAQ from './pages/FAQ';
import Simulator from './pages/Simulator';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/dashboard/Accounts';
import CardsDashboard from './pages/dashboard/Cards';
import DocumentsDashboard from './pages/dashboard/Documents';
import Invoicing from './pages/dashboard/Invoicing';
import Transfers from './pages/dashboard/Transfers';
import Deposit from './pages/dashboard/Deposit';
import History from './pages/dashboard/History';
import Credits from './pages/dashboard/Credits';
import Support from './pages/dashboard/Support';
import Settings from './pages/dashboard/Settings';
import Beneficiaries from './pages/dashboard/Beneficiaries';
import KycVerification from './pages/dashboard/KycVerification';
import CreditRequest from './pages/CreditRequest';
import CreditRequestMobile from './pages/CreditRequestMobile';
import About from './pages/About';
import Reviews from './pages/Reviews';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CGU from './pages/CGU';
import MentionsLegales from './pages/MentionsLegales';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/dashboard/DashboardLayout';
import EmailVerificationPending from './pages/EmailVerificationPending';
import EmailVerificationSuccess from './pages/EmailVerificationSuccess';
import AuthActionHandler from './pages/AuthActionHandler';
import './index.css';

const ResponsiveCreditRequest = () => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile ? <CreditRequestMobile /> : <CreditRequest />;
};


const PublicLayout = ({ children }) => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="public-page-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      {isMobile ? <FooterMobile /> : <Footer />}
    </div>
  );
};



// Helper to sync URL lang with i18n
const LanguageWrapper = () => {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  const validLangs = ['fr', 'en', 'es', 'it', 'pt', 'de'];

  useEffect(() => {
    if (validLangs.includes(lang)) {
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }
    }
  }, [lang, i18n]);

  if (!validLangs.includes(lang)) {
    return <Navigate to="/fr" replace />;
  }

  return <Outlet />;
};

function AppRoutes() {
  const location = useLocation();
  // const isDashboard = location.pathname.startsWith('/dashboard'); // Logic might need update if dashboard is inside :lang

  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/fr" replace />} />

      {/* Language Routes */}
      <Route path="/:lang" element={<LanguageWrapper />}>
        {/* Public Routes */}
        <Route index element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="services" element={<PublicLayout><Services /></PublicLayout>} />
        <Route path="cards" element={<PublicLayout><Cards /></PublicLayout>} />
        <Route path="faq" element={<PublicLayout><FAQ /></PublicLayout>} />
        <Route path="simulator" element={<PublicLayout><Simulator /></PublicLayout>} />
        <Route path="contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="login" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="register" element={<PublicLayout><Register /></PublicLayout>} />
        <Route path="credit-request" element={<PublicLayout><ResponsiveCreditRequest /></PublicLayout>} />
        <Route path="reviews" element={<PublicLayout><Reviews /></PublicLayout>} />
        <Route path="confidentialite" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
        <Route path="cgu" element={<PublicLayout><CGU /></PublicLayout>} />
        <Route path="mentions-legales" element={<PublicLayout><MentionsLegales /></PublicLayout>} />

        {/* Auth specific pages might need to be outside or handled carefully, keeping them inside for consistent lang */}
        <Route path="email-verification-pending" element={<EmailVerificationPending />} />
        <Route path="email-verification-success" element={<EmailVerificationSuccess />} />
        {/* Dashboard Private Routes - Now under /:lang/dashboard */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="transfers" element={<Transfers />} />
          <Route path="deposit" element={<Deposit />} />
          <Route path="cards" element={<CardsDashboard />} />
          <Route path="credits" element={<Credits />} />
          <Route path="history" element={<History />} />
          <Route path="beneficiaries" element={<Beneficiaries />} />
          <Route path="documents" element={<DocumentsDashboard />} />
          <Route path="invoicing" element={<Invoicing />} />
          <Route path="support" element={<Support />} />
          <Route path="settings" element={<Settings />} />
          <Route path="kyc" element={<KycVerification />} />
        </Route>
      </Route>

      {/* Auth Action Handler - MUST be outside :lang block to catch Firebase redirects */}
      <Route path="/auth/action" element={<AuthActionHandler />} />
      <Route path="/__/auth/action" element={<AuthActionHandler />} />
    </Routes>
  );
}

// ... imports
import { db } from './firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import MaintenancePage from './pages/MaintenancePage';

function App() {
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);
  const [loadingSettings, setLoadingSettings] = React.useState(true);

  useEffect(() => {
    // 1. Listen to global settings for maintenance mode
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (doc) => {
      if (doc.exists()) {
        setMaintenanceMode(doc.data().maintenanceMode || false);
      }
      setLoadingSettings(false);
    }, (error) => {
      console.error("Error fetching settings:", error);
      setLoadingSettings(false);
    });

    // 2. Preload language flags to avoid delay in production
    const flags = ['/flags/fr.png', '/flags/gb.png', '/flags/es.png', '/flags/it.png', '/flags/pt.png', '/flags/de.png'];
    flags.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    return () => unsub();
  }, []);

  if (loadingSettings) {
    return <div className="loading-screen"><div className="spinner"></div></div>;
  }

  if (maintenanceMode) {
    return <MaintenancePage />;
  }

  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<div className="loading-screen"><div className="spinner"></div></div>}>
        <AppRoutes />
      </Suspense>
    </Router>
  );
}

export default App;
