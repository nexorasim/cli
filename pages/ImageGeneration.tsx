import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useI18n } from '../hooks/useI18n';
import GlassCard from '../components/GlassCard';
import { usePageMetadata } from '../hooks/usePageMetadata';

const SpinnerIcon = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const ImageGenerationPage: React.FC = () => {
    const { t, locale } = useI18n();
    usePageMetadata('page_title_image_generation', 'page_description_image_generation');
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
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

    const handleGenerateImage = async () => {
        if (!prompt.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setImageUrl(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateImages({
                model: 'imagen-3.0-generate-002',
                prompt: prompt,
                config: {
                  numberOfImages: 1,
                  outputMimeType: 'image/jpeg',
                },
            });

            if (response.generatedImages && response.generatedImages.length > 0) {
                const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
                const url = `data:image/jpeg;base64,${base64ImageBytes}`;
                setImageUrl(url);
            } else {
                throw new Error("No image was generated.");
            }
        } catch (err) {
            console.error("Image generation error:", err);
            setError(t('image_gen_error'));
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleGenerateImage();
        }
    };

    return (
        <div ref={contentRef} className={`max-w-4xl mx-auto text-white ${locale === 'my' ? 'font-myanmar' : ''}`}>
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t('image_gen_title')}</h1>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto">{t('image_gen_subtitle')}</p>
            </div>

            <GlassCard className="mb-8">
                <label htmlFor="image-prompt-input" className="sr-only">{t('image_gen_prompt_placeholder')}</label>
                <textarea
                    id="image-prompt-input"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t('image_gen_prompt_placeholder')}
                    rows={3}
                    className="w-full bg-white/5 text-white placeholder-gray-400 border border-white/20 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                    disabled={isLoading}
                />
                <div className="mt-4">
                    <button
                        onClick={handleGenerateImage}
                        className="btn-primary w-full"
                        disabled={isLoading || !prompt.trim()}
                    >
                        {isLoading ? (
                            <>
                                <SpinnerIcon />
                                <span>{t('image_gen_generating')}</span>
                            </>
                        ) : (
                            <span>{t('image_gen_cta')}</span>
                        )}
                    </button>
                </div>
            </GlassCard>

            {isLoading && (
                 <GlassCard className="flex items-center justify-center h-80">
                    <div className="text-center">
                        <svg className="animate-spin h-12 w-12 text-secondary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <p className="mt-4 text-lg text-gray-300">{t('image_gen_generating')}</p>
                    </div>
                 </GlassCard>
            )}
            
            {error && (
                <GlassCard className="border-status-red/50 bg-status-red/10 text-center">
                    <p className="text-red-300">{error}</p>
                </GlassCard>
            )}

            {imageUrl && !isLoading && (
                <GlassCard>
                    <img src={imageUrl} alt={prompt} className="rounded-lg shadow-2xl shadow-black/30 w-full max-h-[70vh] object-contain" />
                </GlassCard>
            )}
        </div>
    );
};

export default ImageGenerationPage;