import React, { useState, useEffect, useRef } from 'react';
import GlassCard from '../components/GlassCard';
import { useI18n } from '../hooks/useI18n';
import { BRAND_INFO } from '../constants';
import { FacebookIcon, ViberIcon, TelegramIcon, YouTubeIcon, TikTokIcon, EmailIcon, PhoneIcon, SpinnerIcon } from '../components/SocialIcons';
import { GoogleGenAI, Type } from '@google/genai';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { safeJsonParse } from '../lib/utils';

interface AnalysisResult {
    category: 'Technical Support' | 'Billing Inquiry' | 'Sales Question' | 'General Feedback' | 'Other';
    recommended_action: string;
    contact_method: 'Viber' | 'Email' | 'FAQ' | 'None';
    response_message: string;
    email_subject: string;
}

const Contact: React.FC = () => {
    const { t, locale } = useI18n();
    usePageMetadata('page_title_contact', 'page_description_contact');
    const [query, setQuery] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const { gsap } = window as any;
        if (gsap && contentRef.current) {
            const children = contentRef.current.querySelectorAll('.animate-section');
            gsap.fromTo(children,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
            );
        }
    }, []);

    const handleAnalyze = async () => {
        if (!query.trim()) return;
        
        setIsAnalyzing(true);
        setAnalysisResult(null);
        setError(null);
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `A user of eSIM Myanmar has a support request. Analyze their query and provide a structured JSON response to guide them to the best support channel.
            User Query: "${query}"
            
            Based on the query, determine the category, recommended action, and best contact method.
            - For urgent technical issues (e.g., "eSIM not working", "no internet"), recommend Viber.
            - For payment/billing issues, recommend Email.
            - For general questions about how eSIMs work or compatibility, recommend the Help Center/FAQ.
            - For sales questions, guide them to the Buy eSIM page.
            - Provide a friendly response_message and a pre-filled email_subject.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            category: {
                                type: Type.STRING,
                                enum: ['Technical Support', 'Billing Inquiry', 'Sales Question', 'General Feedback', 'Other'],
                                description: "The category of the user's request."
                            },
                            recommended_action: {
                                type: Type.STRING,
                                description: "A brief, one-sentence summary of the recommended action for the user."
                            },
                            contact_method: {
                                type: Type.STRING,
                                enum: ['Viber', 'Email', 'FAQ', 'None'],
                                description: "The best contact method. Use 'FAQ' for general questions."
                            },
                            response_message: {
                                type: Type.STRING,
                                description: "A friendly, helpful message to show the user based on their query."
                            },
                            email_subject: {
                                type: Type.STRING,
                                description: "A pre-filled subject line for an email, related to the user's query."
                            }
                        },
                        required: ['category', 'recommended_action', 'contact_method', 'response_message', 'email_subject']
                    }
                }
            });

            const [parseError, jsonResponse] = safeJsonParse(response.text.trim());
            if (parseError) {
                console.error("AI Analysis Parse Error:", parseError);
                throw new Error("Failed to parse AI response.");
            }
            setAnalysisResult(jsonResponse);

        } catch (err) {
            console.error("AI Analysis Error:", err);
            setError(t('contact_form_error_server'));
        } finally {
            setIsAnalyzing(false);
        }
    };
    
    const handleReset = () => {
        setQuery('');
        setAnalysisResult(null);
        setError(null);
    };

    const renderResult = () => {
        if (!analysisResult) return null;
        
        const emailBody = `Hello eSIM Myanmar team,\n\nI have a question regarding: ${analysisResult.category}\n\nMy issue is:\n${query}\n\nThank you.`;
        const mailtoLink = `mailto:${BRAND_INFO.email}?subject=${encodeURIComponent(analysisResult.email_subject)}&body=${encodeURIComponent(emailBody)}`;

        return (
            <div className="space-y-6 mt-6 animate-fadeInUp">
                <div className="p-4 bg-primary/50 rounded-lg border border-secondary/20">
                    <h4 className="font-semibold text-secondary">{t('contact_ai_result_title')}</h4>
                    <p className="text-gray-300 mt-1">{analysisResult.response_message}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div className="bg-primary/50 p-3 rounded-lg">
                        <p className="text-gray-400 font-semibold">{t('contact_ai_request_category')}</p>
                        <p className="text-white font-bold">{analysisResult.category}</p>
                    </div>
                     <div className="bg-primary/50 p-3 rounded-lg">
                        <p className="text-gray-400 font-semibold">{t('contact_ai_recommendation')}</p>
                        <p className="text-white font-bold">{analysisResult.recommended_action}</p>
                    </div>
                </div>

                <div className="space-y-3 pt-4">
                    {analysisResult.contact_method === 'Viber' && (
                        <a href={BRAND_INFO.social.viber} target="_blank" rel="noopener noreferrer" className="btn-primary w-full !bg-purple-600 hover:!shadow-purple-500/40">
                           <ViberIcon /> {t('contact_ai_viber_cta')}
                        </a>
                    )}
                    {analysisResult.contact_method === 'Email' && (
                        <a href={mailtoLink} className="btn-primary w-full">
                           <EmailIcon className="w-5 h-5 mr-2" /> {t('contact_ai_email_cta')}
                        </a>
                    )}
                </div>
                 <button onClick={handleReset} className="text-secondary text-sm hover:underline w-full mt-4">{t('esim_try_again')}</button>
            </div>
        )
    };
    
    const socialLinks = [
        { href: BRAND_INFO.social.facebook, label: t('footer_social_facebook'), icon: <FacebookIcon /> },
        { href: BRAND_INFO.social.viber, label: t('footer_social_viber'), icon: <ViberIcon /> },
        { href: BRAND_INFO.social.telegram, label: t('footer_social_telegram'), icon: <TelegramIcon /> },
        { href: BRAND_INFO.social.youtube, label: t('footer_social_youtube'), icon: <YouTubeIcon /> },
        { href: BRAND_INFO.social.tiktok, label: t('footer_social_tiktok'), icon: <TikTokIcon /> },
    ];
    
    return (
        <div ref={contentRef} className={`max-w-6xl mx-auto ${locale === 'my' ? 'font-myanmar' : ''}`}>
            <div className="text-center mb-12 animate-section">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('contact_title')}</h1>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto">{t('contact_subtitle')}</p>
            </div>
            
            <div className="grid lg:grid-cols-5 gap-12">
                <div className="lg:col-span-2 space-y-8 animate-section">
                    <GlassCard>
                         <h2 className="text-2xl font-bold text-secondary mb-4">{t('contact_direct_info')}</h2>
                         <div className="space-y-4">
                            <a href={`mailto:${BRAND_INFO.email}`} className="flex items-center text-base group">
                                <EmailIcon />
                                <span className="ml-4 text-white group-hover:text-secondary transition-colors">{BRAND_INFO.email}</span>
                            </a>
                            <a href={`tel:${BRAND_INFO.phone.replace(/\s/g, '')}`} className="flex items-center text-base group">
                                <PhoneIcon />
                                <span className="ml-4 text-white group-hover:text-secondary transition-colors">{BRAND_INFO.phone}</span>
                            </a>
                            <div className="flex items-start text-base">
                                <div className="w-5 h-5 mt-0.5 mr-4 text-secondary">
                                    <svg fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-white">{BRAND_INFO.address}</span>
                            </div>
                        </div>
                    </GlassCard>
                     <GlassCard>
                         <h2 className="text-2xl font-bold text-secondary mb-4">Follow & Chat</h2>
                         <div className="flex flex-wrap gap-3">
                              {socialLinks.map(link => (
                                <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="glass-card !rounded-full w-10 h-10 flex items-center justify-center text-gray-400 hover:text-secondary hover:!border-secondary/30 transition-all duration-300 transform hover:scale-110">
                                    <span className="sr-only">{link.label}</span>
                                    {link.icon}
                                </a>
                              ))}
                          </div>
                    </GlassCard>
                </div>
                
                <div className="lg:col-span-3 animate-section">
                    <GlassCard>
                        <h2 className="text-2xl font-bold text-white mb-2">{t('contact_ai_assistant_title')}</h2>
                        <p className="text-gray-400 mb-6">{t('contact_ai_assistant_subtitle')}</p>

                        {!analysisResult ? (
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="support-query" className="sr-only">{t('contact_ai_prompt_placeholder')}</label>
                                    <textarea 
                                        id="support-query"
                                        rows={5}
                                        value={query}
                                        onChange={e => setQuery(e.target.value)}
                                        placeholder={t('contact_ai_prompt_placeholder')}
                                        className="w-full bg-white/10 text-white placeholder-gray-400 border rounded-lg py-3 px-4 focus:outline-none focus:ring-2 border-white/20 focus:ring-secondary transition-all"
                                        disabled={isAnalyzing}
                                    />
                                </div>
                                <button onClick={handleAnalyze} disabled={isAnalyzing || !query.trim()} className="btn-primary w-full">
                                    {isAnalyzing ? (
                                        <>
                                            <SpinnerIcon className="-ml-1 mr-3 h-5 w-5 text-primary" />
                                            <span>{t('contact_ai_analyzing')}</span>
                                        </>
                                    ) : (
                                        <span>{t('contact_ai_cta')}</span>
                                    )}
                                </button>
                                {error && <p className="mt-2 text-center text-red-400" role="alert">{error}</p>}
                            </div>
                        ) : (
                            renderResult()
                        )}
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default Contact;