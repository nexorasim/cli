import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AiChatPopup from './AiChatPopup';
import NexoraLogo from './NexoraLogo';
import { ChevronUpIcon } from './SocialIcons';
import AudioPlayer from './AudioPlayer';

interface LayoutProps {
  children: React.ReactNode;
}

const AiChatIcon = () => (
    <div className="relative w-16 h-16 group">
        <div className="absolute -inset-1 bg-gradient-to-r from-secondary via-purple-500 to-secondary rounded-full blur-lg opacity-60 group-hover:opacity-80 transition duration-1000 group-hover:duration-200 animate-aurora-sweep"></div>
        <div className="relative w-full h-full bg-primary/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-secondary/30 overflow-hidden">
            <NexoraLogo className="w-full h-full transition-transform duration-300 group-hover:scale-110" />
        </div>
    </div>
);


const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isScrollTopVisible, setIsScrollTopVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const location = useLocation();

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsScrollTopVisible(true);
    } else {
      setIsScrollTopVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  useEffect(() => {
    if (isChatOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isChatOpen]);
  
  useEffect(() => {
    const handleOpenChat = () => setIsChatOpen(true);
    window.addEventListener('open-ai-chat', handleOpenChat);
    return () => {
      window.removeEventListener('open-ai-chat', handleOpenChat);
    };
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

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-4">
         <button
            onClick={() => setIsChatOpen(true)}
            className={`transition-all duration-300 transform hover:scale-105 ${isChatOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}
            aria-label="Open AI chat"
        >
            <AiChatIcon />
        </button>
        <button
          onClick={scrollToTop}
          className={`w-12 h-12 glass-card !rounded-full flex items-center justify-center text-secondary hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:ring-secondary transition-all duration-300 ${isScrollTopVisible && !isChatOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
          aria-label="Go to top"
        >
          <ChevronUpIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Layout;