import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useI18n } from '../hooks/useI18n';
import GlassCard from '../components/GlassCard';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { UploadIcon, DownloadIcon } from '../components/SocialIcons';

const SpinnerIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const VideoGenerationPage: React.FC = () => {
    const { t, locale } = useI18n();
    usePageMetadata('page_title_video_generation', 'page_description_video_generation');
    const [prompt, setPrompt] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const loadingMessages = [t('video_gen_loading_1'), t('video_gen_loading_2'), t('video_gen_loading_3'), t('video_gen_loading_4')];

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

    useEffect(() => {
        if (isLoading) {
            setLoadingMessage(loadingMessages[0]);
            let i = 1;
            const intervalId: number = window.setInterval(() => {
                setLoadingMessage(loadingMessages[i % loadingMessages.length]);
                i++;
            }, 5000);
            return () => window.clearInterval(intervalId);
        }
    }, [isLoading, loadingMessages]);
    
     const fileToBase64 = (file: File): Promise<{mimeType: string, data: string}> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                const [, data] = result.split(',');
                const mimeType = result.match(/:(.*?);/)?.[1] || file.type;
                resolve({ mimeType, data });
            };
            reader.onerror = error => reject(error);
        });
    }

    const handleGenerateVideo = async () => {
        if (!prompt.trim() || isLoading) return;
        setIsLoading(true);
        setError(null);
        setVideoUrl(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            let imagePayload;
            if (imageFile) {
                const { mimeType, data } = await fileToBase64(imageFile);
                imagePayload = { imageBytes: data, mimeType };
            }

            let operation = await ai.models.generateVideos({
              model: 'veo-2.0-generate-001',
              prompt: prompt,
              ...(imagePayload && { image: imagePayload }),
              config: {
                numberOfVideos: 1,
              }
            });
            
            while (!operation.done) {
              await new Promise(resolve => setTimeout(resolve, 10000));
              operation = await ai.operations.getVideosOperation({operation: operation});
            }

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (!downloadLink) throw new Error("Video generation completed but no download link was found.");

            const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
            if (!videoResponse.ok) throw new Error("Failed to download the generated video.");

            const videoBlob = await videoResponse.blob();
            const url = URL.createObjectURL(videoBlob);
            setVideoUrl(url);

        } catch (err) {
            console.error("Video generation error:", err);
            setError(t('video_gen_error'));
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const resetState = () => {
        setPrompt('');
        setImageFile(null);
        setImagePreview(null);
        setVideoUrl(null);
        setError(null);
        setIsLoading(false);
    };

    if (isLoading) {
        return (
             <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <GlassCard className="text-center">
                    <SpinnerIcon className="h-12 w-12 text-secondary mx-auto" />
                    <p className="mt-4 text-xl font-bold text-white">{t('video_gen_generating')}</p>
                    <p className="mt-2 text-gray-300 transition-opacity duration-500">{loadingMessage}</p>
                </GlassCard>
            </div>
        );
    }
    
    if (videoUrl) {
         return (
             <div ref={contentRef} className={`max-w-4xl mx-auto text-white ${locale === 'my' ? 'font-myanmar' : ''}`}>
                <GlassCard>
                    <video src={videoUrl} controls autoPlay loop className="rounded-lg shadow-2xl shadow-black/30 w-full max-h-[70vh] object-contain" />
                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                        <a href={videoUrl} download={`esim-myanmar-video-${Date.now()}.mp4`} className="btn-secondary w-full">
                            <DownloadIcon /> {t('video_gen_download')}
                        </a>
                         <button onClick={resetState} className="btn-primary w-full">{t('video_gen_start_over')}</button>
                    </div>
                </GlassCard>
            </div>
        );
    }

    return (
        <div ref={contentRef} className={`max-w-4xl mx-auto text-white ${locale === 'my' ? 'font-myanmar' : ''}`}>
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t('video_gen_title')}</h1>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto">{t('video_gen_subtitle')}</p>
            </div>

            <GlassCard className="space-y-6">
                 {error && (
                    <div className="p-4 rounded-lg border text-center font-semibold border-status-red/50 bg-status-red/10 text-status-red">
                        {error}
                    </div>
                )}
                <div>
                    <label htmlFor="video-prompt-input" className="sr-only">{t('video_gen_prompt_placeholder')}</label>
                    <textarea
                        id="video-prompt-input"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={t('video_gen_prompt_placeholder')}
                        rows={4}
                        className="w-full bg-white/5 text-white placeholder-gray-400 border border-white/20 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                    />
                </div>
                
                <div>
                     <label htmlFor="image-upload" className={`relative block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors duration-300 border-white/20 hover:border-secondary/50 hover:bg-white/5`}>
                        <input type="file" id="image-upload" accept="image/*" onChange={handleFileChange} className="sr-only" />
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="w-full h-32 object-contain rounded-md" />
                        ) : (
                            <div className="flex flex-col items-center justify-center">
                                <UploadIcon className="w-8 h-8 mx-auto text-gray-400" />
                                <p className="mt-2 text-white font-medium">{t('video_gen_image_prompt')}</p>
                            </div>
                        )}
                    </label>
                </div>

                <button
                    onClick={handleGenerateVideo}
                    className="btn-primary w-full"
                    disabled={!prompt.trim()}
                >
                    {t('video_gen_cta')}
                </button>
            </GlassCard>
        </div>
    );
};

export default VideoGenerationPage;