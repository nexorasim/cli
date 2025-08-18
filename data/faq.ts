import { translations } from '../lib/i18n';

type TFunction = (key: keyof typeof translations.en) => string;

export interface FaqItem {
  q: string;
  a: string;
}

export const getFaqs = (t: TFunction): FaqItem[] => [
    { q: t('faq_q_what_is_esim'), a: t('faq_a_what_is_esim') },
    { q: t('faq_q_how_get_esim'), a: t('faq_a_how_get_esim') },
    { q: t('faq_q_phone_compatible'), a: t('faq_a_phone_compatible') },
    { q: t('faq_q_best_for_tourist'), a: t('faq_a_best_for_tourist') },
    { q: t('faq_q_internet_speed'), a: t('faq_a_internet_speed') },
    { q: t('faq_q_unlocked_phone'), a: t('faq_a_unlocked_phone') },
    { q: t('faq_q_dual_sim'), a: t('faq_a_dual_sim') },
    { q: t('faq_q_top_up'), a: t('faq_a_top_up')},
    { q: t('faq_q_data_plans'), a: t('faq_a_data_plans') },
    { q: t('faq_q_why_receipt'), a: t('faq_a_why_receipt') },
    { q: t('faq_q_ai_secure'), a: t('faq_a_ai_secure') },
    { q: t('faq_q_verification_fail'), a: t('faq_a_verification_fail') },
    { q: t('faq_q_nexora_difference'), a: t('faq_a_nexora_difference') },
    { q: t('faq_q_calls_sms'), a: t('faq_a_calls_sms') },
    { q: t('faq_q_operator_diff'), a: t('faq_a_operator_diff') },
    { q: t('faq_q_ai_time'), a: t('faq_a_ai_time') },
    { q: t('faq_q_keep_sim'), a: t('faq_a_keep_sim') },
].filter(faq => faq.q && faq.a);