import React, { useEffect, useRef } from 'react';
import { useI18n } from '../hooks/useI18n';
import GlassCard from '../components/GlassCard';
import CodeBlock from '../components/CodeBlock';
import { usePageMetadata } from '../hooks/usePageMetadata';

const DevelopersPage: React.FC = () => {
    const { t, locale } = useI18n();
    usePageMetadata('page_title_developers', 'page_description_developers');
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const { gsap } = window as any;
        if (gsap && contentRef.current) {
            gsap.fromTo(
                contentRef.current.querySelectorAll('.animate-section'),
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
            );
        }
    }, []);

    const statusResponse = `{
  "overallStatus": "OPERATIONAL",
  "lastChecked": "2024-08-01T10:30:00.123Z",
  "services": [
    {
      "id": "rsp",
      "name": "RSP Server (LPA)",
      "status": "OPERATIONAL",
      "message": "All systems normal.",
      "latency": 54
    },
    ...
  ]
}`;

    const purchaseBody = `{
  "operator": "ATOM",
  "contactInfo": "09123456789"
}`;
    
    const purchaseCurl = `curl -X POST https://api.esim.com.mm/v1/purchase \\
     -H "Content-Type: application/json" \\
     -H "Authorization: Bearer YOUR_API_KEY" \\
     -d '{
       "operator": "ATOM",
       "contactInfo": "09123456789"
     }'`;

    const purchaseJS = `const purchaseESIM = async () => {
  const response = await fetch('https://api.esim.com.mm/v1/purchase', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY',
    },
    body: JSON.stringify({
      operator: 'ATOM',
      contactInfo: '09123456789',
    }),
  });
  const data = await response.json();
  console.log(data);
};`;
    
    const geminiPrompt = `Create a JSON object for my application's settings.
It needs three top-level keys: "api", "ui", and "features".
- The "api" object should have "baseUrl" (string) and "timeout" (number).
- The "ui" object should have "theme" ('dark' or 'light') and "language" ('en' or 'my').
- The "features" object should have "enableAnalytics" (boolean) and "showBetaFeatures" (boolean).`;

    return (
        <div ref={contentRef} className={`max-w-4xl mx-auto text-white ${locale === 'my' ? 'font-myanmar' : ''}`}>
            <div className="text-center mb-12 animate-section">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t('dev_title')}</h1>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto">{t('dev_intro')}</p>
            </div>

            <GlassCard className="mb-8 animate-section">
                <h2 className="text-2xl font-bold text-secondary">{t('dev_api_status_title')}</h2>
                <p className="text-gray-300 mt-2">{t('dev_api_status_desc')}</p>
                <h3 className="font-semibold text-gray-200 mt-4">{t('dev_api_status_response_title')}</h3>
                <CodeBlock>{statusResponse}</CodeBlock>
            </GlassCard>

            <GlassCard className="mb-8 animate-section">
                <h2 className="text-2xl font-bold text-secondary">{t('dev_api_purchase_title')}</h2>
                <p className="text-gray-300 mt-2">{t('dev_api_purchase_desc')}</p>

                <h3 className="font-semibold text-gray-200 mt-6">{t('dev_api_purchase_body_title')}</h3>
                <CodeBlock>{purchaseBody}</CodeBlock>
                
                <h3 className="font-semibold text-gray-200 mt-6">{t('dev_api_purchase_curl_title')}</h3>
                <CodeBlock lang="bash">{purchaseCurl}</CodeBlock>

                <h3 className="font-semibold text-gray-200 mt-6">{t('dev_api_purchase_js_title')}</h3>
                <CodeBlock lang="javascript">{purchaseJS}</CodeBlock>
            </GlassCard>

             <GlassCard className="mb-8 animate-section">
                <h2 className="text-2xl font-bold text-secondary">{t('dev_api_other_endpoints_title')}</h2>
                <p className="text-gray-300 mt-2">{t('dev_api_other_endpoints_desc')}</p>
                <ul className="list-disc list-inside mt-4 space-y-2 font-mono text-sm text-gray-300">
                    <li>{t('dev_api_activate')}</li>
                    <li>{t('dev_api_profile')}</li>
                </ul>
            </GlassCard>
            
            <GlassCard className="animate-section">
                <h2 className="text-2xl font-bold text-secondary">{t('dev_gemini_prompt_title')}</h2>
                <p className="text-gray-300 mt-2">{t('dev_gemini_prompt_desc')}</p>
                 <h3 className="font-semibold text-gray-200 mt-6">{t('dev_gemini_prompt_code_title')}</h3>
                <CodeBlock lang="text">{geminiPrompt}</CodeBlock>
            </GlassCard>
        </div>
    );
};

export default DevelopersPage;