import React, { useEffect, useRef, useState } from 'react';
import GlassCard from '../components/GlassCard';
import { useI18n } from '../hooks/useI18n';
import { SettingsIcon, CellularIcon, QRCodeIcon, WifiIcon } from '../components/SocialIcons';
import { usePageMetadata } from '../hooks/usePageMetadata';

type Tab = 'ios' | 'android';

interface Step {
    icon: React.ReactNode;
    titleKey: keyof typeof import('../lib/i18n').translations.en;
    descriptionKey: keyof typeof import('../lib/i18n').translations.en;
}

const SetupStep: React.FC<{ number: number; step: Step; t: (key: any) => string; }> = ({ number, step, t }) => {
    return (
        <div className="flex items-start space-x-4 sm:space-x-6 relative py-4">
            <div className="absolute left-6 top-12 bottom-6 w-0.5 bg-secondary/20 sm:left-7 sm:top-14 sm:bottom-7"></div>
            <div className="flex-shrink-0 flex flex-col items-center z-10">
                <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-secondary text-primary font-bold text-2xl sm:text-3xl shadow-lg shadow-secondary/20">
                    {number}
                </div>
            </div>
            <div className="pt-1 sm:pt-2">
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-3 sm:gap-4">
                    <span className="text-secondary">{step.icon}</span>
                    <span>{t(step.titleKey)}</span>
                </h3>
                <p className="mt-2 text-sm sm:text-base text-gray-300 pl-11 sm:pl-14">{t(step.descriptionKey)}</p>
            </div>
        </div>
    );
};

const HowItWorks: React.FC = () => {
    const { t, locale } = useI18n();
    usePageMetadata('page_title_how_it_works', 'page_description_how_it_works');
    const [activeTab, setActiveTab] = useState<Tab>('ios');
    const contentRef = useRef<HTMLDivElement>(null);

    const iosSteps: Step[] = [
        { icon: <SettingsIcon />, titleKey: 'how_it_works_ios_step1_title', descriptionKey: 'how_it_works_ios_step1_desc' },
        { icon: <CellularIcon />, titleKey: 'how_it_works_ios_step2_title', descriptionKey: 'how_it_works_ios_step2_desc' },
        { icon: <QRCodeIcon />, titleKey: 'how_it_works_ios_step3_title', descriptionKey: 'how_it_works_ios_step3_desc' },
        { icon: <WifiIcon />, titleKey: 'how_it_works_ios_step4_title', descriptionKey: 'how_it_works_ios_step4_desc' },
    ];

    const androidSteps: Step[] = [
        { icon: <SettingsIcon />, titleKey: 'how_it_works_android_step1_title', descriptionKey: 'how_it_works_android_step1_desc' },
        { icon: <CellularIcon />, titleKey: 'how_it_works_android_step2_title', descriptionKey: 'how_it_works_android_step2_desc' },
        { icon: <QRCodeIcon />, titleKey: 'how_it_works_android_step3_title', descriptionKey: 'how_it_works_android_step3_desc' },
        { icon: <WifiIcon />, titleKey: 'how_it_works_android_step4_title', descriptionKey: 'how_it_works_android_step4_desc' },
    ];
  
    useEffect(() => {
        const { gsap } = window as any;
        if (gsap && contentRef.current) {
            const cards = contentRef.current.querySelectorAll('.animate-card');
            gsap.set(cards, { autoAlpha: 0, y: 30 });
            gsap.to(cards, {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out'
            });
        }
    }, [t, activeTab]);

    return (
        <div ref={contentRef} className={`max-w-4xl mx-auto ${locale === 'my' ? 'font-myanmar' : ''}`}>
            <div className="text-center mb-12 animate-card">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('how_it_works_title_setup')}</h1>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">{t('how_it_works_subtitle_setup')}</p>
            </div>
            
            <div className="flex justify-center mb-8 animate-card">
                <div className="p-1.5 glass-card !rounded-full flex items-center space-x-2">
                    <button onClick={() => setActiveTab('ios')} className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 ${activeTab === 'ios' ? 'bg-secondary text-primary' : 'text-white hover:bg-white/10'}`}>{t('how_it_works_tab_ios')}</button>
                    <button onClick={() => setActiveTab('android')} className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 ${activeTab === 'android' ? 'bg-secondary text-primary' : 'text-white hover:bg-white/10'}`}>{t('how_it_works_tab_android')}</button>
                </div>
            </div>

            <GlassCard className="animate-card !p-4 sm:!p-6">
                 { (activeTab === 'ios' ? iosSteps : androidSteps).map((step, index) => (
                    <div key={index} className="animate-card">
                        <SetupStep number={index + 1} step={step} t={t} />
                    </div>
                 ))}
            </GlassCard>

            <GlassCard className="mt-12 animate-card">
                <h2 className="text-2xl font-bold text-secondary mb-4">{t('how_it_works_important_notes_title')}</h2>
                <ul className="space-y-3 text-gray-300 list-disc list-inside">
                    <li>{t('how_it_works_note1')}</li>
                    <li>{t('how_it_works_note2')}</li>
                    <li>{t('how_it_works_note3')}</li>
                </ul>
            </GlassCard>

        </div>
    );
};

export default HowItWorks;