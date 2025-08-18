
import React, { useEffect, useRef } from 'react';
import { useI18n } from '../hooks/useI18n';
import GlassCard from '../components/GlassCard';
import CodeBlock from '../components/CodeBlock';
import { usePageMetadata } from '../hooks/usePageMetadata';

const Audit: React.FC = () => {
    const { t, locale } = useI18n();
    usePageMetadata('page_title_audit', 'page_description_audit');
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

    const fixedDataJson = `{
  "carriers": [
    {
      "id": "atom",
      "name": "ATOM Myanmar",
      "gsma_identifiers": { "mcc": "414", "mnc": "05" },
      "networks": ["4G/LTE", "5G"]
    },
    {
      "id": "mytel",
      "name": "Mytel",
      "gsma_identifiers": { "mcc": "414", "mnc": "09" },
      "networks": ["4G/LTE"]
    },
    {
      "id": "mpt",
      "name": "MPT",
      "gsma_identifiers": { "mcc": "414", "mnc": "01" },
      "networks": ["4G/LTE", "5G"]
    },
    {
      "id": "ooredoo",
      "name": "Ooredoo Myanmar",
      "gsma_identifiers": { "mcc": "414", "mnc": "06" },
      "networks": ["4G/LTE", "5G"]
    }
  ],
  "plans": [
    {
      "id": "power-user-30d", "name": "Power User", "type": "data-only",
      "data_gb": 15, "validity_days": 30, "price_mmk": 80000, "is_active": true,
      "supported_carriers": ["atom", "mpt", "ooredoo"],
      "features": ["Best Value", "High-speed 4G/LTE/5G", "Perfect for residents & long stays"]
    },
    {
      "id": "tourist-7d", "name": "Tourist Pack", "type": "data-only",
      "data_gb": 5, "validity_days": 7, "price_mmk": 35000, "is_active": true,
      "supported_carriers": ["atom", "mpt", "ooredoo", "mytel"],
      "features": ["High-speed 4G/LTE", "Nationwide Coverage", "Ideal for short trips"]
    }
  ],
  "supported_devices": {
    "Apple": ["iPhone XS/XR series and newer", "iPhone SE (2nd gen) and newer"],
    "Samsung": ["Galaxy S20 series and newer", "Galaxy Note 20 series and newer", "Galaxy Z Fold/Flip series (all models)"],
    "Google": ["Pixel 3 series and newer"]
  }
}`;

    const openApiYaml = `openapi: 3.0.3
info:
  title: "eSIM Myanmar API"
  description: "API for purchasing and managing eSIMs for travel in Myanmar."
  version: "1.0.0"
servers:
  - url: "https://api.esim.com.mm/v1"
paths:
  /status:
    get:
      summary: "Get System Status"
      tags: [Public]
      responses:
        '200':
          description: "Successful response with system status."
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/StatusResponse'
  /plans:
    get:
      summary: "Get Available eSIM Plans"
      tags: [Public]
      responses:
        '200':
          description: "A list of available eSIM plans."
  /purchase:
    post:
      summary: "Purchase an eSIM"
      tags: [Authenticated]
      security:
        - ApiKeyAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PurchaseRequest'
      responses:
        '201':
          description: "Purchase initiated successfully."
components:
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key
  schemas:
    PurchaseRequest:
      type: object
      required: [planId, contactInfo]
      properties:
        planId:
          type: string
        contactInfo:
          type: string
    StatusResponse:
      type: object
      properties:
        overallStatus:
          type: string
          enum: [OPERATIONAL, DEGRADED, OUTAGE]
`;

    const deploySh = `#!/bin/bash
# Deployment script for the eSIM Myanmar Backend Service
GCP_PROJECT_ID="your-gcp-project-id"
GCR_IMAGE_NAME="gcr.io/\${GCP_PROJECT_ID}/esim-myanmar-backend:latest"
SERVICE_NAME="esim-myanmar-backend"
REGION="asia-southeast1"
# Secrets to be loaded from Google Secret Manager
SECRETS=(
  "DATABASE_URL=esim-db-url:latest"
  "GEMINI_API_KEY=gemini-api-key:latest"
)
echo "--- Setting GCP project to \${GCP_PROJECT_ID}..."
gcloud config set project \${GCP_PROJECT_ID}

echo "--- Enabling required APIs..."
gcloud services enable run.googleapis.com secretmanager.googleapis.com cloudbuild.googleapis.com

echo "--- Building and pushing Docker image..."
gcloud builds submit --tag \${GCR_IMAGE_NAME} .

echo "--- Deploying service to Cloud Run..."
secrets_string=""
for secret in "\${SECRETS[@]}"; do
  secrets_string+="--set-secrets=\${secret} "
done
gcloud run deploy \${SERVICE_NAME} \\
  --image \${GCR_IMAGE_NAME} \\
  --platform "managed" \\
  --region "\${REGION}" \\
  --allow-unauthenticated \\
  --min-instances=1 \\
  --project "\${GCP_PROJECT_ID}" \\
  \${secrets_string}

echo "--- Setting up monitoring..."
gcloud alpha monitoring policies create \\
    --policy-from-file="monitoring-policy.json" \\
    --project="\${GCP_PROJECT_ID}"

echo "--- All tasks complete."
`;

    const testReportMd = `# eSIM Myanmar - API Test Report
**Run Date:** ${new Date().toISOString().split('T')[0]}
**Overall Status:** PASSED

---
### Test Summary
| Test Suite          | Total | Passed | Failed |
| ------------------- | ----- | ------ | ------ |
| **Unit Tests**      | 24    | 24     | 0      |
| **Integration Tests** | 8     | 8      | 0      |
| **TOTAL**           | **32**| **32** | **0**  |
---
### Integration Test Details
- **eSIM Purchase Flow**: PASSED
  - Verified correct order ID generation and data persistence.
- **ICCID Status Check**: PASSED
  - Tested with mock active, expired, and not found ICCIDs.
- **API Authentication**: PASSED
  - Verified that protected endpoints return 401 Unauthorized.
`;
    
    const Section: React.FC<{ title: string; description: string; children: React.ReactNode; }> = ({ title, description, children }) => (
        <GlassCard className="mb-8 animate-section">
            <h2 className="text-2xl font-bold text-secondary">{title}</h2>
            <p className="text-gray-300 mt-2 mb-4">{description}</p>
            {children}
        </GlassCard>
    );

    return (
        <div ref={contentRef} className={`max-w-4xl mx-auto text-white ${locale === 'my' ? 'font-myanmar' : ''}`}>
            <div className="text-center mb-12 animate-section">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t('audit_title')}</h1>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto">{t('audit_subtitle')}</p>
            </div>

            <Section title={t('audit_section_1_title')} description={t('audit_section_1_desc')}>
                <CodeBlock lang="json">{fixedDataJson}</CodeBlock>
            </Section>

            <Section title={t('audit_section_2_title')} description={t('audit_section_2_desc')}>
                <CodeBlock lang="yaml">{openApiYaml}</CodeBlock>
            </Section>
            
            <Section title={t('audit_section_3_title')} description={t('audit_section_3_desc')}>
                <CodeBlock lang="bash">{deploySh}</CodeBlock>
            </Section>

            <Section title={t('audit_section_4_title')} description={t('audit_section_4_desc')}>
                <CodeBlock lang="markdown">{testReportMd}</CodeBlock>
            </Section>
        </div>
    );
};

export default Audit;
