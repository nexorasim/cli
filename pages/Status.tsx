import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '../hooks/useI18n';
import { getServiceStatus, StatusResponse } from '../lib/api';

// Define missing types
export type ServiceStatus = 'OPERATIONAL' | 'DEGRADED' | 'OUTAGE';

export interface Service {
  id: string;
  name: string;
  status: ServiceStatus;
  message: string;
  latency: number;
}
import GlassCard from '../components/GlassCard';
import { usePageMetadata } from '../hooks/usePageMetadata';

const StatusIndicator: React.FC<{ status: ServiceStatus }> = ({ status }) => {
    const colorClass = {
        OPERATIONAL: 'bg-status-green',
        DEGRADED: 'bg-status-yellow animate-pulse-slow',
        OUTAGE: 'bg-status-red animate-pulse',
    }[status];
    return <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>;
};

const ServiceStatusCard: React.FC<{ service: Service }> = ({ service }) => {
    const { t } = useI18n();
    const statusText = {
        OPERATIONAL: t('status_operational'),
        DEGRADED: t('status_degraded'),
        OUTAGE: t('status_outage'),
    }[service.status];

    const textColor = {
        OPERATIONAL: 'text-status-green',
        DEGRADED: 'text-status-yellow',
        OUTAGE: 'text-status-red',
    }[service.status];

    return (
        <GlassCard className="!p-4 flex flex-col h-full">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-white">{service.name}</h3>
                <div className="text-sm font-semibold flex items-center gap-2">
                    <StatusIndicator status={service.status} />
                    <span className={textColor}>{statusText}</span>
                </div>
            </div>
            <p className="text-sm text-gray-400 mt-2 flex-grow">{service.message}</p>
            <p className="text-xs text-gray-500 mt-3 text-right">{service.latency}ms</p>
        </GlassCard>
    );
};


const StatusPage: React.FC = () => {
    const { t, locale } = useI18n();
    usePageMetadata('page_title_status', 'page_description_status');
    const [statusData, setStatusData] = useState<StatusResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let isMounted = true;
        
        const fetchStatus = async () => {
            try {
                const data = await getStatus();
                if (isMounted) {
                    setStatusData(data);
                    setError(null); // Clear error on successful fetch
                }
            } catch (err) {
                console.error("Failed to fetch status:", err);
                if (isMounted) {
                    // Set error immediately on failure
                    // This will show the error banner, while keeping stale data if available.
                    setError(t('status_loading_error'));
                }
            }
        };

        fetchStatus(); // Initial fetch
        const interval = setInterval(fetchStatus, 5000); // Poll every 5 seconds

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [t]);

    useEffect(() => {
        const { gsap } = window as any;
        if (gsap && contentRef.current && statusData) {
            gsap.fromTo(
                contentRef.current.querySelectorAll('.service-card'),
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.5, stagger: 0.05, ease: 'power3.out' }
            );
        }
    }, [statusData]);

    const OverallStatusBanner = () => {
        if (!statusData) return null;
        const status = statusData.overallStatus;
        const config = {
            OPERATIONAL: { text: t('status_overall_operational'), color: 'border-status-green/50 bg-status-green/10 text-status-green' },
            DEGRADED: { text: t('status_overall_degraded'), color: 'border-status-yellow/50 bg-status-yellow/10 text-status-yellow' },
            OUTAGE: { text: t('status_overall_outage'), color: 'border-status-red/50 bg-status-red/10 text-status-red' },
        }[status];

        return (
            <div className={`p-4 rounded-lg border text-center font-semibold mb-8 ${config.color}`}>
                {config.text}
            </div>
        );
    }

    return (
        <div ref={contentRef} className={`max-w-5xl mx-auto ${locale === 'my' ? 'font-myanmar' : ''}`}>
            <div className="text-center mb-6">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{t('status_title')}</h1>
                <p className="text-sm text-gray-400 font-mono">
                    {t('status_last_updated')} {statusData ? new Date(statusData.lastChecked).toLocaleString() : '...'}
                </p>
            </div>
            
            {error && <div className="p-4 rounded-lg border text-center font-semibold mb-8 border-status-red/50 bg-status-red/10 text-status-red">{error}</div>}
            
            {!statusData && !error && (
                <div className="text-center text-gray-400 py-10">Loading system status...</div>
            )}
            
            {statusData && (
                 <>
                    <OverallStatusBanner />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {statusData.services.map(service => (
                            <div key={service.id} className="service-card">
                                <ServiceStatusCard service={service} />
                            </div>
                        ))}
                    </div>
                 </>
            )}

        </div>
    );
};

export default StatusPage;