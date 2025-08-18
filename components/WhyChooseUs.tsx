import React, { useEffect, useRef } from 'react';
import { useI18n } from '../hooks/useI18n';
import GlassCard from './GlassCard';
import {
    ConnectivityIcon,
    DualSimIcon,
    PaymentIcon,
    PerformanceIcon,
    SecurityIcon,
    SupportIcon
} from './SocialIcons';

const Feature: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => {
    const iconContainerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    
    useEffect(() => {
        const { gsap } = window as any;
        if (!gsap || !gsap.plugins || !gsap.plugins.scrollTrigger || !gsap.plugins.text || !titleRef.current) return;

        const titleEl = titleRef.current;
        const originalText = titleEl.textContent || '';
        gsap.set(titleEl, { text: '' });

        gsap.ScrollTrigger.create({
            trigger: titleEl,
            start: 'top 85%',
            onEnter: () => gsap.to(titleEl, {
                text: { value: originalText, padSpace: true },
                duration: originalText.length * 0.04,
                ease: 'none',
            }),
            once: true,
        });
    }, []);


    const handleMouseEnter = () => {
        const { gsap } = window as any;
        if (gsap && iconContainerRef.current) {
            gsap.to(iconContainerRef.current, { y: -8, scale: 1.05, duration: 0.3, ease: 'back.out(1.7)' });
        }
    };

    const handleMouseLeave = () => {
        const { gsap } = window as any;
        if (gsap && iconContainerRef.current) {
            gsap.to(iconContainerRef.current, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out' });
        }
    };

    return (
        <GlassCard 
            className="text-left !p-8 h-full" 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
        >
            <div ref={iconContainerRef} className="w-12 h-12 mb-5 flex items-center justify-center glass-card !rounded-full !p-0 !bg-secondary/10 !border-secondary/20">
                <div className="text-secondary">{icon}</div>
            </div>
            <h3 ref={titleRef} className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
        </GlassCard>
    );
};

const WhyChooseUs = () => {
    const { t, locale } = useI18n();
    const sectionRef = useRef<HTMLElement>(null);

    const features = [
        {
            icon: <ConnectivityIcon />,
            title: t('home_feature_connectivity_title'),
            description: t('home_feature_connectivity_desc'),
        },
        {
            icon: <DualSimIcon />,
            title: t('home_feature_numbers_title'),
            description: t('home_feature_numbers_desc'),
        },
        {
            icon: <PaymentIcon />,
            title: t('home_feature_payment_title'),
            description: t('home_feature_payment_desc'),
        },
        {
            icon: <PerformanceIcon />,
            title: t('home_feature_performance_title'),
            description: t('home_feature_performance_desc'),
        },
        {
            icon: <SecurityIcon />,
            title: t('home_feature_security_title'),
            description: t('home_feature_security_desc'),
        },
        {
            icon: <SupportIcon />,
            title: t('home_feature_support_title'),
            description: t('home_feature_support_desc'),
        },
    ];

    useEffect(() => {
        const { gsap } = window as any;
        if (!gsap || !gsap.plugins || !gsap.plugins.scrollTrigger || !gsap.plugins.text || !sectionRef.current) return;
        
        const titleElements = sectionRef.current.querySelectorAll('.section-title');
        const gridElements = sectionRef.current.querySelectorAll('.feature-card');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                toggleActions: 'play none none reset'
            }
        });

        const mainTitle = titleElements[0];
        const subTitle = titleElements[1];

        if(mainTitle && subTitle) {
            const originalTitleText = mainTitle.textContent;
            mainTitle.textContent = '';
            tl.fromTo(subTitle, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
            tl.to(mainTitle, { text: originalTitleText, duration: originalTitleText.length * 0.04, ease: 'none'}, 0);
        }
        
        tl.fromTo(gridElements,
            { opacity: 0, y: 30, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
            "-=0.5"
        );
        
    }, [t]);

    return (
        <section ref={sectionRef} className={`py-20 sm:py-24 ${locale === 'my' ? 'font-myanmar' : ''}`}>
            <div className="text-center mb-16">
                <h2 className="section-title text-4xl font-extrabold text-white mb-4">{t('home_why_choose_title')}</h2>
                <p className="section-title mt-4 max-w-3xl mx-auto text-lg text-gray-300 leading-relaxed">{t('home_why_choose_subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <div className="feature-card" key={index}>
                      <Feature {...feature} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WhyChooseUs;