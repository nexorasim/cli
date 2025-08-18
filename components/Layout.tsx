import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AiChatPopup from './AiChatPopup';
import AudioPlayer from './AudioPlayer';

interface LayoutProps {
  children: React.ReactNode;
}

const AiChatButton = () => (
    <div className="group relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
        <div className="relative w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center border border-cyan-400/30 hover:border-cyan-400 transition-all duration-300 group-hover:scale-105">
            <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L1 23l6.71-1.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.21 0-2.35-.24-3.39-.68L3 21l1.68-5.61C4.24 14.35 4 13.21 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
                <circle cx="8.5" cy="12" r="1.5"/>
                <circle cx="12" cy="12" r="1.5"/>
                <circle cx="15.5" cy="12" r="1.5"/>
            </svg>
        </div>
        <span className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900"></span>
    </div>
);

const ScrollToTopButton = () => (
    <div className="w-12 h-12 bg-slate-800/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-600 hover:border-gray-400 transition-all duration-300 hover:bg-slate-700">
        <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
    </div>
);

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isScrollTopVisible, setIsScrollTopVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const location = useLocation();

  const toggleVisibility = () => {
    setIsScrollTopVisible(window.scrollY > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  useEffect(() => {
    if (isChatOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isChatOpen]);
  
  useEffect(() => {
    const handleOpenChat = () => setIsChatOpen(true);
    window.addEventListener('open-ai-chat', handleOpenChat);
    return () => window.removeEventListener('open-ai-chat', handleOpenChat);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const { gsap } = window as any;
    if (mainRef.current && gsap) {
      gsap.fromTo(mainRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power1.inOut' });
    }
  }, [location.pathname]);

  return (
    <div className="relative z-10 flex flex-col min-h-screen">
      <Header />
      <main ref={mainRef} className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {children}
      </main>
      <Footer />
      
      <AudioPlayer />
      <AiChatPopup isOpen={isChatOpen} setIsOpen={setIsChatOpen} />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
         <button
            onClick={() => setIsChatOpen(true)}
            className={`transition-all duration-300 ${isChatOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}
            aria-label="Ask AI Assistant"
        >
            <AiChatButton />
        </button>
        
        <button
          onClick={scrollToTop}
          className={`transition-all duration-300 ${isScrollTopVisible && !isChatOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
          aria-label="Scroll to top"
        >
            <ScrollToTopButton />
        </button>
      </div>
    </div>
  );
};

export default Layout;