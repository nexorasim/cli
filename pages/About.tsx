import React, { useEffect, useRef } from 'react';
import GlassCard from '../components/GlassCard';
import { useI18n } from '../hooks/useI18n';
import Flowchart from '../components/Flowchart';
import { usePageMetadata } from '../hooks/usePageMetadata';

const About: React.FC = () => {
    const { t, locale } = useI18n();
    usePageMetadata('page_title_about', 'page_description_about');
    const contentRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
  
    useEffect(() => {
        const { gsap } = window as any;
        if (gsap && gsap.plugins && gsap.plugins.text && contentRef.current && titleRef.current) {
            const title = titleRef.current;
            const cards = contentRef.current.querySelectorAll('.animate-card');

            const originalTitle = title.textContent || '';
            
            gsap.set(title, { text: '', autoAlpha: 0 });
            gsap.set(cards, { autoAlpha: 0, y: 30 });

            const tl = gsap.timeline();
            tl.to(title, { autoAlpha: 1, duration: 0.5 })
              .to(title, { 
                    duration: originalTitle.length * 0.05,
                    text: { value: originalTitle, padSpace: true },
                    ease: 'none',
               })
              .to(cards, { 
                  autoAlpha: 1, 
                  y: 0, 
                  duration: 0.8, 
                  stagger: 0.2, 
                  ease: 'power3.out' 
              }, "-=0.5");
        }
    }, [t, locale]);

    const architectureChart = `
graph TD
    A[User visits<br>esim.com.mm] -->|Selects Plan| B(AI-Powered<br>Purchase Flow)
    B --> C{Secure Local Payment<br>via MMQR}
    C --> D[Nexora AI+<br>Verifies Receipt]
    D --> |If Valid| E(Instant eSIM Delivery<br>to Email or Viber)
    E --> F[<br>Connected!]
    F --> G(Enjoy High-Speed<br>Internet)

    style A fill:#4A5568,stroke:#90CDF4,stroke-width:2px
    style B fill:#00ffff,stroke:#0A0F1A,stroke-width:2px,color:#0A0F1A,font-weight:bold
    style C fill:#00ffff,stroke:#0A0F1A,stroke-width:2px,color:#0A0F1A,font-weight:bold
    style D fill:#00ffff,stroke:#0A0F1A,stroke-width:2px,color:#0A0F1A,font-weight:bold
    style E fill:#00ffff,stroke:#0A0F1A,stroke-width:2px,color:#0A0F1A,font-weight:bold
    style F fill:#38A169,stroke:#9AE6B4,stroke-width:2px,font-weight:bold
    style G fill:#2F855A,stroke:#68D391,stroke-width:2px,font-weight:bold
    linkStyle default stroke:rgba(0, 255, 255, 0.5),stroke-width:2px
`;

    return (
        <div ref={contentRef} className={`space-y-16 ${locale === 'my' ? 'font-myanmar' : ''}`}>
            <div className="text-center">
                <h1 ref={titleRef} className="text-5xl md:text-6xl font-extrabold text-white mb-4">{t('nav_about')}</h1>
            </div>

            <GlassCard className="max-w-4xl mx-auto animate-card">
                <div>
                    <h2 className="text-3xl font-bold text-secondary mb-4">{t('about_mission_title')}</h2>
                    <p className="text-lg text-gray-200 leading-relaxed">
                        {t('about_mission_desc')}
                    </p>

                    <h2 className="text-3xl font-bold text-secondary mb-4 mt-10">{t('about_vision_title')}</h2>
                    <p className="text-lg text-gray-200 leading-relaxed">
                        {t('about_vision_desc')}
                    </p>
                </div>
            </GlassCard>

            <div className="animate-card text-center">
                <h2 className="text-4xl font-extrabold text-white mb-4">{t('about_tech_stack_title')}</h2>
                <p className="text-lg text-gray-300 leading-relaxed mb-10 max-w-3xl mx-auto">
                   {t('about_tech_stack_desc')}
                </p>
                <GlassCard className="max-w-5xl mx-auto">
                    <Flowchart id="tech-flowchart" chart={architectureChart} />
                </GlassCard>
            </div>
        </div>
    );
};

export default About;