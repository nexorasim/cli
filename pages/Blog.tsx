import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '../hooks/useI18n';
import GlassCard from '../components/GlassCard';
import { GoogleGenAI, Type } from '@google/genai';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { safeJsonParse } from '../lib/utils';

const SpinnerIcon = () => (
    <svg className="animate-spin h-12 w-12 text-secondary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

interface BlogPost {
    title: string;
    summary: string;
    author: string;
    date: string;
}

const Blog: React.FC = () => {
    const { t, locale } = useI18n();
    usePageMetadata('page_title_blog', 'page_description_blog');
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const generateBlogPosts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const prompt = `Generate 6 blog post ideas for an eSIM company in Myanmar called "eSIM Myanmar". The posts should be relevant to tourists and locals. Topics can include travel tips for Myanmar, benefits of eSIM technology, local tech news, and comparisons. For each post, provide a catchy title, a short summary (2-3 sentences), a fictional author name, and a recent publication date.`;
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: Type.OBJECT,
                            properties: {
                                posts: {
                                    type: Type.ARRAY,
                                    description: "An array of 6 blog post objects.",
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            title: { type: Type.STRING, description: "The catchy title of the blog post." },
                                            summary: { type: Type.STRING, description: "A short summary of the post (2-3 sentences)." },
                                            author: { type: Type.STRING, description: "A fictional author's name (e.g., a Burmese or English name)." },
                                            date: { type: Type.STRING, description: "A recent, realistic publication date (e.g., 'August 5, 2024')." }
                                        },
                                        required: ["title", "summary", "author", "date"]
                                    }
                                }
                            },
                            required: ["posts"]
                        }
                    }
                });

                const [parseError, jsonResponse] = safeJsonParse(response.text.trim());

                if(parseError) {
                    console.error("Blog post parse error:", parseError);
                    throw new Error("Failed to parse blog posts from AI.");
                }

                if (jsonResponse.posts && Array.isArray(jsonResponse.posts)) {
                    setPosts(jsonResponse.posts);
                } else {
                    throw new Error("Invalid response format from AI.");
                }
            } catch (err) {
                console.error("Failed to generate blog posts:", err);
                setError(t('blog_error'));
            } finally {
                setIsLoading(false);
            }
        };

        generateBlogPosts();
    }, [t]);
    
    useEffect(() => {
        if (!isLoading && contentRef.current) {
            const { gsap } = window as any;
            if (gsap) {
                 gsap.fromTo(
                    contentRef.current.querySelectorAll('.blog-card'),
                    { opacity: 0, y: 30, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
                );
            }
        }
    }, [isLoading, posts]);

    return (
        <div ref={contentRef} className={`max-w-5xl mx-auto ${locale === 'my' ? 'font-myanmar' : ''}`}>
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{t('blog_title')}</h1>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto">{t('blog_subtitle')}</p>
            </div>

            {isLoading && (
                <div className="flex flex-col items-center justify-center min-h-[40vh]">
                    <SpinnerIcon />
                    <p className="mt-4 text-lg text-gray-300">{t('blog_loading')}</p>
                </div>
            )}

            {error && (
                <GlassCard className="border-status-red/50 bg-status-red/10 text-center">
                    <p className="text-red-300">{error}</p>
                </GlassCard>
            )}

            {!isLoading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <div key={index} className="blog-card h-full">
                            <GlassCard className="flex flex-col h-full">
                                <h2 className="text-xl font-bold text-secondary mb-2 flex-grow">{post.title}</h2>
                                <p className="text-gray-300 text-sm leading-relaxed mb-4">{post.summary}</p>
                                <div className="border-t border-white/10 pt-3 mt-auto text-xs text-gray-400 flex justify-between items-center">
                                    <span>{t('blog_author')}: {post.author}</span>
                                    <span>{post.date}</span>
                                </div>
                            </GlassCard>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Blog;