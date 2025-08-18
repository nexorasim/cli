import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import GlassCard from '../components/GlassCard';
import { useI18n } from '../hooks/useI18n';
import { CheckCircleIcon, XCircleIcon, QuestionMarkCircleIcon, SpinnerIcon } from '../components/SocialIcons';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { safeJsonParse } from '../lib/utils';

const DetectorSpinnerIcon = () => (
    <svg className="animate-spin h-5 w-5 text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const popularDevices = {
    Apple: ['iPhone 15, 15 Pro, 15 Pro Max', 'iPhone 14, 14 Pro, 14 Pro Max', 'iPhone 13, 13 Pro, 13 mini', 'iPhone 12, 12 Pro, 12 mini', 'iPhone 11, 11 Pro', 'iPhone XS, XS Max, XR', 'iPhone SE (2nd & 3rd Gen)'],
    Samsung: ['Galaxy S24, S23, S22, S21, S20 Series', 'Galaxy Z Fold/Flip 5, 4, 3, 2, 1', 'Galaxy Note 20 Series', 'Galaxy A55, A54'],
    Google: ['Pixel 8, 8 Pro', 'Pixel 7, 7 Pro', 'Pixel 6, 6 Pro, 6a', 'Pixel 5, 5a', 'Pixel 4, 4a', 'Pixel Fold'],
    Other: ['Huawei P40, P40 Pro', 'Oppo Find X5, X5 Pro', 'Sony Xperia 1 V, 10 IV', 'Xiaomi 13, 13 Pro']
};

