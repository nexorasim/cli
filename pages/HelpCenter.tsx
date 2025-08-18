import React, { useState, useEffect, useRef, useId } from 'react';
import { useI18n } from '../hooks/useI18n';
import GlassCard from '../components/GlassCard';
import { getFaqs } from '../data/faq';
import { usePageMetadata } from '../hooks/usePageMetadata';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    const answerId = useId();

    return (
        <div className="border-b border-white/10 last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-6"
                aria-expanded={isOpen}
                aria-controls={answerId}
            >
                <span className="text-lg font-medium text-white">{question}</span>
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true">
                    <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
            </button>
            <div 
                id={answerId}
                role="region"
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="pb-6 text-gray-300 text-base">
                        <p className="leading-relaxed">{answer}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


const HelpCenter: React.FC = () => {
    const { t, locale } = useI18n();
    usePageMetadata('page_title_help_center', 'page_description_help_center');
    const faqs = getFaqs(t);
    
    const contentRef = useRef<HTMLDivElement>(null);
    const aiPromptRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const { gsap } = window as any;
        if (gsap && gsap.plugins && gsap.plugins.text && contentRef.current) {
            const title = contentRef.current.querySelector('h1');
            const card = contentRef.current.querySelector('.glass-card');
            const prompt = aiPromptRef.current;

            if (!title || !card || !prompt) return;

            const originalTitle = title.textContent || '';
            gsap.set(title, { text: '', autoAlpha: 0 });
            gsap.set([card, prompt], { autoAlpha: 0, y: 30 });
            
            const tl = gsap.timeline();
            tl.to(title, { autoAlpha: 1, duration: 0.5 })
              .to(title, {
                  duration: originalTitle.length * 0.05,
                  text: { value: originalTitle, padSpace: true },
                  ease: 'none',
              })
              .to(card, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, "-=0.5")
              .to(prompt, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, "-=0.4");
        }
    }, [t]);

    return (
        <div ref={contentRef} className={`max-w-4xl mx-auto ${locale === 'my' ? 'font-myanmar' : ''}`}>
            <div className="text-center mb-16">
                <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">{t('help_center_title')}</h1>
            </div>
            <GlassCard className="!p-4 sm:!p-6 md:!p-8">
                {faqs.map((faq) => (
                    <FAQItem key={faq.q} question={faq.q} answer={faq.a} />
                ))}
            </GlassCard>
            
            <div ref={aiPromptRef} className="text-center mt-16 px-4">
              <p className="text-lg text-gray-300 mb-6">
                {t('faq_ai_prompt')}
              </p>
              <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('open-ai-chat'))}
                  className="btn-primary"
              >
                  {t('faq_ai_cta')}
              </button>
            </div>
        </div>
    );
};

export default HelpCenter;