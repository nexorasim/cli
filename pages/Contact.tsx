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
            const prompt = `Analyze this support request for eSIM Myanmar: "${query}"
            
            Provide structured guidance in JSON format.`;

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
                                enum: ['Technical Support', 'Billing Inquiry', 'Sales Question', 'General Feedback', 'Other']
                            },
                            recommended_action: { type: Type.STRING },
                            contact_method: {
                                type: Type.STRING,
                                enum: ['Viber', 'Email', 'FAQ', 'None']
                            },
                            response_message: { type: Type.STRING },
                            email_subject: { type: Type.STRING }
                        },
                        required: ['category', 'recommended_action', 'contact_method', 'response_message', 'email_subject']
                    }
                }
            });

            const [parseError, jsonResponse] = safeJsonParse(response.text.trim());
            if (parseError) {
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
        
        const emailBody = `Hello eSIM Myanmar team,\n\nCategory: ${analysisResult.category}\nIssue: ${query}\n\nThank you.`;
        const mailtoLink = `mailto:${BRAND_INFO.email}?subject=${encodeURIComponent(analysisResult.email_subject)}&body=${encodeURIComponent(emailBody)}`;

        return (
            <div className="space-y-6 mt-6">
                <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
                    <h4 className="font-semibold text-cyan-900 mb-2">{t('contact_ai_result_title')}</h4>
                    <p className="text-gray-700">{analysisResult.response_message}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 font-medium">{t('contact_ai_request_category')}</p>
                        <p className="text-gray-900 font-semibold">{analysisResult.category}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 font-medium">{t('contact_ai_recommendation')}</p>
                        <p className="text-gray-900 font-semibold">{analysisResult.recommended_action}</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {analysisResult.contact_method === 'Viber' && (
                        <a href={BRAND_INFO.social.viber} target="_blank" rel="noopener noreferrer" 
                           className="w-full inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors">
                           <ViberIcon className="mr-2" /> {t('contact_ai_viber_cta')}
                        </a>
                    )}
                    {analysisResult.contact_method === 'Email' && (
                        <a href={mailtoLink} 
                           className="w-full inline-flex items-center justify-center px-6 py-3 bg-cyan-500 text-white font-medium rounded-lg hover:bg-cyan-600 transition-colors">
                           <EmailIcon className="w-4 h-4 mr-2" /> {t('contact_ai_email_cta')}
                        </a>
                    )}
                </div>
                <button onClick={handleReset} className="text-cyan-600 text-sm hover:underline w-full mt-4">
                    {t('esim_try_again')}
                </button>
            </div>
        );
    };
    
    const socialLinks = [
        { href: BRAND_INFO.social.facebook, label: "Facebook", icon: <FacebookIcon /> },
        { href: BRAND_INFO.social.viber, label: "Viber", icon: <ViberIcon /> },
        { href: BRAND_INFO.social.telegram, label: "Telegram", icon: <TelegramIcon /> },
        { href: BRAND_INFO.social.youtube, label: "YouTube", icon: <YouTubeIcon /> },
        { href: BRAND_INFO.social.tiktok, label: "TikTok", icon: <TikTokIcon /> },
    ];
    
    return (
        <div ref={contentRef} className={`max-w-6xl mx-auto ${locale === 'my' ? 'font-myanmar' : ''}`}>
            {/* Header */}
            <div className="text-center mb-16 animate-section">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('contact_title')}</h1>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">{t('contact_subtitle')}</p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Information */}
                <div className="space-y-8 animate-section">
                    <GlassCard className="hover:border-cyan-400/30 transition-all duration-300">
                         <h2 className="text-2xl font-bold text-white mb-6">{t('contact_direct_info')}</h2>
                         <div className="space-y-6">
                            <a href={`mailto:${BRAND_INFO.email}`} className="flex items-center text-lg group">
                                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mr-4">
                                    <EmailIcon />
                                </div>
                                <span className="text-white group-hover:text-cyan-400 transition-colors">{BRAND_INFO.email}</span>
                            </a>
                            <a href={`tel:${BRAND_INFO.phone.replace(/\s/g, '')}`} className="flex items-center text-lg group">
                                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mr-4">
                                    <PhoneIcon />
                                </div>
                                <span className="text-white group-hover:text-cyan-400 transition-colors">{BRAND_INFO.phone}</span>
                            </a>
                            <div className="flex items-start text-lg">
                                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mr-4">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-white">{BRAND_INFO.address}</span>
                            </div>
                        </div>
                    </GlassCard>
                    
                    <GlassCard className="hover:border-cyan-400/30 transition-all duration-300">
                         <h2 className="text-2xl font-bold text-white mb-6">Social Media</h2>
                         <div className="grid grid-cols-5 gap-4">
                              {socialLinks.map(link => (
                                <a key={link.href} href={link.href} target="_blank" rel="noreferrer" 
                                   className="w-12 h-12 rounded-xl bg-slate-700/50 border border-gray-600 hover:border-cyan-400 flex items-center justify-center text-gray-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110">
                                    {link.icon}
                                </a>
                              ))}
                          </div>
                    </GlassCard>
                </div>
                
                {/* AI Assistant */}
                <div className="animate-section">
                    <GlassCard className="hover:border-cyan-400/30 transition-all duration-300">
                        <h2 className="text-2xl font-bold text-white mb-4">{t('contact_ai_assistant_title')}</h2>
                        <p className="text-gray-300 mb-6">{t('contact_ai_assistant_subtitle')}</p>

                        {!analysisResult ? (
                            <div className="space-y-4">
                                <textarea 
                                    rows={4}
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    placeholder={t('contact_ai_prompt_placeholder')}
                                    className="w-full bg-slate-800/50 text-white placeholder-gray-400 border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                    disabled={isAnalyzing}
                                />
                                <button 
                                    onClick={handleAnalyze} 
                                    disabled={isAnalyzing || !query.trim()} 
                                    className="w-full px-6 py-3 bg-cyan-500 text-slate-900 font-semibold rounded-lg hover:bg-cyan-400 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isAnalyzing ? (
                                        <div className="flex items-center justify-center">
                                            <SpinnerIcon className="mr-2 h-4 w-4" />
                                            <span>{t('contact_ai_analyzing')}</span>
                                        </div>
                                    ) : (
                                        <span>{t('contact_ai_cta')}</span>
                                    )}
                                </button>
                                {error && <p className="text-red-400 text-sm text-center" role="alert">{error}</p>}
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