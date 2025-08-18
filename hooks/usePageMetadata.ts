import { useEffect } from 'react';
import { useI18n } from './useI18n';
import type { translations } from '../lib/i18n';

type TranslationKey = keyof typeof translations.en;

export const usePageMetadata = (titleKey: TranslationKey, descriptionKey: TranslationKey) => {
    const { t, locale } = useI18n();

    useEffect(() => {
        const title = t(titleKey);
        const description = t(descriptionKey);

        document.title = title;
        
        const selectors: { [key: string]: string } = {
            'meta[name="description"]': description,
            'meta[property="og:title"]': title,
            'meta[property="og:description"]': description,
            'meta[property="twitter:title"]': title,
            'meta[property="twitter:description"]': description,
        };

        Object.entries(selectors).forEach(([selector, content]) => {
            const element = document.querySelector(selector);
            if (element) {
                element.setAttribute('content', content);
            }
        });

    }, [t, locale, titleKey, descriptionKey]);
};