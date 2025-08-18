import React, { useEffect, useRef } from 'react';
import GlassCard from '../components/GlassCard';
import { useI18n } from '../hooks/useI18n';
import { BRAND_INFO } from '../constants';
import { usePageMetadata } from '../hooks/usePageMetadata';

const RefundPolicy: React.FC = () => {
    const { t, locale } = useI18n();
    usePageMetadata('page_title_refund', 'page_description_refund');
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
    }, [t]);
    
    const Section: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
        <>
            <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-4 mt-8">{title}</h2>
            <div className="text-base md:text-lg text-gray-300 leading-relaxed space-y-4">{children}</div>
        </>
    );

    return (
        <div ref={contentRef} className={`max-w-4xl mx-auto ${locale === 'my' ? 'font-myanmar' : ''}`}>
            <div className="text-center mb-12">
                <h1 ref={titleRef} className="text-4xl md:text-5xl font-bold text-white mb-4">{t('footer_refund')}</h1>
            </div>
            <GlassCard>
                <div>
                    <p className="text-sm text-gray-400 mb-6">Last Updated: {new Date().toLocaleDateString()}</p>
                    
                    <Section title="1. General Policy">
                        <p>Due to the digital nature of our eSIM products, once an eSIM has been delivered and the QR code has been generated and sent, it is considered 'used' and is therefore non-refundable. We recommend checking device compatibility before purchase. We cannot be held responsible for incorrect purchases made on incompatible devices.</p>
                    </Section>
                    
                    <Section title="2. Exceptions for Technical Issues">
                       <p>A refund or replacement may be considered in cases where the eSIM fails to activate due to a technical fault from our end or our partner networks. To be eligible for a refund under these circumstances, you must:</p>
                       <ul className="list-disc list-inside space-y-2">
                           <li>Contact our support team within 72 hours of purchase.</li>
                           <li>Provide evidence of the technical issue, such as screenshots of error messages.</li>
                           <li>Cooperate with our support team in troubleshooting attempts.</li>
                       </ul>
                       <p>If the issue cannot be resolved, we may offer a replacement eSIM or a full refund at our discretion.</p>
                    </Section>
                    
                    <Section title="3. How to Request a Refund">
                        <p>To request a refund based on the exceptions above, please contact our support team through one of the channels listed on our Contact page, providing your order number and a detailed description of the issue.</p>
                    </Section>

                    <Section title="4. Processing Time">
                        <p>If a refund is approved, it will be processed within 7-10 business days to the original method of payment. Please note that it may take additional time for the refund to appear on your bank or card statement.</p>
                    </Section>

                    <Section title="5. Contact Us">
                        <p>If you have any questions about our Refund Policy, please contact us at <a href={`mailto:${BRAND_INFO.email}`} className="text-secondary hover:underline">{BRAND_INFO.email}</a>.</p>
                    </Section>
                </div>
            </GlassCard>
        </div>
    );
};

export default RefundPolicy;