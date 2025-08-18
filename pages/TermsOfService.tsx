import React, { useEffect, useRef } from 'react';
import GlassCard from '../components/GlassCard';
import { useI18n } from '../hooks/useI18n';
import { BRAND_INFO } from '../constants';
import { usePageMetadata } from '../hooks/usePageMetadata';

const TermsOfService: React.FC = () => {
    const { t, locale } = useI18n();
    usePageMetadata('page_title_terms', 'page_description_terms');
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
                <h1 ref={titleRef} className="text-4xl md:text-5xl font-bold text-white mb-4">{t('footer_terms')}</h1>
            </div>
            <GlassCard>
                <div>
                    <p className="text-sm text-gray-400 mb-6">Last Updated: {new Date().toLocaleDateString()}</p>
                    
                    <Section title="1. Agreement to Terms">
                        <p>By accessing or using the services of {BRAND_INFO.name} ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, then you may not access the Service.</p>
                    </Section>

                    <Section title="2. Service Provision">
                       <p>{BRAND_INFO.name} provides digital SIM card services for use in Myanmar. Service availability and quality may vary depending on your location, device, and network coverage. We do not guarantee uninterrupted service.</p>
                    </Section>

                    <Section title="3. User Accounts">
                        <p>To access some features of the Service, you may be required to create an account. You are responsible for safeguarding your account information and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.</p>
                    </Section>

                    <Section title="4. Payment, Fees, and Refunds">
                        <p>All plans are prepaid. You agree to pay all applicable fees for the plans you purchase. Payments are processed through a secure third-party payment processor. Due to the digital nature of our product, all sales are final and non-refundable once the eSIM has been delivered.</p>
                    </Section>

                    <Section title="5. User Responsibilities and Conduct">
                        <p>You agree to use our services only for lawful purposes and in accordance with these Terms. You are responsible for ensuring your device is eSIM-compatible and unlocked. We are not responsible for any issues arising from device incompatibility.</p>
                    </Section>

                    <Section title="6. Intellectual Property Rights">
                       <p>The Service and its original content, features, and functionality are and will remain the exclusive property of {BRAND_INFO.name} and its licensors. Our trademarks may not be used in connection with any product or service without our prior written consent.</p>
                    </Section>

                    <Section title="7. Termination">
                        <p>We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
                    </Section>

                    <Section title="8. Limitation of Liability">
                        <p>In no event shall {BRAND_INFO.name}, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, or other intangible losses, resulting from your use of the Service.</p>
                    </Section>

                    <Section title="9. Governing Law">
                        <p>These Terms shall be governed and construed in accordance with the laws of the Republic of the Union of Myanmar, without regard to its conflict of law provisions.</p>
                    </Section>
                    
                    <Section title="10. Changes to Terms">
                        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.</p>
                    </Section>
                </div>
            </GlassCard>
        </div>
    );
};

export default TermsOfService;