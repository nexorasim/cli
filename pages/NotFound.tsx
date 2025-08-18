import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';
import { usePageMetadata } from '../hooks/usePageMetadata';

const NotFound: React.FC = () => {
    const { t, locale } = useI18n();
    usePageMetadata('page_title_not_found', 'page_description_not_found');
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const { gsap } = window as any;
        if (gsap && contentRef.current) {
            gsap.fromTo(
                contentRef.current.children,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out' }
            );
        }
    }, []);

    return (
        <div ref={contentRef} className={`flex flex-col items-center justify-center text-center h-full min-h-[calc(100vh-13rem)] ${locale === 'my' ? 'font-myanmar' : ''}`}>
            <h1 className="text-8xl md:text-9xl font-extrabold text-secondary tracking-tighter">
                404
            </h1>
            <h2 className="mt-4 text-3xl md:text-5xl font-bold text-white">
                {t('not_found_title')}
            </h2>
            <p className="mt-4 max-w-md text-lg text-gray-300">
                {t('not_found_message')}
            </p>
            <div className="mt-8">
                <Link
                    to="/"
                    className="btn-primary"
                >
                    {t('not_found_cta')}
                </Link>
            </div>
        </div>
    );
};

export default NotFound;