import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';
import { BRAND_INFO } from '../constants';
import { FacebookIcon, ViberIcon, TelegramIcon, YouTubeIcon, TikTokIcon } from './SocialIcons';

const SocialLink: React.FC<{ href: string; label: string; children: React.ReactNode }> = ({ href, label, children }) => (
    <a 
      href={href} 
      target="_blank" 
      rel="noreferrer" 
      className="glass-card !rounded-full w-10 h-10 flex items-center justify-center text-gray-300 hover:text-secondary hover:!border-secondary/30 transition-all duration-300 hover:shadow-secondary/20 transform hover:scale-110"
    >
      <span className="sr-only">{label}</span>
      {children}
    </a>
);

const Footer: React.FC = () => {
    const { t, locale } = useI18n();
    
    const footerClass = locale === 'my' ? 'font-myanmar' : '';

    return (
        <footer className={`bg-primary/50 backdrop-blur-md mt-16 ${footerClass}`} aria-labelledby="footer-heading">
             <h2 id="footer-heading" className="sr-only">Footer</h2>
            <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="md:col-span-4">
                        <p className="text-2xl font-bold text-white">{BRAND_INFO.name}</p>
                        <p className="text-gray-400 mt-4 text-sm max-w-xs leading-relaxed">
                            {t('page_description_home')}
                        </p>
                    </div>
                    <div className="md:col-span-2">
                        <h2 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">{t('footer_learn_more')}</h2>
                        <ul className="mt-4 space-y-4">
                            <li><Link to="/about" className="text-base text-gray-400 hover:text-secondary py-1 block">{t('nav_about')}</Link></li>
                            <li><Link to="/partners" className="text-base text-gray-400 hover:text-secondary py-1 block">{t('nav_partners')}</Link></li>
                            <li><Link to="/blog" className="text-base text-gray-400 hover:text-secondary py-1 block">{t('nav_blog')}</Link></li>
                            <li><Link to="/contact" className="text-base text-gray-400 hover:text-secondary py-1 block">{t('nav_contact')}</Link></li>
                            <li><Link to="/help-center" className="text-base text-gray-400 hover:text-secondary py-1 block">{t('nav_help_center')}</Link></li>
                            <li><Link to="/how-it-works" className="text-base text-gray-400 hover:text-secondary py-1 block">{t('nav_how_it_works')}</Link></li>
                        </ul>
                    </div>
                    <div className="md:col-span-2">
                        <h2 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">{t('footer_legal')}</h2>
                        <ul className="mt-4 space-y-4">
                            <li><Link to="/privacy-policy" className="text-base text-gray-400 hover:text-secondary py-1 block">{t('footer_privacy')}</Link></li>
                            <li><Link to="/terms-of-service" className="text-base text-gray-400 hover:text-secondary py-1 block">{t('footer_terms')}</Link></li>
                            <li><Link to="/refund-policy" className="text-base text-gray-400 hover:text-secondary py-1 block">{t('footer_refund')}</Link></li>
                        </ul>
                    </div>
                    <div className="md:col-span-4">
                        <h2 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">{t('footer_contact_us')}</h2>
                        <div className="flex space-x-3 mt-4">
                            <SocialLink href={BRAND_INFO.social.facebook} label="Facebook"><FacebookIcon /></SocialLink>
                            <SocialLink href={BRAND_INFO.social.viber} label="Viber"><ViberIcon /></SocialLink>
                            <SocialLink href={BRAND_INFO.social.telegram} label="Telegram"><TelegramIcon /></SocialLink>
                            <SocialLink href={BRAND_INFO.social.youtube} label="YouTube"><YouTubeIcon /></SocialLink>
                            <SocialLink href={BRAND_INFO.social.tiktok} label="TikTok"><TikTokIcon /></SocialLink>
                        </div>
                         <div className="mt-6 text-sm text-gray-400 space-y-1">
                            <p>{BRAND_INFO.fullName}</p>
                            <p>{BRAND_INFO.email}</p>
                            <p>{BRAND_INFO.phone}</p>
                            <p className="leading-relaxed">{BRAND_INFO.address}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-16 border-t border-white/10 pt-8 text-center">
                    <p className="text-base text-gray-400">&copy; {new Date().getFullYear()} {BRAND_INFO.name}. {t('footer_rights_reserved')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;