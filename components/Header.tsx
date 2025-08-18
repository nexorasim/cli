import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';
import { BRAND_INFO } from '../constants';
import { MenuIcon, CloseIcon } from './SocialIcons';

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <Link 
            to={to} 
            className={`relative px-3 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}`}
        >
            {isActive && <span className="absolute inset-0 bg-white/10 border border-white/20 rounded-full -z-10"></span>}
            {children}
        </Link>
    );
};

const Header: React.FC = () => {
    const { t, locale, setLocale } = useI18n();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleLocale = () => {
        setLocale(locale === 'en' ? 'my' : 'en');
    };
    
    const navLinks = [
        { to: "/", label: t('nav_home') },
        { to: "/buy-esim", label: t('nav_esim') },
        { to: "/compatibility", label: t('nav_compatibility') },
        { to: "/how-it-works", label: t('nav_how_it_works') },
        { to: "/partners", label: t('nav_partners') },
        { to: "/blog", label: t('nav_blog') },
        { to: "/help-center", label: t('nav_help_center') },
        { to: "/contact", label: t('nav_contact') },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 pt-4">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 glass-card rounded-2xl px-6">
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-bold text-white hover:text-secondary transition-colors">
                            {BRAND_INFO.name}
                        </Link>
                    </div>
                    <div className="hidden lg:block">
                        <div className={`flex items-center space-x-1 ${locale === 'my' ? 'font-myanmar' : ''}`}>
                            {navLinks.map(link => <NavLink key={link.to} to={link.to}>{link.label}</NavLink>)}
                            <button onClick={toggleLocale} className="btn-secondary ml-4 !text-sm !py-2 !px-3">
                                {locale === 'en' ? t('lang_my') : t('lang_en')}
                            </button>
                        </div>
                    </div>
                    <div className="lg:hidden flex items-center">
                         <button onClick={toggleLocale} className="btn-secondary !text-sm !py-2 !px-3 mr-2">
                                {locale === 'en' ? t('lang_my') : t('lang_en')}
                        </button>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded={isMenuOpen}>
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <CloseIcon className="h-6 w-6" />
                            ) : (
                                <MenuIcon className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
            <div className={`lg:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100 visible' : 'max-h-0 opacity-0 invisible'}`}>
                <div className={`px-4 pt-2 pb-3 space-y-1 sm:px-3 mt-2 glass-card rounded-2xl mx-4 ${locale === 'my' ? 'font-myanmar' : ''}`}>
                     {navLinks.map(link => 
                         <Link key={link.to} to={link.to} className="text-gray-200 hover:bg-white/5 hover:text-white block px-3 py-3 rounded-lg text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                             {link.label}
                         </Link>
                     )}
                </div>
            </div>
        </header>
    );
};

export default Header;