const Compatibility: React.FC = () => {
    const { t, locale } = useI18n();
    usePageMetadata('page_title_compatibility', 'page_description_compatibility');
    const [device, setDevice] = useState('');
    const [result, setResult] = useState<{type: 'yes' | 'no' | 'uncertain' | 'info' | 'error', message: string, reason?: string} | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAutoChecking, setIsAutoChecking] = useState(true);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isListVisible, setIsListVisible] = useState(true);

    const checkCompatibility = async (deviceToCheck?: string, isAuto: boolean = false) => {
        const currentDevice = deviceToCheck || device;
        if (!currentDevice.trim()) {
            if (!isAuto) {
                setResult({type: 'info', message: 'Please enter a device model.'});
            }
            if (isAuto) setIsAutoChecking(false);
            return;
        }

        if (!isAuto) setIsLoading(true);
        setResult(null);

        try {
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
            const prompt = `Analyze the device model "${currentDevice}" to determine if it supports eSIM technology. Provide a concise reason for your conclusion.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                 config: {
                    temperature: 0,
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            isCompatible: {
                                type: Type.STRING,
                                enum: ["YES", "NO", "UNCERTAIN"],
                                description: "Whether the device supports eSIM. Must be YES, NO, or UNCERTAIN."
                            },
                            reason: {
                                type: Type.STRING,
                                description: "A brief, one-sentence explanation for the compatibility status."
                            }
                        },
                        required: ["isCompatible", "reason"]
                    }
                }
            });
            
            const text = response.text?.trim();
            if (!text) throw new Error("AI response text is empty.");
            
            const [parseError, jsonResponse] = safeJsonParse(text);

            if (parseError) {
                console.error("Failed to parse JSON response from AI:", response.text, parseError);
                setResult({type: 'error', message: t('compatibility_error')});
                return;
            }

            if (jsonResponse && typeof jsonResponse.isCompatible === 'string' && typeof jsonResponse.reason === 'string') {
                const { isCompatible, reason } = jsonResponse;
                if (isCompatible === 'YES') setResult({type: 'yes', message: t('compatibility_gemini_yes'), reason});
                else if (isCompatible === 'NO') setResult({type: 'no', message: t('compatibility_gemini_no'), reason});
                else setResult({type: 'uncertain', message: t('compatibility_gemini_uncertain'), reason});
            } else {
                console.error("Invalid JSON response schema:", jsonResponse);
                setResult({type: 'error', message: t('compatibility_error')});
            }

        } catch (err) {
            console.error("Gemini API error:", err);
            setResult({type: 'error', message: t('compatibility_error')});
        } finally {
            if (isAuto) setIsAutoChecking(false);
            else setIsLoading(false);
        }
    };
    
    useEffect(() => {
        const detectAndCheck = async () => {
            setIsAutoChecking(true);
            try {
                const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
                const prompt = `Based on this user agent string: "${navigator.userAgent}", identify the device model name (e.g., "iPhone 15 Pro", "Samsung Galaxy S23 Ultra"). Respond with only the device name. If you cannot determine a specific model, respond with an empty string.`;
                const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
                const detectedDevice = response.text?.trim() || '';
                if (detectedDevice) {
                    setDevice(detectedDevice);
                    await checkCompatibility(detectedDevice, true); 
                } else {
                    setIsAutoChecking(false);
                }
            } catch (err) {
                console.error("Auto-detection error:", err);
                setIsAutoChecking(false);
            }
        };
        detectAndCheck();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [t]);

    useEffect(() => {
        const { gsap } = window as any;
        if (gsap && gsap.plugins && gsap.plugins.text && contentRef.current) {
            const title = contentRef.current.querySelector('h1');
            const subtitle = contentRef.current.querySelector('p');
            const cards = contentRef.current.querySelectorAll('.glass-card');
            
            if (!title || !subtitle || !cards) return;

            const originalTitle = title.textContent || '';
            gsap.set(title, { text: '', autoAlpha: 0 });
            gsap.set(subtitle, { autoAlpha: 0, y: 20 });
            gsap.set(cards, { autoAlpha: 0, y: 20 });
            
            const tl = gsap.timeline();
            tl.to(title, { autoAlpha: 1, duration: 0.5 })
              .to(title, {
                  duration: originalTitle.length * 0.05,
                  text: { value: originalTitle, padSpace: true },
                  ease: 'none',
              })
              .to(subtitle, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.5')
              .to(cards, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.2, ease: 'power3.out' }, '-=0.4');
        }
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') checkCompatibility();
    }

    const getResultColor = () => {
        if (!result) return '';
        switch(result.type) {
            case 'yes': return 'bg-green-500/10 text-green-300 border-green-500/20';
            case 'no': return 'bg-red-500/10 text-red-300 border-red-500/20';
            case 'uncertain': return 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20';
            case 'error': return 'bg-red-500/10 text-red-300 border-red-500/20';
            default: return 'bg-white/5 text-white border-white/10';
        }
    }

    return (
        <div ref={contentRef} className={`max-w-4xl mx-auto text-center ${locale === 'my' ? 'font-myanmar' : ''}`}>
             <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('compatibility_title')}</h1>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto">{t('compatibility_subtitle')}</p>
            </div>
            
            <GlassCard>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                         <label htmlFor="device-input" className="sr-only">{t('compatibility_placeholder')}</label>
                         <input
                            id="device-input"
                            type="text"
                            value={device}
                            onChange={(e) => setDevice(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t('compatibility_placeholder')}
                            className="w-full bg-white/5 text-white placeholder-gray-400 border border-white/20 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-secondary disabled:opacity-70 transition-all"
                            disabled={isLoading || isAutoChecking}
                            aria-busy={isLoading || isAutoChecking}
                        />
                        {isAutoChecking && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <DetectorSpinnerIcon />
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => checkCompatibility()}
                        className="btn-primary min-w-[140px]"
                        disabled={isLoading || isAutoChecking}
                    >
                        {isLoading || isAutoChecking ? (
                            <>
                                <SpinnerIcon className="-ml-1 mr-3 h-5 w-5 text-primary" />
                                <span>{t('compatibility_checking')}</span>
                            </>
                        ) : (
                            <span>{t('compatibility_check_btn')}</span>
                        )}
                    </button>
                </div>
                {result && (
                    <div className={`mt-6 p-4 rounded-lg transition-all border text-left ${getResultColor()}`} role="alert">
                        <p className="font-medium flex items-center">
                            {result.type === 'yes' && <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />}
                            {result.type === 'no' && <XCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />}
                            {(result.type === 'uncertain' || result.type === 'info') && <QuestionMarkCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />}
                            <span>{result.message}</span>
                        </p>
                        {result.reason && <p className="mt-2 text-sm opacity-90 pl-7">{result.reason}</p>}
                    </div>
                )}
            </GlassCard>

            <div className="mt-8">
                <GlassCard>
                    <button
                        onClick={() => setIsListVisible(!isListVisible)}
                        className="w-full text-left flex justify-between items-center"
                        aria-expanded={isListVisible}
                        aria-controls="popular-devices-list"
                    >
                        <h2 className="text-2xl font-bold text-white">{t('compatibility_popular_devices_title')}</h2>
                        <span className={`transform transition-transform duration-300 ${isListVisible ? 'rotate-180' : ''}`} aria-hidden="true">
                            <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </span>
                    </button>
                    <div id="popular-devices-list" className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isListVisible ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                        <div className="overflow-hidden">
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4 pt-8 text-left">
                                {Object.entries(popularDevices).map(([brand, devices]) => (
                                    <div key={brand}>
                                        <h3 className="font-bold text-secondary mb-2">{brand}</h3>
                                        <ul className="space-y-1 text-sm text-gray-300">
                                            {devices.map(device => <li key={device}>{device}</li>)}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default Compatibility;