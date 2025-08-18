import React from 'react';
import GlassCard from '../components/GlassCard';
import { useI18n } from '../hooks/useI18n';

const Create: React.FC = () => {
    const { locale } = useI18n();

    return (
        <div className={`max-w-4xl mx-auto text-white ${locale === 'my' ? 'font-myanmar' : ''}`}>
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Create Page</h1>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto">This page is currently under development.</p>
            </div>
            <GlassCard>
                <div className="text-center p-8">
                    <p className="text-gray-300">New creation functionalities will be available here soon.</p>
                </div>
            </GlassCard>
        </div>
    );
};

export default Create;