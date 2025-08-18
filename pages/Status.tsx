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
                const data = await getServiceStatus();
                if (isMounted) {
                    setStatusData(data);
                    setError(null);
                }
            } catch (err) {
                console.error("Failed to fetch status:", err);
                if (isMounted) {
                    setError('Failed to load status');
                }
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 5000);

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
        const status = statusData.status;
        const config = {
            OPERATIONAL: { text: 'All Systems Operational', color: 'border-green-500/50 bg-green-500/10 text-green-400' },
            DEGRADED: { text: 'Some Systems Degraded', color: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400' },
            OUTAGE: { text: 'System Outage', color: 'border-red-500/50 bg-red-500/10 text-red-400' },
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
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">System Status</h1>
                <p className="text-sm text-gray-400 font-mono">
                    Last updated: {statusData ? new Date(statusData.lastChecked).toLocaleString() : '...'}
                </p>
            </div>
            
            {error && <div className="p-4 rounded-lg border text-center font-semibold mb-8 border-red-500/50 bg-red-500/10 text-red-400">{error}</div>}
            
            {!statusData && !error && (
                <div className="text-center text-gray-400 py-10">Loading system status...</div>
            )}
            
            {statusData && (
                 <>
                    <OverallStatusBanner />
                    <div className="grid grid-cols-1 gap-4">
                        <div className="service-card">
                            <GlassCard className="!p-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-white">eSIM Myanmar Service</h3>
                                    <div className="text-sm font-semibold flex items-center gap-2">
                                        <StatusIndicator status={statusData.status} />
                                        <span className={statusData.status === 'OPERATIONAL' ? 'text-green-400' : statusData.status === 'DEGRADED' ? 'text-yellow-400' : 'text-red-400'}>
                                            {statusData.status}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-400 mt-2">{statusData.message}</p>
                                <div className="flex justify-between mt-4 text-xs text-gray-500">
                                    <span>Uptime: {statusData.uptime}%</span>
                                    <span>Response Time: {statusData.responseTime}ms</span>
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                 </>
            )}

        </div>
    );
};

export default StatusPage;