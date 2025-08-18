import React, { useEffect, useRef } from 'react';
import { useI18n } from '../hooks/useI18n';
import { Link } from 'react-router-dom';
import WhyChooseUs from '../components/WhyChooseUs';
import Globe from '../components/Globe';
import { usePageMetadata } from '../hooks/usePageMetadata';

const Home: React.FC = () => {
  const { t, locale } = useI18n();
  usePageMetadata('page_title_home', 'page_description_home');
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const { gsap } = window as any;
    if (gsap && gsap.plugins && gsap.plugins.text && heroRef.current) {
        const tagline = heroRef.current.querySelector('.hero-tagline');
        const title = heroRef.current.querySelector('.hero-title');
        const subtitle = heroRef.current.querySelector('.hero-subtitle');
        const partners = heroRef.current.querySelector('.hero-partners');
        const cta = heroRef.current.querySelector('.hero-cta');

        if (!tagline || !title || !subtitle || !partners || !cta) return;
        
        const titleText = t('home_hero_title');
        const subtitleText = t('home_hero_subtitle');
        
        gsap.set([tagline, title, subtitle, partners, cta], { autoAlpha: 0, y: 10 });
        
        title.textContent = '';
        subtitle.textContent = '';
        
        const tl = gsap.timeline({ delay: 0.5 });
        
        tl.to(tagline, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' })
          .to(title, { autoAlpha: 1, duration: 0.1 }, "-=0.3")
          .to(title, {
              duration: titleText.length * 0.04,
              text: { value: titleText, padSpace: true },
              ease: 'none',
          })
          .to(subtitle, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, "-=0.2")
          .to(subtitle, {
              duration: subtitleText.length * 0.015,
              text: { value: subtitleText, padSpace: true },
              ease: 'none',
          }, "<")
          .to([partners, cta], { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out'}, "-=0.5");
    }
  }, [t]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-20">
            <div className="w-full h-full max-w-[600px] max-h-[600px]">
                 <Globe />
            </div>
        </div>

        <div ref={heroRef} className="relative z-10 text-center max-w-4xl mx-auto px-4">
            <h2 className={`hero-tagline text-cyan-400 text-sm font-medium tracking-widest uppercase mb-4 ${locale === 'my' ? 'font-myanmar' : ''}`}>
                {t('home_hero_tagline')}
            </h2>
            <h1 className={`hero-title text-4xl md:text-6xl font-bold text-white mb-6 leading-tight ${locale === 'my' ? 'font-myanmar' : ''}`}>
                {/* Populated by GSAP */}
            </h1>
            <p className={`hero-subtitle text-lg md:text-xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed ${locale === 'my' ? 'font-myanmar' : ''}`}>
                {/* Populated by GSAP */}
            </p>
            <p className={`hero-partners text-sm text-gray-400 mb-8 ${locale === 'my' ? 'font-myanmar' : ''}`}>
                {t('home_hero_partners')}
            </p>
            <div className="hero-cta">
                <Link 
                    to="/buy-esim"
                    className={`inline-flex items-center px-8 py-4 bg-cyan-500 text-slate-900 font-semibold rounded-xl hover:bg-cyan-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 ${locale === 'my' ? 'font-myanmar' : ''}`}
                >
                    {t('home_hero_cta')}
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </Link>
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
            <WhyChooseUs />
        </div>
      </section>
    </div>
  );
};

export default Home;