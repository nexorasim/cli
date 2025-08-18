import React, { useEffect, useRef } from 'react';
import GlassCard from '../components/GlassCard';
import { useI18n } from '../hooks/useI18n';
import { ConvenienceIcon, TravelIcon, MultiProfileIcon, SecurityIcon, EnvironmentIcon } from '../components/SocialIcons';
import { usePageMetadata } from '../hooks/usePageMetadata';

const Advantage: React.FC<{ icon: React.ReactNode; title: string; description: string; }> = ({ icon, title, description }) => (
    <div className="flex items-start space-x-6">
        <div className="flex-shrink-0 text-secondary mt-1 w-12 h-12 flex items-center justify-center glass-card !rounded-full !p-0 !bg-secondary/10 !border-secondary/20">{icon}</div>
        <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="mt-1 text-gray-300 leading-relaxed">{description}</p>
        </div>
    </div>
);

const WhatIsESIM: React.FC = () => {
    const { t, locale } = useI18n();
    usePageMetadata('page_title_what_is_esim', 'page_description_what_is_esim');
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const { gsap } = window as any;
        if (gsap && contentRef.current) {
            const cards = contentRef.current.querySelectorAll('.animate-card');
            gsap.set(cards, { autoAlpha: 0, y: 30 });
            gsap.to(cards, { 
                autoAlpha: 1, 
                y: 0, 
                duration: 0.8, 
                stagger: 0.2, 
                ease: 'power3.out' 
            });
        }
    }, [t, locale]);

    const advantages = [
        { icon: <ConvenienceIcon />, title: t('what_is_esim_adv_1_title'), description: t('what_is_esim_adv_1_desc') },
        { icon: <TravelIcon />, title: t('what_is_esim_adv_2_title'), description: t('what_is_esim_adv_2_desc') },
        { icon: <MultiProfileIcon />, title: t('what_is_esim_adv_3_title'), description: t('what_is_esim_adv_3_desc') },
        { icon: <SecurityIcon />, title: t('what_is_esim_adv_4_title'), description: t('what_is_esim_adv_4_desc') },
        { icon: <EnvironmentIcon />, title: t('what_is_esim_env_title'), description: t('what_is_esim_env_desc') }
    ];

    const comparisonData = [
        { feature: t('what_is_esim_compare_f1'), esim: t('what_is_esim_compare_d1_esim'), psim: t('what_is_esim_compare_d1_psim') },
        { feature: t('what_is_esim_compare_f2'), esim: t('what_is_esim_compare_d2_esim'), psim: t('what_is_esim_compare_d2_psim') },
        { feature: t('what_is_esim_compare_f3'), esim: t('what_is_esim_compare_d3_esim'), psim: t('what_is_esim_compare_d3_psim') },
        { feature: t('what_is_esim_compare_f4'), esim: t('what_is_esim_compare_d4_esim'), psim: t('what_is_esim_compare_d4_psim') },
    ];

    return (
        <div ref={contentRef} className={`max-w-4xl mx-auto text-white space-y-12 ${locale === 'my' ? 'font-myanmar' : ''}`}>
            <div className="text-center animate-card">
                <h1 className="text-5xl md:text-6xl font-extrabold mb-4">{t('what_is_esim_title')}</h1>
                <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">{t('what_is_esim_intro')}</p>
            </div>

            <GlassCard className="animate-card">
                <h2 className="text-3xl font-bold text-secondary mb-4">{t('what_is_esim_how_title')}</h2>
                <p className="text-lg text-gray-200 leading-relaxed">{t('what_is_esim_how_desc')}</p>
            </GlassCard>
            
            <GlassCard className="animate-card">
                <h2 className="text-3xl font-bold text-secondary mb-8">{t('what_is_esim_advantages_title')}</h2>
                <div className="space-y-8">
                    {advantages.map((adv, index) => <Advantage key={index} {...adv} />)}
                </div>
            </GlassCard>

            <GlassCard className="animate-card">
                <h2 className="text-3xl font-bold text-secondary mb-8 text-center">{t('what_is_esim_compare_title')}</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr>
                                <th scope="col" className="p-4 text-lg font-semibold">{t('what_is_esim_compare_feature')}</th>
                                <th scope="col" className="p-4 text-lg font-semibold">{t('what_is_esim_compare_esim')}</th>
                                <th scope="col" className="p-4 text-lg font-semibold">{t('what_is_esim_compare_psim')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparisonData.map((row, index) => (
                                <tr key={index} className="border-t border-white/10">
                                    <td className="p-4 font-medium text-gray-200">{row.feature}</td>
                                    <td className="p-4 text-green-300">{row.esim}</td>
                                    <td className="p-4 text-gray-400">{row.psim}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            <GlassCard className="animate-card">
                <h2 className="text-3xl font-bold text-secondary mb-4">{t('what_is_esim_dual_sim_title')}</h2>
                <p className="text-lg text-gray-200 leading-relaxed">{t('what_is_esim_dual_sim_desc')}</p>
            </GlassCard>

            <GlassCard className="animate-card">
                <h2 className="text-3xl font-bold text-secondary mb-4">{t('what_is_esim_unlocked_title')}</h2>
                <p className="text-lg text-gray-200 leading-relaxed">{t('what_is_esim_unlocked_desc')}</p>
            </GlassCard>
        </div>
    );
};

export default WhatIsESIM;