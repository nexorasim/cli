import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { I18nProvider, useI18n } from './hooks/useI18n';
import Layout from './components/Layout';
import ParticleBackground from './components/ParticleBackground';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';

// Direct imports for all page components
import Home from './pages/Home';
import ESimDetails from './pages/ESimDetails';
import About from './pages/About';
import Compatibility from './pages/Compatibility';
import HowItWorks from './pages/HowItWorks';
import WhatIsESIM from './pages/WhatIsESIM';
import HelpCenter from './pages/HelpCenter';
import Contact from './pages/Contact';
import Partners from './pages/Partners';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import RefundPolicy from './pages/RefundPolicy';
import NotFound from './pages/NotFound';
import Blog from './pages/Blog';
import Audit from './pages/Audit';
import Create from './pages/Create';
import Dashboard from './pages/Dashboard';
import Status from './pages/Status';
import Developers from './pages/Developers';
import ImageGeneration from './pages/ImageGeneration';
import VideoGeneration from './pages/VideoGeneration';

const AppContent: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { locale } = useI18n();
  const mermaidInitialized = useRef(false);

  useEffect(() => {
    // A short delay to allow the loading animation to play, but not block the user.
    const timer = setTimeout(() => setLoading(false), 500); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  
  useEffect(() => {
    // Mermaid initialization
    if (typeof window !== 'undefined' && (window as any).mermaid && !mermaidInitialized.current) {
        (window as any).mermaid.initialize({
            startOnLoad: false,
            theme: 'dark',
            flowchart: {
                useMaxWidth: true,
                htmlLabels: true,
                curve: 'basis',
            },
            themeVariables: {
                background: 'transparent',
                primaryColor: '#1A202C',
                primaryTextColor: '#FFFFFF',
                primaryBorderColor: '#00FFFF',
                lineColor: 'rgba(192, 192, 192, 0.6)',
                secondaryColor: '#1A202C',
                tertiaryColor: '#1A202C',
                nodeBorder: '#00FFFF',
                mainBkg: '#1A202C',
                nodeTextColor: '#FFFFFF',
                edgeLabelBackground: '#0A0F1A',
                arrowheadColor: '#00FFFF',
            }
        });
        mermaidInitialized.current = true;
    }
  }, []);

  return (
    <div className="bg-primary min-h-screen text-white font-sans">
      <LoadingScreen isVisible={loading} />
      <div className={`transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
          <ParticleBackground />
          <HashRouter>
            <Layout>
              <ErrorBoundary>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/buy-esim" element={<ESimDetails />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/compatibility" element={<Compatibility />} />
                    <Route path="/how-it-works" element={<HowItWorks />} />
                    <Route path="/what-is-esim" element={<WhatIsESIM />} />
                    <Route path="/help-center" element={<HelpCenter />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/partners" element={<Partners />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/refund-policy" element={<RefundPolicy />} />
                    <Route path="/blog" element={<Blog />} />
                    
                    {/* Hidden/dev routes */}
                    <Route path="/create" element={<Create />} />
                    <Route path="/audit" element={<Audit />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/status" element={<Status />} />
                    <Route path="/developers" element={<Developers />} />
                    <Route path="/image-generation" element={<ImageGeneration />} />
                    <Route path="/video-generation" element={<VideoGeneration />} />

                    <Route path="*" element={<NotFound />} />
                  </Routes>
              </ErrorBoundary>
            </Layout>
          </HashRouter>
      </div>
    </div>
  );
};


const App: React.FC = () => {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
};


export default App;