import React, { useEffect, useRef } from 'react';
import GlassCard from '../components/GlassCard';
import { useI18n } from '../hooks/useI18n';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { TelecomLogo, FinancialLogo, PaymentGatewayLogo, MarketingLogo } from '../components/PartnerLogos';

const PartnerLogo: React.FC<{ name: string; type: 'telecom' | 'financial' | 'payment' | 'marketing'; }> = ({ name, type }) => {
    const getLogo = () => {
        switch(type) {
            case 'telecom': return <TelecomLogo name={name} />;
            case 'financial': return <FinancialLogo name={name} />;
            case 'payment': return <PaymentGatewayLogo name={name} />;
            case 'marketing': return <MarketingLogo name={name} />;
            default: return <span>{name}</span>;
        }
    };
    return (
        <GlassCard className="partner-logo flex items-center justify-center h-32 p-4 !bg-white/5 hover:!bg-white/10 transform transition-all duration-300 hover:scale-105 hover:shadow-secondary/10">
            {getLogo()}
        </GlassCard>
    );
};


const Partners: React.FC = () => {
    const { t, locale } = useI18n();
    usePageMetadata('page_title_partners', 'page_description_partners');
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const { gsap } = window as any;
        if (gsap && gsap.plugins && gsap.plugins.scrollTrigger && contentRef.current) {
            const title = contentRef.current.querySelector('h1');
            const subtitle = contentRef.current.querySelector('p');
            const categories = contentRef.current.querySelectorAll('.partner-category');

            if (!title || !subtitle || !categories.length) return;

            const originalTitle = title.textContent || '';
            gsap.set(title, { text: '', autoAlpha: 0 });
            gsap.set(subtitle, { autoAlpha: 0, y: 20 });

            const tl = gsap.timeline();
            tl.to(title, { autoAlpha: 1, duration: 0.5 })
              .to(title, {
                  duration: originalTitle.length * 0.05,
                  text: { value: originalTitle, padSpace: true },
                  ease: 'none',
              })
              .to(subtitle, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, "-=0.5");
            
            categories.forEach(category => {
                const categoryTitle = category.querySelector('h2');
                const logos = category.querySelectorAll('.partner-logo');
                const categoryTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: category,
                        start: 'top 85%',
                        toggleActions: 'play none none reset',
                    }
                });
                categoryTl.fromTo([categoryTitle, ...logos], 
                    { autoAlpha: 0, y: 30 },
                    { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
                );
            });
        }
    }, [t]);
    
    const partnerCategories = [
        {
          title: t('partners_telecom'),
          type: 'telecom',
          partners: ["ATOM", "Mytel", "MPT", "Ooredoo"]
        },
        {
          title: t('partners_financial'),
          type: 'financial',
          partners: ["AYA Bank", "UAB Bank", "KBZ Bank", "CB Bank"]
        },
        {
          title: t('partners_payment'),
          type: 'payment',
          partners: ["WavePay", "AYA Pay", "UAB Pay", "KBZPay"]
        },
        {
          title: t('partners_digital_marketing'),
          type: 'marketing',
          partners: ["Activ Digital Marketing"]
        }
    ] as const;

    return (
        <div ref={contentRef} className={`max-w-5xl mx-auto ${locale === 'my' ? 'font-myanmar' : ''}`}>
             <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('partners_page_title')}</h1>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto">{t('partners_page_intro')}</p>
            </div>
             
             <div className="space-y-16">
                {partnerCategories.map((category, index) => (
                    <div key={index} className="partner-category">
                         <h2 className="text-3xl font-bold text-secondary mb-8 text-center">{category.title}</h2>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {category.partners.map(name => <PartnerLogo key={name} name={name} type={category.type} />)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Partners;