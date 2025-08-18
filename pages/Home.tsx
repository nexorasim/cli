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
    <div className="flex flex-col items-center justify-center text-center">
      <div ref={heroRef} className="relative flex flex-col items-center justify-center min-h-[calc(100vh-14rem)] w-full">
         <div className="absolute inset-0 z-0 flex items-center justify-center opacity-70">
            <div className="w-full h-full max-w-[800px] max-h-[800px]">
                 <Globe />
            </div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center p-4" style={{textShadow: '0px 2px 20px rgba(10, 15, 26, 0.9)'}}>
            <h2 className={`hero-tagline text-gray-300 text-base font-medium tracking-widest uppercase ${locale === 'my' ? 'font-myanmar' : ''}`}>
                {t('home_hero_tagline')}
            </h2>
            <h1 className={`hero-title text-5xl md:text-7xl font-extrabold tracking-tight text-white mt-4 ${locale === 'my' ? 'font-myanmar' : 'font-sans'}`}>
              {/* Populated by GSAP */}
            </h1>
            <p className={`hero-subtitle mt-6 max-w-3xl text-lg md:text-xl text-gray-300 leading-relaxed ${locale === 'my' ? 'font-myanmar' : ''}`}>
              {/* Populated by GSAP */}
            </p>
             <p className={`hero-partners mt-2 max-w-2xl text-sm text-gray-500 ${locale === 'my' ? 'font-myanmar' : ''}`}>
              {t('home_hero_partners')}
            </p>
            <div className="hero-cta mt-10">
              <Link 
                to="/buy-esim"
                className={`btn-primary ${locale === 'my' ? 'font-myanmar' : ''}`}
              >
                {t('home_hero_cta')}
              </Link>
            </div>
        </div>
      </div>
      <div className="w-full max-w-7xl mx-auto pt-16 sm:pt-24">
        <WhyChooseUs />
      </div>
    </div>
  );
};

export default Home;