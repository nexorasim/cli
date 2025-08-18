
import React, { useEffect, useRef } from 'react';
import { useI18n } from '../hooks/useI18n';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import { usePageMetadata } from '../hooks/usePageMetadata';

const ArrowRightIcon = () => <svg className="w-6 h-6 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>;

const DashboardCard: React.FC<{ to: string, title: string, description: string, cta: string }> = ({ to, title, description, cta }) => (
    <GlassCard className="h-full flex flex-col group">
        <h3 className="text-2xl font-bold text-secondary">{title}</h3>
        <p className="text-gray-300 mt-2 flex-grow">{description}</p>
        <div className="mt-6">
            <Link to={to} className="inline-flex items-center font-bold text-white hover:text-secondary transition-colors">
                {cta}
                <ArrowRightIcon />
            </Link>
        </div>
    </GlassCard>
);

const Dashboard: React.FC = () => {
    const { t, locale } = useI18n();
    usePageMetadata('page_title_dashboard', 'page_description_dashboard');
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const { gsap } = window as any;
        if (gsap && contentRef.current) {
            gsap.fromTo(
                contentRef.current.children,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
            );
        }
    }, []);

    return (
        <div ref={contentRef} className={`max-w-5xl mx-auto text-center ${locale === 'my' ? 'font-myanmar' : ''}`}>
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{t('dashboard_title')}</h1>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto">{t('dashboard_subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <DashboardCard 
                    to="/status"
                    title={t('dashboard_card_status_title')}
                    description={t('dashboard_card_status_desc')}
                    cta={t('dashboard_card_status_cta')}
                />
                 <DashboardCard 
                    to="/developers"
                    title={t('dashboard_card_dev_title')}
                    description={t('dashboard_card_dev_desc')}
                    cta={t('dashboard_card_dev_cta')}
                />
                 <div className="md:col-span-2">
                    <DashboardCard 
                        to="/audit"
                        title={t('dashboard_card_audit_title')}
                        description={t('dashboard_card_audit_desc')}
                        cta={t('dashboard_card_audit_cta')}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
