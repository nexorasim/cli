import React from 'react';

const LogoShell: React.FC<{ children: React.ReactNode, name: string }> = ({ children, name }) => (
    <div className="w-full h-full flex flex-col items-center justify-center p-2">
        <div className="w-12 h-12 text-secondary">
            {children}
        </div>
        <span className="text-accent font-semibold text-sm text-center mt-2 block">{name}</span>
    </div>
);

export const TelecomLogo: React.FC<{ name: string }> = ({ name }) => (
    <LogoShell name={name}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.93,4.93a10,10,0,0,1,14.14,0" />
            <path d="M7.76,7.76a6,6,0,0,1,8.48,0" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
    </LogoShell>
);

export const FinancialLogo: React.FC<{ name: string }> = ({ name }) => (
    <LogoShell name={name}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    </LogoShell>
);

export const PaymentGatewayLogo: React.FC<{ name: string }> = ({ name }) => (
    <LogoShell name={name}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
    </LogoShell>
);

export const MarketingLogo: React.FC<{ name: string }> = ({ name }) => (
    <LogoShell name={name}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    </LogoShell>
);