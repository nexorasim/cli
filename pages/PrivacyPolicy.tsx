import React, { useEffect, useRef } from 'react';
import GlassCard from '../components/GlassCard';
import { useI18n } from '../hooks/useI18n';
import { BRAND_INFO } from '../constants';
import { usePageMetadata } from '../hooks/usePageMetadata';

const PrivacyPolicy: React.FC = () => {
    const { t, locale } = useI18n();
    usePageMetadata('page_title_privacy', 'page_description_privacy');
    const contentRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const { gsap } = window as any;
        if (gsap && gsap.plugins && gsap.plugins.text && contentRef.current && titleRef.current) {
            const title = titleRef.current;
            const card = contentRef.current.querySelector('.glass-card');

            if (!card) return;

            const originalTitle = title.textContent || '';
            
            gsap.set(title, { text: '', autoAlpha: 0 });
            gsap.set(card, { autoAlpha: 0, y: 30 });

            const tl = gsap.timeline();
            tl.to(title, { autoAlpha: 1, duration: 0.5 })
              .to(title, { 
                    duration: originalTitle.length * 0.05,
                    text: { value: originalTitle, padSpace: true },
                    ease: 'none',
               })
              .to(card, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, "-=0.5");
        }
    }, []);

    const Section: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
        <>
            <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-4 mt-8">{title}</h2>
            <div className="text-base md:text-lg text-gray-300 leading-relaxed space-y-4">{children}</div>
        </>
    );

    return (
        <div ref={contentRef} className={`max-w-4xl mx-auto ${locale === 'my' ? 'font-myanmar' : ''}`}>
             <div className="text-center mb-12">
                <h1 ref={titleRef} className="text-4xl md:text-5xl font-bold text-white mb-4">{t('footer_privacy')}</h1>
            </div>
            <GlassCard>
                <div>
                    <p className="text-sm text-gray-400 mb-6">Last Updated: {new Date().toLocaleDateString()}</p>
                    
                    <Section title="1. Introduction">
                        <p>Welcome to {BRAND_INFO.name} ("we," "our," or "us"). We are committed to protecting your privacy. This PrivacyPolicy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. Please read this policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.</p>
                    </Section>
                    
                    <Section title="2. Information We Collect">
                       <p>We may collect personal information that you voluntarily provide to us when you purchase a plan, register for an account, or contact us. This information may include your name, email address, phone number, payment information, and device information (such as model and IMEI for compatibility checks).</p>
                    </Section>
                    
                    <Section title="3. How We Use Your Information">
                        <p>We use the information we collect to: provide, operate, and maintain our services; process your transactions and manage your orders; send you technical notices, updates, security alerts, and support messages; respond to your comments and questions; monitor and analyze trends, usage, and activities; and comply with legal obligations.</p>
                    </Section>

                    <Section title="4. Information Sharing and Disclosure">
                        <p>We do not sell your personal data to third parties. We may share information with third-party vendors and service providers that perform services for us (like payment processing), or if required by law, such as to comply with a subpoena or other legal process.</p>
                    </Section>
                    
                    <Section title="5. Data Security and Retention">
                        <p>We use administrative, technical, and physical security measures to help protect your personal information. We will retain your personal information for as long as is necessary for the purposes set out in this policy, unless a longer retention period is required or permitted by law.</p>
                    </Section>

                    <Section title="6. Use of Cookies and Tracking Technologies">
                        <p>We may use cookies and similar tracking technologies to track the activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
                    </Section>

                    <Section title="7. Your Data Rights">
                        <p>Depending on your location, you may have rights regarding your personal data, including the right to access, correct, or delete your personal information. To exercise these rights, please contact us.</p>
                    </Section>
                    
                    <Section title="8. Changes to This Privacy Policy">
                        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
                    </Section>
                    
                    <Section title="9. Contact Us">
                        <p>If you have any questions about this Privacy Policy, please contact us at <a href={`mailto:${BRAND_INFO.email}`} className="text-secondary hover:underline">{BRAND_INFO.email}</a>.</p>
                    </Section>
                </div>
            </GlassCard>
        </div>
    );
};

export default PrivacyPolicy;