
import React, { useState } from 'react';

const CheckIcon: React.FC = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const CopyIcon: React.FC = () => (
     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);


const CodeBlock: React.FC<{ children: React.ReactNode, lang?: string, className?: string }> = ({ children, lang, className }) => {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
        if (typeof children === 'string') {
            navigator.clipboard.writeText(children).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }).catch(err => console.error('Failed to copy text: ', err));
        }
    };

    return (
        <div className={`bg-primary/70 rounded-lg my-4 overflow-hidden border border-white/10 ${className} relative group`}>
            <div className="flex justify-between items-center bg-black/20 px-4 py-1.5">
                <span className="text-xs text-gray-400 font-sans">{lang || 'json'}</span>
                <button 
                  onClick={handleCopy} 
                  className="text-xs flex items-center gap-1.5 text-secondary hover:text-white transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
                  disabled={copied}
                >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <pre className="p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap break-words">
                <code>{children}</code>
            </pre>
        </div>
    );
};

export default CodeBlock;
