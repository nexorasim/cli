import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '../hooks/useI18n';
import GlassCard from '../components/GlassCard';
import { usePageMetadata } from '../hooks/usePageMetadata';
import blogPosts, { BlogPost } from '../data/blog';
import { Link } from 'react-router-dom';

const CategoryBadge: React.FC<{ category: BlogPost['category'] }> = ({ category }) => {
    const colors = {
        'Travel': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        'Technology': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        'News': 'bg-green-500/20 text-green-300 border-green-500/30',
        'Tips': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
    };
    
    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${colors[category]}`}>
            {category}
        </span>
    );
};

const BlogCard: React.FC<{ post: BlogPost; index: number }> = ({ post, index }) => {
    const { t } = useI18n();
    
    return (
        <div className="blog-card group">
            <GlassCard className="h-full flex flex-col hover:border-cyan-400/30 transition-all duration-300 group-hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-4">
                    <CategoryBadge category={post.category} />
                    <span className="text-xs text-gray-400">{post.readTime} min read</span>
                </div>
                
                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {post.title}
                </h2>
                
                <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-grow">
                    {post.summary}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-slate-700/50 text-xs text-gray-400 rounded">
                            {tag}
                        </span>
                    ))}
                </div>
                
                <div className="border-t border-white/10 pt-4 mt-auto">
                    <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
                        <span>By {post.author}</span>
                        <span>{post.date}</span>
                    </div>
                    <button className="w-full px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:border-cyan-500 rounded-lg transition-all duration-300 font-medium">
                        Read Full Article
                    </button>
                </div>
            </GlassCard>
        </div>
    );
};

const Blog: React.FC = () => {
    const { t, locale } = useI18n();
    usePageMetadata('page_title_blog', 'page_description_blog');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(blogPosts);
    const contentRef = useRef<HTMLDivElement>(null);

    const categories = ['All', 'Travel', 'Technology', 'News', 'Tips'];

    useEffect(() => {
        if (selectedCategory === 'All') {
            setFilteredPosts(blogPosts);
        } else {
            setFilteredPosts(blogPosts.filter(post => post.category === selectedCategory));
        }
    }, [selectedCategory]);
    
    useEffect(() => {
        if (contentRef.current) {
            const { gsap } = window as any;
            if (gsap) {
                gsap.fromTo(
                    contentRef.current.querySelectorAll('.blog-card'),
                    { opacity: 0, y: 30, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
                );
            }
        }
    }, [filteredPosts]);

    return (
        <div ref={contentRef} className={`max-w-7xl mx-auto ${locale === 'my' ? 'font-myanmar' : ''}`}>
            {/* Header */}
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Our Blog</h1>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                    Latest news, travel tips, and tech insights from the eSIM Myanmar team
                </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                            selectedCategory === category
                                ? 'bg-cyan-500 text-slate-900'
                                : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600 hover:text-white'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, index) => (
                    <BlogCard key={post.id} post={post} index={index} />
                ))}
            </div>

            {filteredPosts.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-gray-400 text-lg">No posts found in this category.</p>
                </div>
            )}

            {/* Newsletter Signup */}
            <div className="mt-20">
                <GlassCard className="text-center max-w-2xl mx-auto">
                    <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
                    <p className="text-gray-300 mb-6">
                        Get the latest updates on eSIM technology and travel tips delivered to your inbox.
                    </p>
                    <div className="flex gap-3">
                        <input 
                            type="email" 
                            placeholder="Enter your email address"
                            className="flex-1 bg-slate-800/50 text-white placeholder-gray-400 border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                        <button className="px-6 py-3 bg-cyan-500 text-slate-900 font-semibold rounded-lg hover:bg-cyan-400 transition-colors">
                            Subscribe
                        </button>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default Blog;